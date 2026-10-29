import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetikerBoldJson from '../assets/helvetiker_bold.typeface.json';
import helvetikerRegularJson from '../assets/helvetiker_regular.typeface.json';

const fontLoader = new FontLoader();
const fontBold = fontLoader.parse(helvetikerBoldJson);
const fontRegular = fontLoader.parse(helvetikerRegularJson);

export default function ScreensaverCanvas({ settings, onCanvasClick }) {
  const containerRef = useRef(null);
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    mainGroup: null,
    meshGroup: null,
    texture: null,
    reflectionTexture: null,
    animFrameId: null,
    prevTime: 0,
    bouncePos: { x: 0, y: 0 },
    bounceVel: { x: 1.2, y: 0.9 },
    timeString: '',
    timeTimerId: null,
  });

  // Keep settings fresh in ref for animation loop
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Rebuild 3D geometry when relevant settings change
  const rebuildGeometry = useCallback(() => {
    const { meshGroup, texture, reflectionTexture } = stateRef.current;
    if (!meshGroup) return;

    // Clear previous children
    while (meshGroup.children.length > 0) {
      const child = meshGroup.children[0];
      meshGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
    }

    const currentSettings = settingsRef.current;
    const {
      displaySource,
      customText,
      fontFamily,
      surfaceStyle,
      customColor,
      specularColor,
      shininess,
      resolution,
      size,
      imageAspect = 1.33,
    } = currentSettings;

    // Compute resolution settings:
    // Low (1) to High (5)
    const curveSegments = Math.max(3, Math.round(resolution * 4)); // 4 to 20
    const bevelSegments = Math.max(1, Math.round(resolution * 2)); // 2 to 10
    const scaleFactor = 0.6 + (size - 1) * 0.22; // 0.6 to 1.5

    // Build materials
    let frontMaterial, sideMaterial;
    const colorNum = parseInt(customColor.replace('#', '0x'), 16) || 0x2b78e4;
    const specNum = parseInt(specularColor.replace('#', '0x'), 16) || 0xffffff;

    if (surfaceStyle === 'solid') {
      frontMaterial = new THREE.MeshPhongMaterial({
        color: colorNum,
        specular: specNum,
        shininess: shininess,
        flatShading: resolution <= 1,
      });
      sideMaterial = frontMaterial;
    } else if (surfaceStyle === 'reflection') {
      frontMaterial = new THREE.MeshPhongMaterial({
        color: colorNum,
        envMap: reflectionTexture || texture,
        reflectivity: 0.95,
        specular: specNum,
        shininess: shininess,
        flatShading: resolution <= 1,
      });
      sideMaterial = frontMaterial;
    } else {
      // 'textured' (default)
      frontMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        specular: specNum,
        shininess: shininess,
        flatShading: resolution <= 1,
      });
      // Side material: high-contrast chrome / custom color border
      sideMaterial = new THREE.MeshPhongMaterial({
        color: colorNum,
        specular: specNum,
        shininess: shininess,
        flatShading: resolution <= 1,
      });
    }

    // Geometry Generation
    if (displaySource === 'image' || displaySource === 'relief') {
      // 3D Beveled Image Plaque
      const baseW = 28 * scaleFactor;
      const aspect = Math.max(0.4, Math.min(2.5, imageAspect || 1.33));
      const width = aspect >= 1 ? baseW : baseW * aspect;
      const height = aspect >= 1 ? baseW / aspect : baseW;
      const depth = 2.4 * scaleFactor;
      const radius = 1.2 * scaleFactor;

      const shape = new THREE.Shape();
      const x = -width / 2;
      const y = -height / 2;
      shape.moveTo(x + radius, y);
      shape.lineTo(x + width - radius, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + radius);
      shape.lineTo(x + width, y + height - radius);
      shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      shape.lineTo(x + radius, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - radius);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);

      const geom = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.8 * scaleFactor,
        bevelSize: 0.6 * scaleFactor,
        bevelOffset: 0,
        bevelSegments: bevelSegments,
        curveSegments: curveSegments,
      });

      // Update UVs for front face planar projection
      geom.computeBoundingBox();
      const bbox = geom.boundingBox;
      const minX = bbox.min.x, maxX = bbox.max.x;
      const minY = bbox.min.y, maxY = bbox.max.y;
      const rangeX = maxX - minX || 1;
      const rangeY = maxY - minY || 1;

      const pos = geom.attributes.position;
      const uv = geom.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        uv.setXY(i, (px - minX) / rangeX, (py - minY) / rangeY);
      }
      uv.needsUpdate = true;
      geom.center();

      const mesh = new THREE.Mesh(geom, [frontMaterial, sideMaterial]);
      meshGroup.add(mesh);
    } else if (displaySource === 'cube') {
      // 3D Photo Cube with beveled corners
      const cubeSize = 22 * scaleFactor;
      const geom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, bevelSegments + 1, bevelSegments + 1, bevelSegments + 1);
      const mesh = new THREE.Mesh(geom, frontMaterial);
      meshGroup.add(mesh);
    } else {
      // 3D Text or Time
      const font = fontFamily === 'helvetiker_regular' ? fontRegular : fontBold;
      const textToRender = displaySource === 'time'
        ? (stateRef.current.timeString || '12:00:00 PM')
        : (customText || '3D IMAGE');

      const textGeom = new TextGeometry(textToRender, {
        font: font,
        size: 8.5 * scaleFactor,
        depth: 3.5 * scaleFactor,
        curveSegments: curveSegments,
        bevelEnabled: true,
        bevelThickness: 0.7 * scaleFactor,
        bevelSize: 0.4 * scaleFactor,
        bevelOffset: 0,
        bevelSegments: bevelSegments,
      });

      // Apply planar UV mapping across the text face
      textGeom.computeBoundingBox();
      const bbox = textGeom.boundingBox;
      const minX = bbox.min.x, maxX = bbox.max.x;
      const minY = bbox.min.y, maxY = bbox.max.y;
      const rangeX = maxX - minX || 1;
      const rangeY = maxY - minY || 1;

      const pos = textGeom.attributes.position;
      const uv = textGeom.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        uv.setXY(i, (px - minX) / rangeX, (py - minY) / rangeY);
      }
      uv.needsUpdate = true;
      textGeom.center();

      const textMesh = new THREE.Mesh(textGeom, [frontMaterial, sideMaterial]);
      meshGroup.add(textMesh);
    }
  }, []);

  // Load image texture whenever imageSrc changes
  useEffect(() => {
    if (!settings.imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = settings.imageSrc;
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;

      // Reflection texture
      const refTex = tex.clone();
      refTex.mapping = THREE.EquirectangularReflectionMapping;
      refTex.needsUpdate = true;

      if (stateRef.current.texture) stateRef.current.texture.dispose();
      if (stateRef.current.reflectionTexture) stateRef.current.reflectionTexture.dispose();

      stateRef.current.texture = tex;
      stateRef.current.reflectionTexture = refTex;

      // Rebuild geometry with new texture
      rebuildGeometry();
    };
  }, [settings.imageSrc, rebuildGeometry]);

  // Handle live time ticking for 'time' mode
  useEffect(() => {
    if (settings.displaySource === 'time') {
      const updateClock = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (stateRef.current.timeString !== timeStr) {
          stateRef.current.timeString = timeStr;
          rebuildGeometry();
        }
      };
      updateClock();
      const interval = setInterval(updateClock, 1000);
      return () => clearInterval(interval);
    }
  }, [settings.displaySource, rebuildGeometry]);


  // Re-trigger rebuild on relevant settings changes
  useEffect(() => {
    rebuildGeometry();
  }, [
    settings.displaySource,
    settings.customText,
    settings.fontFamily,
    settings.surfaceStyle,
    settings.customColor,
    settings.specularColor,
    settings.shininess,
    settings.resolution,
    settings.size,
    settings.imageAspect,
    rebuildGeometry,
  ]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 70);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Classic Screensaver Gouraud/Phong Lighting:
    // Key directional light with high specular intensity
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(40, 50, 60);
    scene.add(keyLight);

    // Rim/accent light for 3D metallic edges
    const rimLight = new THREE.DirectionalLight(0x77aaff, 0.8);
    rimLight.position.set(-50, -30, 40);
    scene.add(rimLight);

    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(0x404040, 1.1);
    scene.add(ambientLight);

    // Top subtle warm light
    const topLight = new THREE.PointLight(0xffeedd, 0.6, 200);
    topLight.position.set(0, 60, 30);
    scene.add(topLight);

    const mainGroup = new THREE.Group();
    const meshGroup = new THREE.Group();
    mainGroup.add(meshGroup);
    scene.add(mainGroup);

    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.renderer = renderer;
    stateRef.current.mainGroup = mainGroup;
    stateRef.current.meshGroup = meshGroup;

    // Initial geometry build
    rebuildGeometry();

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let elapsed = 0;
    const animate = (currentTime) => {
      stateRef.current.animFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - stateRef.current.prevTime) / 1000, 0.1);
      stateRef.current.prevTime = currentTime;
      elapsed += delta;

      const current = settingsRef.current;
      const rotSpeed = current.rotationSpeed || 5; // 1 to 10
      // Map 1-10 to animation speed factor: 1 = 0.3x, 5 = 1.0x, 10 = 2.4x
      const speedFactor = 0.2 + (rotSpeed / 5) * 0.8;
      const rotType = current.rotationType || 'spin';

      // 1. ROTATION PATTERNS (Authentic Windows 3D Text algorithm)
      if (rotType === 'spin') {
        meshGroup.rotation.y += delta * 1.8 * speedFactor;
        meshGroup.rotation.x = Math.sin(elapsed * 0.6 * speedFactor) * 0.15;
        meshGroup.rotation.z = 0;
        meshGroup.scale.set(1, 1, 1);
      } else if (rotType === 'bloom') {
        // Gyro rotation + cyclic breathing scale bloom
        meshGroup.rotation.y += delta * 2.2 * speedFactor;
        meshGroup.rotation.x = Math.sin(elapsed * 1.3 * speedFactor) * 1.1;
        meshGroup.rotation.z = Math.cos(elapsed * 0.9 * speedFactor) * 0.7;
        const bloomScale = 1.0 + 0.35 * Math.sin(elapsed * 2.2 * speedFactor);
        meshGroup.scale.set(bloomScale, bloomScale, bloomScale);
      } else if (rotType === 'wobble') {
        // Dynamic harmonic pendulum sway
        meshGroup.rotation.y = Math.sin(elapsed * 2.4 * speedFactor) * 0.95;
        meshGroup.rotation.x = Math.cos(elapsed * 1.8 * speedFactor) * 0.5;
        meshGroup.rotation.z = Math.sin(elapsed * 1.2 * speedFactor) * 0.35;
        meshGroup.scale.set(1, 1, 1);
      } else if (rotType === 'seesaw') {
        // Left-right rhythmic seesaw tilt
        meshGroup.rotation.z = Math.sin(elapsed * 2.6 * speedFactor) * 0.85;
        meshGroup.rotation.x = Math.sin(elapsed * 1.3 * speedFactor) * 0.25;
        meshGroup.rotation.y = Math.cos(elapsed * 0.7 * speedFactor) * 0.4;
        meshGroup.scale.set(1, 1, 1);
      } else if (rotType === 'tumble') {
        // Unconstrained tumbling roll across all 3 axes
        meshGroup.rotation.x += delta * 1.3 * speedFactor;
        meshGroup.rotation.y += delta * 1.9 * speedFactor;
        meshGroup.rotation.z += delta * 0.9 * speedFactor;
        meshGroup.scale.set(1, 1, 1);
      } else {
        // 'none'
        meshGroup.rotation.set(0.1, 0.25, 0);
        meshGroup.scale.set(1, 1, 1);
      }

      // 2. BOUNCING MOTION (Screensaver Drift & Border Bounce)
      if (current.bouncing) {
        const { bouncePos, bounceVel } = stateRef.current;
        const driftSpeed = 9 * speedFactor;
        bouncePos.x += bounceVel.x * driftSpeed * delta;
        bouncePos.y += bounceVel.y * driftSpeed * delta;

        // Determine view bounds based on aspect ratio
        const boundX = Math.max(12, 18 * camera.aspect);
        const boundY = 14;

        if (bouncePos.x > boundX) {
          bouncePos.x = boundX;
          bounceVel.x = -Math.abs(bounceVel.x);
        } else if (bouncePos.x < -boundX) {
          bouncePos.x = -boundX;
          bounceVel.x = Math.abs(bounceVel.x);
        }

        if (bouncePos.y > boundY) {
          bouncePos.y = boundY;
          bounceVel.y = -Math.abs(bounceVel.y);
        } else if (bouncePos.y < -boundY) {
          bouncePos.y = -boundY;
          bounceVel.y = Math.abs(bounceVel.y);
        }

        mainGroup.position.set(bouncePos.x, bouncePos.y, 0);
      } else {
        // Smoothly interpolate back to center
        mainGroup.position.x += (0 - mainGroup.position.x) * 0.05;
        mainGroup.position.y += (0 - mainGroup.position.y) * 0.05;
      }

      renderer.render(scene, camera);
    };

    const currentState = stateRef.current;
    currentState.animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentState.animFrameId) {
        cancelAnimationFrame(currentState.animFrameId);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [rebuildGeometry]);

  return (
    <div
      ref={containerRef}
      onClick={onCanvasClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000000',
        cursor: 'default',
      }}
    />
  );
}
