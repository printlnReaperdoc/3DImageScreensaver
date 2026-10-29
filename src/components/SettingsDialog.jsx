import { useState, useRef, useEffect } from 'react';
import ChooseFontDialog from './ChooseFontDialog';
import ChooseColorDialog from './ChooseColorDialog';
import ChooseTextureDialog from './ChooseTextureDialog';
import { retroAudio } from '../utils/audio';

export default function SettingsDialog({
  settings,
  onUpdateSettings,
  onResetDefaults,
  onPreviewScreensaver,
  onClose,
}) {
  const initialSettingsRef = useRef({ ...settings });

  // Sub-dialog modals
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [showTextureDialog, setShowTextureDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Dragging state
  const [position, setPosition] = useState({ x: 40, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Window Drag Handler
  const handleMouseDown = (e) => {
    // Only drag from titlebar, not buttons
    if (e.target.closest('.win-titlebar-btn')) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 460, dragStartRef.current.startX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 300, dragStartRef.current.startY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const updateField = (key, value) => {
    retroAudio.playClick();
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleOk = () => {
    retroAudio.playChime();
    onClose();
  };

  const handleCancel = () => {
    retroAudio.playClick();
    onUpdateSettings(initialSettingsRef.current);
    onClose();
  };

  const handleDefaults = () => {
    retroAudio.playBeep();
    onResetDefaults();
  };

  return (
    <>
      <div
        className="win-dialog-container"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
        }}
      >
        <div className="win-dialog" style={{ width: 440 }}>
          {/* Authentic Titlebar */}
          <div className="win-titlebar" onMouseDown={handleMouseDown}>
            <div className="win-titlebar-text">
              <span className="win-icon">🖥️</span> 3D Text Settings
            </div>
            <div className="win-titlebar-controls">
              <button
                className="win-titlebar-btn"
                title="Help"
                onClick={() => { retroAudio.playClick(); setShowHelpDialog(true); }}
              >
                ?
              </button>
              <button
                className="win-titlebar-btn"
                title="Close"
                onClick={handleCancel}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="win-dialog-content">
            {/* Top Row: Display / Text Section */}
            <div className="win-groupbox">
              <legend className="win-legend">Text</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* 3D Image Plaque vs 3D Text vs Time vs 3D Cube */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label className="win-radio-label">
                    <input
                      type="radio"
                      name="displaySource"
                      checked={settings.displaySource === 'image'}
                      onChange={() => updateField('displaySource', 'image')}
                    />
                    <span>3D Image Plaque</span>
                  </label>

                  <label className="win-radio-label">
                    <input
                      type="radio"
                      name="displaySource"
                      checked={settings.displaySource === 'cube'}
                      onChange={() => updateField('displaySource', 'cube')}
                    />
                    <span>3D Photo Cube</span>
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label className="win-radio-label" style={{ minWidth: 60 }}>
                    <input
                      type="radio"
                      name="displaySource"
                      checked={settings.displaySource === 'time'}
                      onChange={() => updateField('displaySource', 'time')}
                    />
                    <span>Time</span>
                  </label>

                  <label className="win-radio-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <input
                      type="radio"
                      name="displaySource"
                      checked={settings.displaySource === 'text'}
                      onChange={() => updateField('displaySource', 'text')}
                    />
                    <span>Custom Text:</span>
                    <input
                      type="text"
                      className="win-input"
                      style={{ flex: 1 }}
                      value={settings.customText}
                      disabled={settings.displaySource === 'time'}
                      onChange={(e) => updateField('customText', e.target.value)}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <button
                    className="win-btn"
                    onClick={() => { retroAudio.playClick(); setShowFontDialog(true); }}
                  >
                    Choose Font...
                  </button>
                </div>
              </div>
            </div>

            {/* Surface Style Section */}
            <div className="win-groupbox" style={{ marginTop: 8 }}>
              <legend className="win-legend">Surface Style</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <label className="win-radio-label">
                    <input
                      type="radio"
                      name="surfaceStyle"
                      checked={settings.surfaceStyle === 'solid'}
                      onChange={() => updateField('surfaceStyle', 'solid')}
                    />
                    <span>Solid Color</span>
                  </label>
                  <div style={{ marginLeft: 20, marginTop: 4 }}>
                    <button
                      className="win-btn"
                      disabled={settings.surfaceStyle !== 'solid'}
                      onClick={() => { retroAudio.playClick(); setShowColorDialog(true); }}
                    >
                      Custom Color...
                    </button>
                  </div>
                </div>

                <div>
                  <label className="win-radio-label">
                    <input
                      type="radio"
                      name="surfaceStyle"
                      checked={settings.surfaceStyle === 'textured'}
                      onChange={() => updateField('surfaceStyle', 'textured')}
                    />
                    <span>Textured</span>
                  </label>
                  <div style={{ marginLeft: 20, marginTop: 4 }}>
                    <button
                      className="win-btn"
                      onClick={() => { retroAudio.playClick(); setShowTextureDialog(true); }}
                    >
                      Choose Texture...
                    </button>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2', marginTop: 2 }}>
                  <label className="win-radio-label">
                    <input
                      type="radio"
                      name="surfaceStyle"
                      checked={settings.surfaceStyle === 'reflection'}
                      onChange={() => updateField('surfaceStyle', 'reflection')}
                    />
                    <span>Reflection Textured (Chrome Mirror)</span>
                  </label>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <label className="win-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.shininess >= 40}
                      onChange={(e) => updateField('shininess', e.target.checked ? 75 : 10)}
                    />
                    <span>Specular Highlight</span>
                  </label>
                  <span style={{ fontSize: 11, color: '#666', marginLeft: 'auto' }}>
                    Active Texture: <strong>{settings.imageName || 'Preset'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Motion Section */}
            <div className="win-groupbox" style={{ marginTop: 8 }}>
              <legend className="win-legend">Motion</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, marginBottom: 2 }}>Rotation Type:</div>
                  <select
                    className="win-select"
                    value={settings.rotationType}
                    onChange={(e) => updateField('rotationType', e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="spin">Spin</option>
                    <option value="bloom">Bloom</option>
                    <option value="wobble">Wobble</option>
                    <option value="seesaw">See-Saw</option>
                    <option value="tumble">Tumble</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span>Rotation Speed:</span>
                    <span>{settings.rotationSpeed}</span>
                  </div>
                  <div className="win-slider-container">
                    <span className="win-slider-label">Slow</span>
                    <input
                      type="range"
                      className="win-slider"
                      min="1"
                      max="10"
                      value={settings.rotationSpeed}
                      onChange={(e) => updateField('rotationSpeed', parseInt(e.target.value, 10))}
                    />
                    <span className="win-slider-label">Fast</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 6 }}>
                <label className="win-checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.bouncing}
                    onChange={(e) => updateField('bouncing', e.target.checked)}
                  />
                  <span>Drift and bounce across screen (Screensaver movement)</span>
                </label>
              </div>
            </div>

            {/* Sliders: Resolution and Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
              {/* Resolution Slider */}
              <div className="win-groupbox">
                <legend className="win-legend">Resolution</legend>
                <div className="win-slider-container" style={{ padding: '4px 0' }}>
                  <span className="win-slider-label">Low</span>
                  <input
                    type="range"
                    className="win-slider"
                    min="1"
                    max="5"
                    step="1"
                    value={settings.resolution}
                    onChange={(e) => updateField('resolution', parseInt(e.target.value, 10))}
                  />
                  <span className="win-slider-label">High</span>
                </div>
              </div>

              {/* Size Slider */}
              <div className="win-groupbox">
                <legend className="win-legend">Size</legend>
                <div className="win-slider-container" style={{ padding: '4px 0' }}>
                  <span className="win-slider-label">Small</span>
                  <input
                    type="range"
                    className="win-slider"
                    min="1"
                    max="5"
                    step="1"
                    value={settings.size}
                    onChange={(e) => updateField('size', parseInt(e.target.value, 10))}
                  />
                  <span className="win-slider-label">Large</span>
                </div>
              </div>
            </div>

            {/* Dialog Footer Action Buttons */}
            <div className="win-actions" style={{ marginTop: 12 }}>
              <button className="win-btn primary" onClick={handleOk}>OK</button>
              <button className="win-btn" onClick={handleCancel}>Cancel</button>
              <button className="win-btn" onClick={handleDefaults}>Defaults</button>
              <button
                className="win-btn"
                style={{ marginLeft: 'auto' }}
                onClick={() => {
                  retroAudio.playClick();
                  onPreviewScreensaver();
                }}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      {showFontDialog && (
        <ChooseFontDialog
          currentFont={settings.fontFamily}
          onSelectFont={(f) => updateField('fontFamily', f)}
          onClose={() => setShowFontDialog(false)}
        />
      )}

      {showColorDialog && (
        <ChooseColorDialog
          currentColor={settings.customColor}
          onSelectColor={(c) => updateField('customColor', c)}
          onClose={() => setShowColorDialog(false)}
        />
      )}

      {showTextureDialog && (
        <ChooseTextureDialog
          currentImage={{
            src: settings.imageSrc,
            name: settings.imageName,
            aspect: settings.imageAspect,
          }}
          onSelectImage={(img) => {
            const updated = {
              ...settings,
              imageSrc: img.src,
              imageName: img.name,
              imageAspect: img.aspect,
              surfaceStyle: 'textured', // switch to textured on choose
            };
            onUpdateSettings(updated);
          }}
          onClose={() => setShowTextureDialog(false)}
        />
      )}

      {showHelpDialog && (
        <div className="win-modal-backdrop">
          <div className="win-dialog" style={{ width: 380 }}>
            <div className="win-titlebar">
              <div className="win-titlebar-text">
                <span className="win-icon">💡</span> Windows 3D Text Help
              </div>
              <button className="win-titlebar-btn" onClick={() => setShowHelpDialog(false)}>✕</button>
            </div>
            <div className="win-dialog-content">
              <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                This screensaver website faithfully replicates the exact settings and physics of the Microsoft Windows 3D Text screensaver (<code>ssText3d.scr</code>).
              </p>
              <ul style={{ fontSize: 11, paddingLeft: 18, marginTop: 8, lineHeight: 1.5 }}>
                <li><strong>Select from Computer:</strong> Click "Choose Texture..." to select any image from your computer or drag-and-drop an image directly onto the browser!</li>
                <li><strong>Rotation Types:</strong> Spin, Bloom, Wobble, See-Saw, Tumble, None.</li>
                <li><strong>Display Modes:</strong> 3D Image Plaque, 3D Photo Cube, or 3D Text textured with your image.</li>
                <li><strong>Press F:</strong> Fullscreen Screensaver mode.</li>
                <li><strong>Press S or ESC:</strong> Toggle Settings dialog.</li>
              </ul>
              <div className="win-actions" style={{ marginTop: 12 }}>
                <button className="win-btn primary" onClick={() => setShowHelpDialog(false)}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
