import { useState } from 'react';
import { retroAudio } from '../utils/audio';

const FONTS = [
  { id: 'helvetiker_bold', name: 'Helvetiker Bold (3D Classic)', style: 'Bold' },
  { id: 'helvetiker_regular', name: 'Helvetiker Regular (3D Clean)', style: 'Regular' },
];

export default function ChooseFontDialog({ currentFont, onSelectFont, onClose }) {
  const [selectedFont, setSelectedFont] = useState(currentFont || 'helvetiker_bold');

  const handleFontSelect = (id) => {
    retroAudio.playClick();
    setSelectedFont(id);
  };

  const handleOk = () => {
    retroAudio.playClick();
    onSelectFont(selectedFont);
    onClose();
  };

  const handleCancel = () => {
    retroAudio.playClick();
    onClose();
  };

  return (
    <div className="win-modal-backdrop">
      <div className="win-dialog" style={{ width: 400 }}>
        <div className="win-titlebar">
          <div className="win-titlebar-text">
            <span className="win-icon">🔤</span> Font
          </div>
          <button className="win-titlebar-btn" onClick={handleCancel}>✕</button>
        </div>

        <div className="win-dialog-content">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, marginBottom: 3 }}>Font:</div>
              <div className="win-listbox" style={{ height: 110 }}>
                {FONTS.map(f => (
                  <div
                    key={f.id}
                    className={`win-list-item ${selectedFont === f.id ? 'active' : ''}`}
                    onClick={() => handleFontSelect(f.id)}
                  >
                    {f.name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, marginBottom: 3 }}>Font style:</div>
              <div className="win-listbox" style={{ height: 110 }}>
                <div className={`win-list-item ${selectedFont === 'helvetiker_regular' ? 'active' : ''}`}>Regular</div>
                <div className={`win-list-item ${selectedFont === 'helvetiker_bold' ? 'active' : ''}`}>Bold</div>
              </div>
            </div>
          </div>

          <div className="win-groupbox" style={{ marginTop: 12 }}>
            <legend className="win-legend">Sample</legend>
            <div
              className="win-inset-panel"
              style={{
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: selectedFont === 'helvetiker_bold' ? 'bold' : 'normal',
                fontFamily: 'sans-serif',
                letterSpacing: 2,
                background: '#fff',
              }}
            >
              AaBbYyZz 123
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

