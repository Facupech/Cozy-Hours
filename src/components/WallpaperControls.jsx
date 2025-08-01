import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useWallpaperSystem } from '../hooks/useWallpaperSystem'; 
import './WallpaperControls.css';

const emotionalStates = {
  happy: { name: 'Feliz', emoji: '😊' },
  focused: { name: 'Concentrado', emoji: '🎯' },
  relaxed: { name: 'Relajado', emoji: '😌' },
  energetic: { name: 'Energético', emoji: '⚡' },
  creative: { name: 'Creativo', emoji: '🎨' },
  calm: { name: 'Calmado', emoji: '🧘' }
};

const WallpaperControls = ({ 
  wallpaperSystem, 
  emotionalState, 
  onClose, 
  isDesktopMode = false 
}) => {
  const { isPremium, upgradeToPremium } = useSubscription();
  const [showGallery, setShowGallery] = useState(false);

  const {
    currentWallpaper,
    availableWallpapers,
    allWallpapers,
    rotationEnabled,
    rotationInterval,
    setRotationEnabled,
    setRotationInterval,
    nextWallpaper,
    selectWallpaper
  } = wallpaperSystem;

  const rotationIntervals = [
    { value: 15000, label: '15 seg' },
    { value: 30000, label: '30 seg' },
    { value: 60000, label: '1 min' },
    { value: 120000, label: '2 min' },
    { value: 300000, label: '5 min' }
  ];

  const handleWallpaperSelect = (wallpaper) => {
    if (wallpaper.premium && !isPremium()) {
      upgradeToPremium();
      return;
    }
    selectWallpaper(wallpaper.id);
    setShowGallery(false);
  };

  const handleUpgrade = () => {
    upgradeToPremium();
  };

  return (
    <div className={`wallpaper-controls ${isDesktopMode ? 'desktop-mode' : ''}`}>
      <div className="wallpaper-controls-header">
        <div className="header-content">
          <h3>🎨 Fondos de ambientes</h3>
          <div className="emotional-state-badge">
            Modo {emotionalStates[emotionalState]?.name || emotionalState}
          </div>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      <div className="current-wallpaper-info">
        <div className="wallpaper-preview">
          {currentWallpaper?.type === 'image' && (
            <img 
              src={currentWallpaper?.url} 
              alt={currentWallpaper?.name}
              className="preview-image"
            />
          )}
          {currentWallpaper?.type === 'video' && (
            <video 
              src={currentWallpaper?.url} 
              title={currentWallpaper?.name}
              className="preview-video"
              autoPlay 
              loop 
              muted 
              playsInline 
            >
              Tu navegador no soporta el tag de video.
            </video>
          )}
          {!currentWallpaper && <div className="no-wallpaper-placeholder">No wallpaper selected</div>}
        </div>
        <div className="wallpaper-details">
          <h4>{currentWallpaper?.name || 'No wallpaper selected'}</h4>
          <p className="wallpaper-type">
            {currentWallpaper?.type === 'image' && '📸 Imagen'}
            {currentWallpaper?.type === 'video' && '🎬 Video'}
            {!currentWallpaper?.type && '❔ Tipo desconocido'}
            {currentWallpaper?.premium && <span className="premium-badge">👑 Premium</span>}
          </p>
        </div>
      </div>

      {isPremium() ? (
        <div className="premium-controls">
          <div className="control-section">
            <h4>🔄 Auto rotacion</h4>
            <div className="rotation-toggle">
              <span className="rotation-toggle-label">
                {rotationEnabled ? 'Auto Rotacion activada' : 'Auto Rotacion desactivada'}
              </span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={rotationEnabled}
                  onChange={(e) => setRotationEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {rotationEnabled && (
              <div className="rotation-interval">
                <label>Cambiar cada:</label>
                <select
                  value={rotationInterval}
                  onChange={(e) => setRotationInterval(Number(e.target.value))}
                  className="interval-select"
                >
                  {rotationIntervals.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="control-section">
            <h4>🎯 Control manual</h4>
            <div className="manual-controls">
              <button 
                className="control-btn next-btn"
                onClick={nextWallpaper}
                disabled={availableWallpapers.length <= 1}
              >
                ⏭️
              </button>
              <button 
                className="control-btn gallery-btn"
                onClick={() => setShowGallery(!showGallery)}
              >
                🖼️
              </button>
            </div>
          </div>

          {showGallery && (
            <div className="wallpaper-gallery">
              <h4>🎨 Fondos disponibles</h4>
              <div className="gallery-grid">
                {allWallpapers.map(wallpaper => (
                  <div
                    key={wallpaper.id}
                    className={`gallery-item ${
                      currentWallpaper?.id === wallpaper.id ? 'activo' : ''
                    } ${wallpaper.premium && !isPremium() ? 'bloqueado' : ''}`}
                    onClick={() => handleWallpaperSelect(wallpaper)}
                  >
                    {wallpaper.type === 'image' && (
                        <img 
                            src={wallpaper.url} 
                            alt={wallpaper.name}
                            className="gallery-preview"
                        />
                    )}
                    {wallpaper.type === 'video' && (
                        <video 
                            src={wallpaper.url} 
                            alt={wallpaper.name} 
                            className="gallery-preview video-thumbnail-placeholder"
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            preload="metadata" 
                        >
                            Tu navegador no soporta la etiqueta de video.
                        </video>
                    )}
                    <div className="gallery-overlay">
                      <span className="wallpaper-name">{wallpaper.name}</span>
                      {wallpaper.premium && (
                        <span className="premium-badge">👑</span>
                      )}
                      {wallpaper.premium && !isPremium() && (
                        <div className="lock-overlay">🔒</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="upgrade-prompt">
          <div className="upgrade-content">
            <h4>🔒 Control de fondos premium</h4>
            <p>Desbloquea funciones avanzadas de fondo de pantalla:</p>
            <ul>
              <li>🎨 Acceso a fondos de pantalla con imágenes premium</li>
              <li>🔄 Controlar la configuración de rotación automática</li>
              <li>🎯 Selección manual de fondo de pantalla</li>
              <li>🖼️ Explora la galería completa de fondos de pantalla</li>
            </ul>
            <button className="upgrade-btn" onClick={handleUpgrade}>
              👑 Mejora a Premium
            </button>
          </div>
        </div>
      )}

      <div className="wallpaper-stats">
        <div className="stat">
          <span className="stat-label">Disponible:</span>
          <span className="stat-value">{availableWallpapers.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Premium:</span>
          <span className="stat-value">
            {allWallpapers.filter(w => w.premium).length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">tipo:</span>
          <span className="stat-value">
            {currentWallpaper?.type === 'image' ? 'Imagen' : 
             currentWallpaper?.type === 'video' ? 'Video' : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WallpaperControls;