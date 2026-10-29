import { useRef } from 'react';
import { retroAudio } from '../utils/audio';

export default function RetroToolbar({
  showSettings,
  onToggleSettings,
  onSelectImageFile,
  onToggleFullscreen,
  isFullscreen,
  crtEnabled,
  onToggleCRT,
  soundEnabled,
  onToggleSound,
  currentImageName,
  rotationType,
  displaySource,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      retroAudio.playClick();
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        const img = new Image();
        img.onload = () => {
          onSelectImageFile({
            src: dataUrl,
            name: file.name,
            aspect: img.width / img.height,
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="win-taskbar">
      {/* Start / Settings Button */}
      <button
        className={`win-taskbar-btn ${showSettings ? 'active' : ''}`}
        onClick={() => {
          retroAudio.playClick();
          onToggleSettings();
        }}
      >
        <span className="win-icon">🖥️</span>
        <span>Settings (S)</span>
      </button>

      {/* Select Image from Computer Button */}
      <button
        className="win-taskbar-btn"
        onClick={() => {
          retroAudio.playClick();
          fileInputRef.current?.click();
        }}
      >
        <span className="win-icon">📁</span>
        <span>Choose Image...</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Preview Fullscreen Screensaver */}
      <button
        className="win-taskbar-btn"
        onClick={() => {
          retroAudio.playClick();
          onToggleFullscreen();
        }}
      >
        <span className="win-icon">🔲</span>
        <span>{isFullscreen ? 'Exit Fullscreen' : 'Preview Screensaver (F)'}</span>
      </button>

      {/* Status Info */}
      <div className="win-taskbar-status">
        <span className="win-status-badge">
          Type: <strong>{displaySource.toUpperCase()}</strong>
        </span>
        <span className="win-status-badge">
          Motion: <strong>{rotationType.toUpperCase()}</strong>
        </span>
        <span className="win-status-badge">
          Image: <strong>{currentImageName}</strong>
        </span>
      </div>

      {/* System Tray Controls */}
      <div className="win-tray">
        <button
          className={`win-tray-btn ${crtEnabled ? 'active' : ''}`}
          title="Toggle Retro CRT Monitor Scanlines"
          onClick={() => {
            retroAudio.playClick();
            onToggleCRT();
          }}
        >
          📺 CRT
        </button>

        <button
          className={`win-tray-btn ${soundEnabled ? 'active' : ''}`}
          title="Toggle Retro Sound Effects"
          onClick={() => {
            retroAudio.playClick();
            onToggleSound();
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
}

