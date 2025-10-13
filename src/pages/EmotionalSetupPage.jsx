import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import LanguageToggle from '../components/LanguageToggle';
import { createDesktop, createUserProfile, getUserDesktops } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import DesktopManager from '../components/DesktopManager';
import EmotionalState from '../models/EmotionalState';
import './EmotionalSetupPage.css';

const EmotionalSetupPage = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [desktopName, setDesktopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDesktopManager, setShowDesktopManager] = useState(false);
  const [existingDesktops, setExistingDesktops] = useState([]);
  const [hasDesktops, setHasDesktops] = useState(false);
  const { user } = useAuth();
  const { isFirstLogin, resetFirstLoginFlag } = useSubscription();
  const { language } = useLanguage();
  const t = translations[language];
  // Usar la clase EmotionalState con POO
  const emotionalStates = EmotionalState.getAll(t);
  const navigate = useNavigate();

  useEffect(() => {
    loadExistingDesktops();
  }, [user]);

  const loadExistingDesktops = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getUserDesktops(user.id);
      if (error) throw error;
      
      setExistingDesktops(data || []);
      setHasDesktops((data || []).length > 0);
    } catch (error) {
      console.error('Error loading existing desktops:', error);
    }
  };

  const handleDesktopSelect = (desktop) => {
    navigate('/dashboard');
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    
    setDesktopName(`escritorio ${state.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedState || !desktopName.trim()) {
      setError(t.pleaseSelectStateAndName);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Crear perfil de usuario con uan estructura correcta
      const profileData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null
      };

      const { error: profileError } = await createUserProfile(user.id, profileData);
      if (profileError) {
        console.log('Profile creation error:', profileError);
        // No lanzar error si el perfil ya existe
        if (!profileError.message.includes('duplicate key') && !profileError.message.includes('already exists')) {
          throw new Error('Failed to create user profile: ' + profileError.message);
        }
      }

      // Crear escritorio inicial usando POO
      // Obtener la instancia de EmotionalState para usar sus métodos
      const emotionalStateInstance = EmotionalState.findById(selectedState.id);
      
      const desktopData = {
        user_id: user.id,
        name: desktopName.trim(),
        emotional_state: selectedState.id,
        theme_color: selectedState.color,
        // Usar el método getDefaultMusicType() de la clase EmotionalState
        music_type: emotionalStateInstance ? emotionalStateInstance.getDefaultMusicType() : 'lofi',
        is_active: true
      };

      const { error: desktopError } = await createDesktop(desktopData);
      if (desktopError) {
        throw new Error('Failed to create desktop: ' + desktopError.message);
      }

      // Navegar a la Dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emotional-setup-page">
      {/* Botón de traducción */}
      <LanguageToggle className="dashboard-toggle" />
      
      {/* Encabezado de la aplicación */}
      <AppHeader title={t.workspaceSetup} />
      
      <div className="emotional-setup-container">
        <div className="setup-header">
          <h1 className="setup-title">
            {t.welcomeToCozyHours}
          </h1>
          {isFirstLogin && (
            <div className="first-login-welcome">
              <div className="welcome-badge">
                {t.welcomeBadge}
              </div>
              <p className="welcome-details">
                {t.welcomeDetails}
              </p>
            </div>
          )}
          <p className="setup-subtitle">
            {hasDesktops 
              ? t.createNewWorkspace
              : t.chooseEmotionalState
            }
          </p>
          
          {hasDesktops && (
            <div className="workspace-options">
              <button 
                type="button"
                className="btn-manage-workspaces"
                onClick={() => setShowDesktopManager(true)}
              >
                {t.manageExistingWorkspaces} ({existingDesktops.length})
              </button>
            </div>
          )}
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="emotional-states">
            {emotionalStates.map((state) => (
              <div
                key={state.id}
                className={`emotional-state ${selectedState?.id === state.id ? 'selected' : ''}`}
                onClick={() => handleStateSelect(state)}
              >
                <div className="state-emoji">{state.emoji}</div>
                <p className="state-name">{state.name}</p>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="desktopName" className="form-label">
              {t.nameYourWorkspace}
            </label>
            <input
              type="text"
              id="desktopName"
              value={desktopName}
              onChange={(e) => setDesktopName(e.target.value)}
              className="form-input"
              placeholder={t.workspaceNamePlaceholder}
              disabled={loading}
            />
          </div>

          {selectedState && desktopName && (
            <div className="desktop-preview">
              <h3 className="preview-title">{t.preview}</h3>
              <div className="preview-content">
                <span className="preview-emoji">{selectedState.emoji}</span>
                <span className="preview-name">{desktopName}</span>
              </div>
            </div>
          )}

          <div className="setup-actions" style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !selectedState || !desktopName.trim()}
              onClick={(e) => {
                console.log('Botón hecho clic!', { loading, selectedState, desktopName });
                // Dejar al formulario manejar el envío (submit)
              }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {t.creatingYourSpace}
                </>
              ) : (
                t.createMyDesktop
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Administrador de espacios de trabajo */}
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
              currentDesktop={null}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalSetupPage;
