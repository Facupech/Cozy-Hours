import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import LanguageToggle from '../components/LanguageToggle';
import { getUserDesktops, getDesktopById } from '../lib/supabase';
import { useWallpaperSystem } from '../hooks/useWallpaperSystem';
import AppHeader from '../components/AppHeader';
import PlanSelector from '../components/PlanSelector';
import WallpaperControls from '../components/WallpaperControls';
import NotesWidget from '../components/NotesWidget';
import TasksWidget from '../components/TasksWidget';
import PomodoroWidget from '../components/PomodoroWidget';
import MusicPlayer from '../components/MusicPlayer';
import DesktopSettings from '../components/DesktopSettings';
import DesktopWidget from '../components/DesktopWidget';
import DesktopManager from '../components/DesktopManager';
import ClockWidget from '../components/ClockWidget';
import EmotionalState from '../models/EmotionalState';
import './DashboardPage.css';
import './DashboardPageButtons.css';

const DashboardPage = () => {
  const [desktops, setDesktops] = useState([]);
  const [currentDesktop, setCurrentDesktop] = useState(null);
  const [openWidgets, setOpenWidgets] = useState([]);
  const [minimizedWidgets, setMinimizedWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDesktopManager, setShowDesktopManager] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showWallpaperConfig, setShowWallpaperConfig] = useState(false);
  const [activeWallpaper, setActiveWallpaper] = useState(null); // Renombrado de currentWallpaper a activeWallpaper para evitar confusión con el wallpaperSystem

  const { user, signOut } = useAuth();
  const { canCreateMore, getLimit, isPremium, upgradeToPremium, downgradeToFree } = useSubscription();
  const { language } = useLanguage();
  const t = translations[language];
  // Usar la clase EmotionalState con POO - getAsMap() retorna un objeto indexado por ID
  const emotionalStates = EmotionalState.getAsMap(t);
  const navigate = useNavigate();

  // Sistema de fondos de pantalla
  // Ahora useWallpaperSystem es responsable de decirnos cuál es el fondo activo
  const wallpaperSystem = useWallpaperSystem(
    currentDesktop?.emotional_state || 'happy',
    setActiveWallpaper // Pasamos la función para actualizar el estado del fondo activo
  );

  useEffect(() => {
    loadUserDesktops();
  }, [user]);

  const loadUserDesktops = async () => {
    if (!user) return;

    try {
      const { data, error } = await getUserDesktops(user.id);
      if (error) throw error;

      setDesktops(data || []);
      
      const defaultDesktop = data?.find(d => d.is_default) || data?.[0];
      if (defaultDesktop) {
        setCurrentDesktop(defaultDesktop);
      }
    } catch (error) {
      console.error('Error loading desktops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesktopSelect = (desktop) => {
    setCurrentDesktop(desktop);
    setShowDesktopManager(false);
  };

  const handleDesktopChange = async (desktopId) => {
    try {
      const { data, error } = await getDesktopById(desktopId);
      if (error) throw error;
      setCurrentDesktop(data);
    } catch (error) {
      console.error('Error loading desktop:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Funciones de gestión de widgets para experiencia tipo escritorio
  const openWidget = (widgetType) => {
    const existingWidget = openWidgets.find(w => w.type === widgetType);
    if (existingWidget) {
      setMinimizedWidgets(prev => prev.filter(id => id !== existingWidget.id));
      setOpenWidgets(prev => prev.map(w => 
        w.id === existingWidget.id ? { ...w, zIndex: Math.max(...prev.map(widget => widget.zIndex), 0) + 1 } : w
      ));
    } else {
      const getWidgetDimensions = (type) => {
        switch (type) {
          case 'pomodoro': return { width: 350, height: 400 };
          case 'settings': return { width: 500, height: 600 };
          case 'music': return { width: 400, height: 300 };
          default: return { width: 400, height: 350 };
        }
      };
      
      const dimensions = getWidgetDimensions(widgetType);
      const newWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
        x: Math.random() * 200 + 100,
        y: Math.random() * 100 + 100,
        ...dimensions,
        zIndex: Math.max(...openWidgets.map(w => w.zIndex), 0) + 1,
        isMinimized: false
      };
      setOpenWidgets(prev => [...prev, newWidget]);
    }
  };

  const closeWidget = (widgetId) => {
    setOpenWidgets(prev => prev.filter(w => w.id !== widgetId));
    setMinimizedWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const minimizeWidget = (widgetId) => {
    setMinimizedWidgets(prev => [...prev, widgetId]);
  };

  const maximizeWidget = (widgetId) => {
    setMinimizedWidgets(prev => prev.filter(id => id !== widgetId));
    setOpenWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, zIndex: Math.max(...prev.map(widget => widget.zIndex), 0) + 1 } : w
    ));
  };

  const updateWidgetPosition = (widgetId, x, y) => {
    setOpenWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, x, y } : w
    ));
  };

  // Esta función ahora solo define el fondo de color de respaldo
  const getDashboardPageBackgroundStyle = () => {
    // Si hay un fondo de pantalla (imagen o video) activo, no aplicamos un color de fondo fijo aquí.
    // El elemento de imagen/video renderizado por JSX se encargará de ello.
    if (activeWallpaper) {
      return {
        // Estilos para que el contenedor tenga el tamaño correcto, pero sin background-image/color
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        // Opcional: un color de respaldo muy sutil si el video tarda en cargar
        backgroundColor: 'black' 
      };
    }
    
    // Fallback al color del estado emocional si no hay fondo de pantalla personalizado
    const state = emotionalStates[currentDesktop.emotional_state];
    if (state) {
      return {
        background: `linear-gradient(135deg, ${state.color}20 0%, ${state.color}10 100%)`,
        minHeight: '100vh',
        width: '100%'
      };
    }
    
    return {}; // Por si no hay escritorio ni wallpaper
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t.loadingWorkspace}</p>
      </div>
    );
  }

  if (!currentDesktop) {
    return (
      <div className="dashboard-page">
        <div className="empty-state">
          <h2>{t.noWorkspaceFound}</h2>
          <p>{t.createFirstWorkspace}</p>
          <button onClick={() => navigate('/emotional-setup')} className="btn btn-primary">
            {t.createWorkspace}
          </button>
        </div>
      </div>
    );
  }

  // Usar el método getAsMap() que retorna un objeto indexado por ID
  const currentState = emotionalStates[currentDesktop.emotional_state];

  return (
    // Aplica solo el estilo de fondo de color si no hay un wallpaper activo
    <div className="dashboard-page" style={getDashboardPageBackgroundStyle()}>
      {/* IMPORTANTE: Renderizar el fondo de imagen o video aquí, 
        fuera de getBackgroundStyle() para tener un control total con CSS.
      */}
      {activeWallpaper && activeWallpaper.type === 'image' && (
        <img
          src={activeWallpaper.url}
          alt={activeWallpaper.name}
          className="dashboard-background-image" // ¡Aplicamos la clase CSS aquí!
        />
      )}
      {activeWallpaper && activeWallpaper.type === 'video' && (
        <video
          key={activeWallpaper.id} // Key es importante para que React lo re-renderice si cambia el video
          className="dashboard-background-video" // ¡Aplicamos la clase CSS aquí!
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={activeWallpaper.url} type="video/mp4" />
          Tu navegador no soporta el tag de video.
        </video>
      )}
      
      {/* Botón de traducción */}
      <LanguageToggle className="dashboard-toggle" />
      
      {/* Encabezado de la aplicación */}
      <AppHeader 
        showLogo={false} 
        title={`${currentState?.emoji} ${currentDesktop.name}`}
      />
      
      {/* Controles flotantes */}
      <div className="floating-controls">

        {/* Botones de acción flotantes */}
        <div className="floating-actions">
          <button 
            className="floating-btn plan-btn" 
            onClick={() => setShowPlanSelector(true)}
            title={isPremium() ? t.managePlan : t.upgradeToPremium}
          >
            {isPremium() ? '👑' : '⬆️'}
          </button>
          
          <button 
            className="floating-btn workspace-btn"
            onClick={() => setShowDesktopManager(true)}
            title={t.manageDesktops}
          >
            🖥️
          </button>
          
          <button 
            className="floating-btn wallpaper-btn"
            onClick={() => setShowWallpaperConfig(true)}
            title={isPremium() ? t.configureWallpaper : t.upgradeForWallpaper}
          >
            🎨
          </button>
          
          <button 
            className="floating-btn logout-btn" 
            onClick={handleSignOut}
            title={t.logout}
          >
            🚪
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="dashboard-main">
        {/* Widgets de escritorio - Ventanas movibles */}
        <div className="desktop-widgets">
          {openWidgets.map(widget => {
            const isMinimized = minimizedWidgets.includes(widget.id);
            if (isMinimized) return null;
            
            return (
              <DesktopWidget
                key={widget.id}
                widget={widget}
                onClose={() => closeWidget(widget.id)}
                onMinimize={() => minimizeWidget(widget.id)}
                onMove={(x, y) => updateWidgetPosition(widget.id, x, y)}
                desktopId={currentDesktop.id}
                onUpdate={loadUserDesktops}
              />
            );
          })}
        </div>

        {/* Barra de tareas con widgets minimizados */}
        <div className="desktop-taskbar">
          {minimizedWidgets.map(widgetId => {
            const widget = openWidgets.find(w => w.id === widgetId);
            if (!widget) return null;
            
            return (
              <button
                key={widgetId}
                className="taskbar-minimized-widget"
                onClick={() => maximizeWidget(widgetId)}
              >
                {widget.type === 'notes' && '📝'}
                {widget.type === 'tasks' && '✅'}
                {widget.type === 'pomodoro' && '⏰'}
                {widget.type === 'settings' && '⚙️'}
                {widget.type === 'music' && '🎵'}
                {t[widget.type] || widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Lanzador de widgets - Flotante */}
        <div className="floating-widget-launcher">
          <button 
            className={`floating-widget-btn ${openWidgets.some(w => w.type === 'notes' && !minimizedWidgets.includes(w.id)) ? 'active' : ''}`}
            onClick={() => openWidget('notes')}
            title={t.notes}
          >
            📝
          </button>
          
          <button 
            className={`floating-widget-btn ${openWidgets.some(w => w.type === 'tasks' && !minimizedWidgets.includes(w.id)) ? 'active' : ''}`}
            onClick={() => openWidget('tasks')}
            title={t.tasks}
          >
            ✅
          </button>
          
          <button 
            className={`floating-widget-btn ${openWidgets.some(w => w.type === 'pomodoro' && !minimizedWidgets.includes(w.id)) ? 'active' : ''}`}
            onClick={() => openWidget('pomodoro')}
            title={t.pomodoro}
          >
            ⏰
          </button>
          
          <button 
            className={`floating-widget-btn ${openWidgets.some(w => w.type === 'music' && !minimizedWidgets.includes(w.id)) ? 'active' : ''}`}
            onClick={() => openWidget('music')}
            title={t.music}
          >
            🎵
          </button>
        </div>
        
        {/* Widget de reloj - Abajo a la izquierda */}
        <ClockWidget />
      </main>

      {/* Modal del administrador de escritorios */}
      {showDesktopManager && (
        <div className="desktop-manager-overlay">
          <div className="desktop-manager-container">
            <button 
              className="close-desktop-manager"
              onClick={() => setShowDesktopManager(false)}
            >
              ×
            </button>
            <DesktopManager 
              onDesktopSelect={handleDesktopSelect}
              currentDesktop={currentDesktop}
              onDesktopUpdate={loadUserDesktops}
            />
          </div>
        </div>
      )}

      {/* Modal del selector de planes */}
      {showPlanSelector && (
        <div className="plan-selector-overlay">
          <div className="plan-selector-container">
            <button 
              className="close-plan-selector"
              onClick={() => setShowPlanSelector(false)}
            >
              ×
            </button>
            <PlanSelector />
          </div>
        </div>
      )}

      {/* Modal de configuración de fondo de pantalla */}
      {showWallpaperConfig && (
        <div className="wallpaper-config-overlay">
          <div className="wallpaper-config-container">
            <WallpaperControls 
              wallpaperSystem={wallpaperSystem}
              emotionalState={currentDesktop?.emotional_state || 'happy'}
              onClose={() => setShowWallpaperConfig(false)}
              isDesktopMode={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;