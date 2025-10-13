import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { getUserDesktops, createDesktop, updateDesktop, deleteDesktop } from '../lib/supabase';
import EmotionalState from '../models/EmotionalState';
import './DesktopManager.css';

const DesktopManager = ({ onDesktopSelect, currentDesktop, onDesktopUpdate }) => {
  const [desktops, setDesktops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDesktop, setEditingDesktop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    emotional_state: 'happy',
    theme_color: '#FFD700'
  });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { canCreateMore, getLimit, isPremium, upgradeToPremium } = useSubscription();
  const { language } = useLanguage();
  const t = translations[language];
  // Usar la clase EmotionalState con POO
  const emotionalStates = EmotionalState.getAll(t);

  useEffect(() => {
    loadDesktops();
  }, [user]);

  const loadDesktops = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await getUserDesktops(user.id);
      if (error) throw error;
      setDesktops(data || []);
    } catch (err) {
      setError((t.errorLoadingDesktops || 'Error al cargar escritorios') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDesktop = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre del escritorio es obligatorio');
      return;
    }

    // Consultar límites de suscripción
    if (!canCreateMore('desktops', desktops.length)) {
      setError(`El plan gratuito está limitado a ${getLimit('desktops')} escritorios. ¡Actualiza a Premium para obtener escritorios ilimitados!`);
      return;
    }

    try {
      setLoading(true);
      // Usar la clase EmotionalState con POO
      const emotionalStateInstance = EmotionalState.findById(formData.emotional_state);
      const selectedState = emotionalStates.find(s => s.id === formData.emotional_state);
      
      const desktopData = {
        user_id: user.id,
        name: formData.name.trim(),
        emotional_state: formData.emotional_state,
        theme_color: selectedState.color,
        // Usar el método getDefaultMusicType() de la clase
        music_type: emotionalStateInstance ? emotionalStateInstance.getDefaultMusicType() : 'lofi',
        is_active: false
      };

      const { data, error } = await createDesktop(desktopData);
      if (error) throw error;

      await loadDesktops();
      setShowCreateForm(false);
      setFormData({ name: '', emotional_state: 'happy', theme_color: '#FFD700' });
      setError('');
    } catch (err) {
      setError('Error al crear el escritorio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDesktop = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !editingDesktop) return;

    try {
      setLoading(true);
      // Usar la clase EmotionalState con POO
      const emotionalStateInstance = EmotionalState.findById(formData.emotional_state);
      const selectedState = emotionalStates.find(s => s.id === formData.emotional_state);
      
      const updates = {
        name: formData.name.trim(),
        emotional_state: formData.emotional_state,
        theme_color: selectedState.color,
        // Usar el método getDefaultMusicType() de la clase
        music_type: emotionalStateInstance ? emotionalStateInstance.getDefaultMusicType() : 'lofi'
      };

      const { error } = await updateDesktop(editingDesktop.id, updates);
      if (error) throw error;

      await loadDesktops();
      
      // Notificar al componente principal que actualice el escritorio actual si se edito
      if (onDesktopUpdate) {
        await onDesktopUpdate();
      }
      
      setEditingDesktop(null);
      setFormData({ name: '', emotional_state: 'happy', theme_color: '#FFD700' });
      setError('');
    } catch (err) {
      setError('Error al actualizar el escritorio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDesktop = async (desktop) => {
    if (!window.confirm(`Estas seguro de eliminar "${desktop.name}"?`)) return;

    try {
      setLoading(true);
      const { error } = await deleteDesktop(desktop.id);
      if (error) throw error;

      await loadDesktops();
      
      // Si el escritorio eliminado estaba actual, seleccione otro
      if (currentDesktop && currentDesktop.id === desktop.id) {
        const remaining = desktops.filter(d => d.id !== desktop.id);
        if (remaining.length > 0) {
          onDesktopSelect(remaining[0]);
        }
      }
    } catch (err) {
      setError('Error al eliminar el escritorio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (desktop) => {
    setEditingDesktop(desktop);
    setFormData({
      name: desktop.name,
      emotional_state: desktop.emotional_state,
      theme_color: desktop.theme_color
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingDesktop(null);
    setFormData({ name: '', emotional_state: 'happy', theme_color: '#FFD700' });
  };

  // Ya no necesitamos getMusicTypeForEmotion porque usamos el método de la clase
  // const getMusicTypeForEmotion = (emotion) => { ... }

  const getEmotionalStateData = (stateId) => {
    // Usar el método findByIdAsObject de la clase EmotionalState
    return EmotionalState.findByIdAsObject(stateId, t) || emotionalStates[0];
  };

  if (loading && desktops.length === 0) {
    return (
      <div className="desktop-manager">
        <div className="loading-spinner">{t.loadingDesktop || 'Cargando escritorio...'}</div>
      </div>
    );
  }

  return (
    <div className="desktop-manager">
      <div className="desktop-manager-header">
        <h2>{t.switchDesktop || 'Cambiar de escritorio'}</h2>
        <div className="header-actions">
          <div className="workspace-count">
            <span className="count-text">
              {desktops.length}/{isPremium() ? '∞' : getLimit('desktops')} {t.desktops || 'Escritorios'}
            </span>
            {!isPremium() && (
              <span className="plan-badge">{t.freePlan || 'Plan gratuito'}</span>
            )}
          </div>
          <button 
            className="btn-create"
            onClick={() => setShowCreateForm(true)}
            disabled={!canCreateMore('desktops', desktops.length)}
          >
            + {t.createNewDesktop || 'Crear nuevo escritorio'}
          </button>
        </div>
        
        {!isPremium() && !canCreateMore('desktops', desktops.length) && (
          <div className="limit-warning">
            <span>{t.reachedFreePlanLimit || 'Alcanzaste el limite del plan gratuito'}</span>
            <button className="upgrade-btn-small" onClick={upgradeToPremium}>
              {t.upgradeToPremium}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      {/* Crear/Editar formulario */}
      {(showCreateForm || editingDesktop) && (
        <div className="desktop-form-overlay">
          <div className="desktop-form">
            <h3>{editingDesktop ? 'Editar espacio de trabajo' : 'Crear nuevo espacio de trabajo'}</h3>
            
            <form onSubmit={editingDesktop ? handleEditDesktop : handleCreateDesktop}>
              <div className="form-group">
                <label>Nombre de escritorio</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Escritorio para relajarme"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado emocional</label>
                <div className="emotion-grid">
                  {emotionalStates.map(state => (
                    <div
                      key={state.id}
                      className={`emotion-option ${formData.emotional_state === state.id ? 'selected' : ''}`}
                      onClick={() => setFormData({
                        ...formData, 
                        emotional_state: state.id,
                        theme_color: state.color
                      })}
                    >
                      <span className="emotion-emoji">{state.emoji}</span>
                      <span className="emotion-name">{state.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingDesktop ? 'Actualizar' : 'Crear')}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    cancelEdit();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenedor de lista de escritorios con scroll */}
      <div className="desktop-list-container">
        <div className="desktop-list">
          {desktops.length === 0 ? (
            <div className="empty-state">
              <p>No hay escritorios aún! Crea uno</p>
            </div>
          ) : (
            desktops.map(desktop => {
              const stateData = getEmotionalStateData(desktop.emotional_state);
              const isActive = currentDesktop && currentDesktop.id === desktop.id;
              
              return (
                <div 
                  key={desktop.id} 
                  className={`desktop-card ${isActive ? 'activo' : ''}`}
                  style={{ borderColor: stateData.color }}
                >
                  <div className="desktop-info" onClick={() => onDesktopSelect(desktop)}>
                    <div className="desktop-header">
                      <span className="desktop-emoji">{stateData.emoji}</span>
                      <h3 className="desktop-name">{desktop.name}</h3>
                      {isActive && <span className="active-badge">Activar</span>}
                    </div>
                    <p className="desktop-emotion">Modo {stateData.name}</p>
                    <p className="desktop-date">
                      Creado {new Date(desktop.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="desktop-actions">
                    <button 
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(desktop);
                      }}
                      title="Editar escritorio"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDesktop(desktop);
                      }}
                      title="Eliminar escritorio"
                      disabled={desktops.length === 1}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopManager;
