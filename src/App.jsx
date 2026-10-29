import { useState, useEffect, useCallback } from 'react';
import ScreensaverCanvas from './components/ScreensaverCanvas';
import SettingsDialog from './components/SettingsDialog';
import RetroToolbar from './components/RetroToolbar';
import CRTFilter from './components/CRTFilter';
import { generateWindowsLogoPreset } from './utils/presets';
import { retroAudio } from './utils/audio';
import './App.css';

const DEFAULT_SETTINGS = {
  displaySource: 'image', // 'image' | 'text' | 'time' | 'cube'
  customText: 'WINDOWS 98',
  fontFamily: 'helvetiker_bold',
  surfaceStyle: 'textured', // 'textured' | 'solid' | 'reflection'
  customColor: '#2b78e4',
  specularColor: '#ffffff',
  shininess: 75,
  rotationType: 'spin', // 'none' | 'spin' | 'bloom' | 'wobble' | 'seesaw' | 'tumble'
  rotationSpeed: 5,
  bouncing: true,
  resolution: 4,
  size: 3,
  imageSrc: '',
  imageName: 'Windows 98 Flying Logo',
  imageAspect: 1.0,
  crtFilter: false,
  soundEnabled: true,
};

export default function App() {
  const [settings, setSettings] = useState(() => {
    const initialPreset = generateWindowsLogoPreset();
    return {
      ...DEFAULT_SETTINGS,
      imageSrc: initialPreset,
    };
  });

  const [showSettings, setShowSettings] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const [showScreensaverHint, setShowScreensaverHint] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setShowSettings(false);
      setShowScreensaverHint(true);
      setTimeout(() => setShowScreensaverHint(false), 3500);
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleImageFile = useCallback((file) => {
    retroAudio.playChime();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      const img = new Image();
      img.onload = () => {
        setSettings(prev => ({
          ...prev,
          imageSrc: dataUrl,
          imageName: file.name,
          imageAspect: img.width / img.height,
          surfaceStyle: 'textured',
        }));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Global Drag & Drop Handler
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsWindowDragging(true);
    };
    const handleDragLeave = (e) => {
      if (e.relatedTarget === null) {
        setIsWindowDragging(false);
      }
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setIsWindowDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleImageFile]);

  // Clipboard Paste Handler
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleImageFile]);

  // Keyboard Shortcuts: 'F' (Fullscreen), 'S' (Settings), 'ESC' (Exit Fullscreen/Close Dialog)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowSettings(prev => !prev);
        retroAudio.playClick();
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if (showSettings) {
          setShowSettings(false);
        } else {
          setShowSettings(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, toggleFullscreen]);

  const handleCanvasClick = () => {
    if (isFullscreen) {
      setShowScreensaverHint(true);
      setTimeout(() => setShowScreensaverHint(false), 3000);
    }
  };

  return (
    <div className="screensaver-app">
      {/* 3D WebGL Canvas Rendering */}
      <ScreensaverCanvas
        settings={settings}
        onCanvasClick={handleCanvasClick}
      />

      {/* CRT Scanline Filter Overlay */}
      {settings.crtFilter && <CRTFilter />}

      {/* Retro 3D Text Settings Dialog */}
      {showSettings && (
        <SettingsDialog
          settings={settings}
          onUpdateSettings={(updated) => setSettings(updated)}
          onResetDefaults={() => setSettings(prev => ({
            ...DEFAULT_SETTINGS,
            imageSrc: prev.imageSrc,
            imageName: prev.imageName,
            imageAspect: prev.imageAspect,
          }))}
          onPreviewScreensaver={toggleFullscreen}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Retro Bottom Taskbar */}
      <RetroToolbar
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(prev => !prev)}
        onSelectImageFile={(imgData) => {
          setSettings(prev => ({
            ...prev,
            imageSrc: imgData.src,
            imageName: imgData.name,
            imageAspect: imgData.aspect,
            surfaceStyle: 'textured',
          }));
        }}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        crtEnabled={settings.crtFilter}
        onToggleCRT={() => setSettings(prev => ({ ...prev, crtFilter: !prev.crtFilter }))}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          retroAudio.enabled = next;
          setSettings(prev => ({ ...prev, soundEnabled: next }));
        }}
        currentImageName={settings.imageName}
        rotationType={settings.rotationType}
        displaySource={settings.displaySource}
      />

      {/* Fullscreen Screensaver Wakeup Hint */}
      {isFullscreen && showScreensaverHint && (
        <div className="win-screensaver-hint">
          <span style={{ marginRight: 8 }}>🖥️</span>
          3D Text Screensaver Active • Press <strong>S</strong> for Settings • Press <strong>F</strong> or <strong>ESC</strong> to exit
        </div>
      )}

      {/* Global Drag & Drop Overlay */}
      {isWindowDragging && (
        <div className="win-drag-overlay">
          <div className="win-drag-modal">
            <div style={{ fontSize: 56, marginBottom: 12 }}>📁 ⬇️</div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>Drop Image File Here</div>
            <div style={{ fontSize: 13, color: '#333', marginTop: 6 }}>
              Release to instantly render your image in the 3D Screensaver!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
