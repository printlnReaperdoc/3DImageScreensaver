import { useState } from 'react';
import { retroAudio } from '../utils/audio';

const BASIC_COLORS = [
  '#ff8080', '#ffff80', '#80ff80', '#00ff80', '#80ffff', '#0080ff', '#ff80c0', '#ff80ff',
  '#ff0000', '#ffff00', '#00ff00', '#00ff40', '#00ffff', '#0040ff', '#ff0080', '#ff00ff',
  '#800000', '#808000', '#008000', '#008040', '#008080', '#0000ff', '#800080', '#8000ff',
  '#400000', '#404000', '#004000', '#004040', '#004080', '#000080', '#400040', '#400080',
  '#000000', '#808080', '#c0c0c0', '#ffffff', '#e0e0e0', '#2b78e4', '#ffaa00', '#7a42f4',
  '#ff4488', '#00ddaa', '#bbff00', '#440066', '#112233', '#eebb88', '#663300', '#99bb00'
];

export default function ChooseColorDialog({ currentColor, onSelectColor, onClose }) {
  const [selectedHex, setSelectedHex] = useState(currentColor || '#2b78e4');

  const handleSwatchClick = (hex) => {
    retroAudio.playClick();
    setSelectedHex(hex);
  };

  const handleOk = () => {
    retroAudio.playClick();
    onSelectColor(selectedHex);
    onClose();
  };

  const handleCancel = () => {
    retroAudio.playClick();
    onClose();
  };

  return (
    <div className="win-modal-backdrop">
      <div className="win-dialog" style={{ width: 420 }}>
        <div className="win-titlebar">
          <div className="win-titlebar-text">
            <span className="win-icon">🎨</span> Color
          </div>
          <button className="win-titlebar-btn" onClick={handleCancel}>✕</button>
        </div>

        <div className="win-dialog-content">
          <div className="win-groupbox">
            <legend className="win-legend">Basic colors:</legend>
            <div className="win-color-palette-grid">
              {BASIC_COLORS.map((hex, i) => (
                <div
                  key={i}
                  className={`win-color-swatch ${selectedHex.toLowerCase() === hex.toLowerCase() ? 'active' : ''}`}
                  style={{ backgroundColor: hex }}
                  onClick={() => handleSwatchClick(hex)}
                  title={hex}
                />
              ))}
            </div>
          </div>

          <div className="win-groupbox" style={{ marginTop: 10 }}>
            <legend className="win-legend">Custom RGB / Hex:</legend>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="color"
                value={selectedHex}
                onChange={(e) => setSelectedHex(e.target.value)}
                style={{ width: 44, height: 32, cursor: 'pointer', border: '2px inset #fff', background: '#ccc' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span>Hex:</span>
                <input
                  type="text"
                  className="win-input"
                  style={{ width: 80, fontFamily: 'monospace' }}
                  value={selectedHex}
                  onChange={(e) => setSelectedHex(e.target.value)}
                />
              </div>
              <div
                className="win-inset-panel"
                style={{
                  width: 60,
                  height: 30,
                  backgroundColor: selectedHex,
                  border: '2px inset #999',
                }}
              />
            </div>
          </div>

          <div className="win-actions" style={{ marginTop: 14 }}>
            <button className="win-btn primary" onClick={handleOk}>OK</button>
            <button className="win-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

