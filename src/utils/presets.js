// High-quality procedural retro preset textures generated on HTML5 canvas

function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// 1. Classic Windows 95/98 Flying Flag Logo
export function generateWindowsLogoPreset() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  
  // Retro deep twilight gradient background
  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#000080');
  bg.addColorStop(0.5, '#1084d0');
  bg.addColorStop(1, '#000040');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle scanlines / stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 40; i++) {
    const sx = Math.sin(i * 123) * 250 + 256;
    const sy = Math.cos(i * 321) * 250 + 256;
    ctx.fillRect(sx, sy, 2, 2);
  }

  ctx.save();
  ctx.translate(256, 230);
  ctx.rotate(-0.15);

  // Draw 4 iconic flying window panes
  const size = 68;
  const gap = 12;

  // Red (Top Left)
  ctx.fillStyle = '#ff3333';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 8;
  ctx.beginPath();
  ctx.moveTo(-size - gap/2, -size - gap/2);
  ctx.bezierCurveTo(-size/2, -size - gap/2 - 10, -gap/2, -size - gap/2 + 5, -gap/2, -gap/2);
  ctx.lineTo(-size - gap/2, -gap/2);
  ctx.closePath();
  ctx.fill();

  // Green (Top Right)
  ctx.fillStyle = '#33cc33';
  ctx.beginPath();
  ctx.moveTo(gap/2, -size - gap/2);
  ctx.bezierCurveTo(size/2, -size - gap/2 + 10, size + gap/2, -size - gap/2 - 5, size + gap/2, -gap/2);
  ctx.lineTo(gap/2, -gap/2);
  ctx.closePath();
  ctx.fill();

  // Blue (Bottom Left)
  ctx.fillStyle = '#3388ff';
  ctx.beginPath();
  ctx.moveTo(-size - gap/2, gap/2);
  ctx.lineTo(-gap/2, gap/2);
  ctx.bezierCurveTo(-gap/2, size/2 + 10, -size/2, size + gap/2 - 5, -size - gap/2, size + gap/2);
  ctx.closePath();
  ctx.fill();

  // Yellow (Bottom Right)
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.moveTo(gap/2, gap/2);
  ctx.lineTo(size + gap/2, gap/2);
  ctx.bezierCurveTo(size + gap/2, size/2 + 10, size/2, size + gap/2 - 5, gap/2, size + gap/2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Typography
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Microsoft', 256, 380);
  ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Windows', 256, 435);

  return canvas.toDataURL('image/png');
}

// 2. Windows XP Bliss Rolling Hills
export function generateBlissPreset() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#0055bb');
  sky.addColorStop(0.6, '#3399ee');
  sky.addColorStop(1, '#88ccff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 320);

  // Fluffy clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const drawCloud = (cx, cy, scale) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 30 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 25 * scale, cy - 10 * scale, 35 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 60 * scale, cy - 5 * scale, 28 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 80 * scale, cy + 5 * scale, 22 * scale, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCloud(60, 100, 1.2);
  drawCloud(280, 140, 1.6);
  drawCloud(180, 60, 0.9);

  // Rolling lush green hills
  // Back hill
  const hill1 = ctx.createLinearGradient(0, 200, 0, 512);
  hill1.addColorStop(0, '#55aa22');
  hill1.addColorStop(1, '#226600');
  ctx.fillStyle = hill1;
  ctx.beginPath();
  ctx.moveTo(0, 320);
  ctx.bezierCurveTo(150, 240, 320, 270, 512, 220);
  ctx.lineTo(512, 512);
  ctx.lineTo(0, 512);
  ctx.closePath();
  ctx.fill();

  // Front prominent hill
  const hill2 = ctx.createLinearGradient(0, 260, 0, 512);
  hill2.addColorStop(0, '#77dd22');
  hill2.addColorStop(0.5, '#44aa11');
  hill2.addColorStop(1, '#115500');
  ctx.fillStyle = hill2;
  ctx.beginPath();
  ctx.moveTo(0, 280);
  ctx.bezierCurveTo(180, 290, 280, 210, 512, 290);
  ctx.lineTo(512, 512);
  ctx.lineTo(0, 512);
  ctx.closePath();
  ctx.fill();

  // Vignette / sunny warm glow
  const sun = ctx.createRadialGradient(420, 60, 10, 420, 60, 180);
  sun.addColorStop(0, 'rgba(255, 255, 200, 0.5)');
  sun.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, 512, 512);

  return canvas.toDataURL('image/png');
}

// 3. Retro OpenGL 3D Badge
export function generateOpenGLPreset() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  // Deep tech background
  ctx.fillStyle = '#0a0e17';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle blue wireframe grid
  ctx.strokeStyle = 'rgba(0, 150, 255, 0.2)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // OpenGL 3D Faceted Diamond / Cube
  ctx.save();
  ctx.translate(256, 210);

  // Top facet
  ctx.fillStyle = '#00aaff';
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.lineTo(80, -40);
  ctx.lineTo(0, 10);
  ctx.lineTo(-80, -40);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left facet
  ctx.fillStyle = '#0055aa';
  ctx.beginPath();
  ctx.moveTo(-80, -40);
  ctx.lineTo(0, 10);
  ctx.lineTo(0, 110);
  ctx.lineTo(-80, 60);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right facet
  ctx.fillStyle = '#0088ee';
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(80, -40);
  ctx.lineTo(80, 60);
  ctx.lineTo(0, 110);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // OpenGL text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 58px "Courier New", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#00aaff';
  ctx.shadowBlur = 15;
  ctx.fillText('OpenGL', 256, 390);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#00ccff';
  ctx.fillText('3D HARDWARE ACCELERATED', 256, 435);

  return canvas.toDataURL('image/png');
}

// 4. Synthwave Neon Sunset
export function generateSynthwavePreset() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#0c0721');
  sky.addColorStop(0.5, '#2b0938');
  sky.addColorStop(1, '#5c104e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 320);

  // Glowing Retro Sun
  const sunGrad = ctx.createLinearGradient(0, 100, 0, 260);
  sunGrad.addColorStop(0, '#ffee55');
  sunGrad.addColorStop(1, '#ff0055');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(256, 210, 85, 0, Math.PI * 2);
  ctx.fill();

  // Sun horizontal blind slits
  ctx.fillStyle = '#2b0938';
  for (let i = 0; i < 7; i++) {
    const y = 200 + i * 11;
    const h = 2 + i * 1.2;
    ctx.fillRect(160, y, 192, h);
  }

  // Perspective 3D Neon Grid Floor
  const ground = ctx.createLinearGradient(0, 320, 0, 512);
  ground.addColorStop(0, '#100020');
  ground.addColorStop(1, '#000000');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 320, 512, 192);

  ctx.strokeStyle = '#ff00aa';
  ctx.lineWidth = 2;
  // Vanishing point lines
  for (let i = -10; i <= 20; i++) {
    ctx.beginPath();
    ctx.moveTo(256, 320);
    ctx.lineTo(i * 45, 512);
    ctx.stroke();
  }
  // Horizontal perspective lines
  for (let j = 1; j <= 8; j++) {
    const y = 320 + Math.pow(j / 8, 2) * 192;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

// 5. Classic Chrome Liquid Metal
export function generateChromePreset() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  // Horizon reflective chrome bands
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#223344');
  grad.addColorStop(0.35, '#88aacc');
  grad.addColorStop(0.48, '#ffffff');
  grad.addColorStop(0.50, '#111111');
  grad.addColorStop(0.52, '#d48822');
  grad.addColorStop(0.70, '#ffcc66');
  grad.addColorStop(0.85, '#442200');
  grad.addColorStop(1, '#110800');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Chrome text
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 12;
  ctx.font = '900 64px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('3D TEXT', 256, 240);
  ctx.font = 'bold 36px "Segoe UI", sans-serif';
  ctx.fillText('CHROME 2000', 256, 300);

  return canvas.toDataURL('image/png');
}

export const PRESET_IMAGES = [
  {
    id: 'windows',
    title: 'Windows 98 Flying Logo',
    generate: generateWindowsLogoPreset,
  },
  {
    id: 'bliss',
    title: 'Windows XP Bliss Hills',
    generate: generateBlissPreset,
  },
  {
    id: 'opengl',
    title: 'OpenGL 3D Diamond',
    generate: generateOpenGLPreset,
  },
  {
    id: 'synthwave',
    title: 'Retro Synthwave Sunset',
    generate: generateSynthwavePreset,
  },
  {
    id: 'chrome',
    title: 'Liquid Chrome 2000',
    generate: generateChromePreset,
  },
];

