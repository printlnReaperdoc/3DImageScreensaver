import { useState, useRef } from 'react';
import { PRESET_IMAGES } from '../utils/presets';
import { retroAudio } from '../utils/audio';

export default function ChooseTextureDialog({ currentImage, onSelectImage, onClose }) {
  const [selectedSrc, setSelectedSrc] = useState(currentImage.src);
  const [selectedName, setSelectedName] = useState(currentImage.name);
  const [selectedAspect, setSelectedAspect] = useState(currentImage.aspect || 1.33);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    retroAudio.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        setSelectedSrc(dataUrl);
        setSelectedName(file.name);
        setSelectedAspect(aspect);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handlePresetSelect = (preset) => {
    retroAudio.playClick();
    const dataUrl = preset.generate();
    setSelectedSrc(dataUrl);
    setSelectedName(preset.title);
    setSelectedAspect(1.0);
  };

  const handleOk = () => {
    retroAudio.playClick();
    onSelectImage({
      src: selectedSrc,
      name: selectedName,
      aspect: selectedAspect,
    });
    onClose();
  };

  const handleCancel = () => {
    retroAudio.playClick();
    onClose();
  };

  return (
    <div className="win-modal-backdrop">
      <div className="win-dialog" style={{ width: 480 }}>
        <div className="win-titlebar">
          <div className="win-titlebar-text">
            <span className="win-icon">🖼️</span> Choose Texture
          </div>
          <button className="win-titlebar-btn" onClick={handleCancel}>✕</button>
        </div>

        <div className="win-dialog-content">
          {/* File Picker from Computer */}
          <div className="win-groupbox">
            <legend className="win-legend">Select from Computer</legend>
            <div
              className={`win-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>📁 ⬇️</div>
              <div style={{ fontWeight: 'bold' }}>Click to choose image or drag & drop here</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                Supports PNG, JPG, GIF, WebP, SVG, BMP
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Retro Presets */}
          <div className="win-groupbox" style={{ marginTop: 10 }}>
            <legend className="win-legend">Retro Presets</legend>
            <div className="win-preset-grid">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.id}
                  className={`win-preset-btn ${selectedName === preset.title ? 'active' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <span style={{ fontSize: 18, marginRight: 6 }}>
                    {preset.id === 'windows' ? '🪟' : preset.id === 'bliss' ? '🌄' : preset.id === 'opengl' ? '💎' : preset.id === 'synthwave' ? '🌇' : '✨'}
                  </span>
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Selection Preview */}
          <div className="win-groupbox" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
            <legend className="win-legend">Current Preview</legend>
            <div className="win-inset-panel" style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {selectedSrc ? (
                <img src={selectedSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: 11, color: '#888' }}>No Image</span>
              )}
            </div>
            <div style={{ fontSize: 12, flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{selectedName || 'Custom Image'}</div>
              <div style={{ color: '#555', fontSize: 11 }}>Aspect Ratio: {selectedAspect.toFixed(2)}:1</div>
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="win-actions" style={{ marginTop: 14 }}>
            <button className="win-btn primary" onClick={handleOk}>OK</button>
            <button className="win-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

