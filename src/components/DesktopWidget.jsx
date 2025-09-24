import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import NotesWidget from './NotesWidget';
import TasksWidget from './TasksWidget';
import PomodoroWidget from './PomodoroWidget';
import DesktopSettings from './DesktopSettings';
import MusicPlayer from './MusicPlayer';
import WallpaperWidget from './WallpaperWidget';
import './DesktopWidget.css';

const DesktopWidget = ({ widget, onClose, onMinimize, onMove, desktopId, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);
  const { language } = useLanguage();
  const t = translations[language];

  const handleMouseDown = (e) => {
  
    if (e.target.closest('.widget-titlebar') && !e.target.closest('.widget-controls')) {
      setIsDragging(true);
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
    
      const maxX = window.innerWidth - widget.width;
      const maxY = window.innerHeight - widget.height - 100; 
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      onMove(boundedX, boundedY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'notes':
        return (
          <NotesWidget 
            desktopId={desktopId}
            onClose={onClose}
            isDesktopMode={true}
          />
        );
      case 'tasks':
        return (
          <TasksWidget 
            desktopId={desktopId}
            onClose={onClose}
            isDesktopMode={true}
          />
        );
      case 'pomodoro':
        return (
          <PomodoroWidget 
            onClose={onClose}
            isDesktopMode={true}
          />
        );
      case 'settings':
        return (
          <DesktopSettings 
            desktop={{ id: desktopId }}
            onClose={onClose}
            onUpdate={onUpdate}
            isDesktopMode={true}
          />
        );
      case 'music':
        return (
          <MusicPlayer 
            emotionalState="happy"
            musicType="ambient"
            isDesktopMode={true}
          />
        );
      case 'wallpaper':
        return (
          <WallpaperWidget 
            emotionalState={widget.emotionalState || 'happy'}
            onClose={onClose}
            isDesktopMode={true}
          />
        );
      default:
        return <div>{t.unknownWidgetType || 'Tipo de pestaña desconocida'}</div>;
    }
  };

  const getWidgetTitle = () => {
    switch (widget.type) {
      case 'notes': return `📝 ${t.notes}`;
      case 'tasks': return `✅ ${t.tasks}`;
      case 'pomodoro': return `⏰ ${t.pomodoro}`;
      case 'settings': return `⚙️ ${t.settings || 'Configuración'}`;
      case 'music': return `🎵 ${t.music}`;
      case 'wallpaper': return `🎨 ${t.wallpaper || 'Fondo de ambientes'}`;
      default: return t.widget || 'Widget';
    }
  };

  return (
    <div
      ref={widgetRef}
      className={`desktop-widget ${isDragging ? 'arrastrando' : ''}`}
      style={{
        position: 'absolute',
        left: widget.x,
        top: widget.y,
        width: widget.width,
        height: widget.height,
        zIndex: widget.zIndex,
        cursor: isDragging ? 'arrastrando' : 'por defecto'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Barra de título del widget */}
      <div className="widget-titlebar">
        <div className="widget-title">
          {getWidgetTitle()}
        </div>
        <div className="widget-controls">
          <button 
            className="widget-control-btn close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      </div>

      {/* Contenido del Widget */}
      <div className="widget-content">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

export default DesktopWidget;
