import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useWallpaperSystem } from '../hooks/useWallpaperSystem';
import WallpaperControls from './WallpaperControls';
import './WallpaperControls.css';

const WallpaperWidget = ({ emotionalState, onClose, isDesktopMode = false }) => {
  const { isPremium } = useSubscription();
  const wallpaperSystem = useWallpaperSystem(emotionalState);

  return (
    <div className={`wallpaper-widget ${isDesktopMode ? 'desktop-mode' : ''}`}>
      <div className="widget-header">
        <h3 className="widget-title">🎨 Fondo de ambientes</h3>
        {onClose && (
          <button className="widget-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      
      <div className="widget-content">
        <WallpaperControls 
          wallpaperSystem={wallpaperSystem}
          emotionalState={emotionalState}
          onClose={onClose}
          isDesktopMode={isDesktopMode}
        />
        
        <div className="wallpaper-info-section">
          <div className="info-card">
            <h4>🌟 Fondos ambientales</h4>
            <p>
              Cada estado emocional cuenta con ambientes
              de fondo cuidadosamente seleccionados que mejoran tu
              estado de ánimo y productividad. Los fondos rotan automáticamente
              para mantener tu espacio de trabajo fresco e inspirador.
            </p>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <span>Fondos que giran automáticamente</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Ambientes que combinan con las emociones</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <span>Intervalos personalizables</span>
            </div>
            <div className="feature-item premium">
              <span className="feature-icon">👑</span>
              <span>Fondos exclusivos premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperWidget;
