import React, { useState, useEffect } from 'react';
import { updateDesktop, deleteDesktop } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import EmotionalState from '../models/EmotionalState';
import './DesktopSettings.css';
import './Widget.css';

const musicTypes = [
  { id: 'ambient', name: 'Ambiente', description: 'Sonidos atmosféricos de fondo' },
  { id: 'upbeat', name: 'Optimista', description: 'Música enérgica y motivadora' },
  { id: 'calm', name: 'Calma', description: 'Melodías tranquilas y relajantes' },
  { id: 'focus', name: 'Enfocar', description: 'Sonidos que mejoran la concentración' }
];

const DesktopSettings = ({ desktop, onClose, onUpdate, isDesktopMode = false }) => {
  const { language } = useLanguage();
  const t = translations[language];
  // Usar la clase EmotionalState con POO
  const emotionalStates = EmotionalState.getAll(t);
  
  const [formData, setFormData] = useState({
    name: desktop.name || '',
    emotional_state: desktop.emotional_state || 'focused',
    theme_color: desktop.theme_color || '#4A90E2',
    music_type: desktop.music_type || 'ambient'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStateChange = (state) => {
    setFormData(prev => ({
      ...prev,
      emotional_state: state.id,
      theme_color: state.color
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('El nombre del escritorio es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await updateDesktop(desktop.id, formData);
      if (error) throw error;

      onUpdate();
      onClose();
    } catch (error) {
      setError('No se pudo actualizar el escritorio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este escritorio? Esta acción no se puede deshacer.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await deleteDesktop(desktop.id);
      if (error) throw error;

      onUpdate();
      onClose();
    } catch (error) {
      setError('No se pudo eliminar el escritorio:' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedState = emotionalStates.find(state => state.id === formData.emotional_state);

  return (
    <div className={`desktop-settings-overlay ${isDesktopMode ? 'desktop-mode' : ''}`}>
      <div className="desktop-settings-modal">
        {!isDesktopMode && (
          <div className="modal-header">
            <h2>Configuracion de escriotrio</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        )}

        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">Nombre de escritorio</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="form-input"
              placeholder="Enter desktop name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado emocional</label>
            <div className="emotional-states-grid">
              {emotionalStates.map(state => (
                <div
                  key={state.id}
                  className={`state-option ${formData.emotional_state === state.id ? 'selected' : ''}`}
                  onClick={() => handleStateChange(state)}
                >
                  <div className="state-emoji">{state.emoji}</div>
                  <span className="state-name">{state.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color del tema</label>
            <div className="color-picker">
              <input
                type="color"
                value={formData.theme_color}
                onChange={(e) => handleChange('theme_color', e.target.value)}
                className="color-input"
                disabled={loading}
              />
              <span className="color-value">{formData.theme_color}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de musica</label>
            <div className="music-types">
              {musicTypes.map(type => (
                <div
                  key={type.id}
                  className={`music-option ${formData.music_type === type.id ? 'selected' : ''}`}
                  onClick={() => handleChange('music_type', type.id)}
                >
                  <div className="music-name">{type.name}</div>
                  <div className="music-description">{type.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-section">
            <h4 className="preview-title">Vista previa</h4>
            <div 
              className="desktop-preview"
              style={{ backgroundColor: formData.theme_color + '20' }}
            >
              <div className="preview-content">
                <span className="preview-emoji">{selectedState?.emoji}</span>
                <div className="preview-info">
                  <div className="preview-name">{formData.name}</div>
                  <div className="preview-state">{selectedState?.name}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading || !formData.name.trim()}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <Cancelar></Cancelar>
            </button>
            
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              Eliminar escriotrio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSettings;
