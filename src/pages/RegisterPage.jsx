import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTrialOption, setShowTrialOption] = useState(false);
  const [trialSelected, setTrialSelected] = useState(false);
  const { signUp } = useAuth();
  const { startPremiumTrial } = useSubscription();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Se requiere correo electrónico';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'Se requiere contraseña';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (showTrialOption && !trialSelected) return;

    setLoading(true);
    setErrors({});

    try {
      // Primero creamos el usuario
      const { data, error } = await signUp(formData.email, formData.password);
      
      // Si hay un error, lo manejamos
      if (error) {
        console.log('Error de registro:', error); // Para depuración
        
        if (error.message && (error.message.includes('ya está registrado') || 
                             error.message.includes('already registered') || 
                             error.message.includes('already in use') ||
                             error.message.includes('ya está en uso'))) {
          setErrors({ 
            general: 'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.' 
          });
        } else if (error.message && error.message.includes('La contraseña debe tener al menos 6 caracteres')) {
          setErrors({ password: 'La contraseña debe tener al menos 6 caracteres' });
        } else {
          setErrors({ 
            general: error.message || 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.' 
          });
        }
        setLoading(false);
        return;
      }
      
      // Si no hay error, continuamos con el flujo normal
      console.log('Registro exitoso, datos:', data); // Para depuración

      // Si el usuario seleccionó la prueba premium, la activamos
      if (trialSelected) {
        startPremiumTrial();
      }

      // Registro exitoso, redirigir a la configuración emocional
      navigate('/emotional-setup');
    } catch (error) {
      console.error('Error durante el registro:', error);
      setErrors({ general: 'Se produjo un error inesperado. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-link">
            ← Volver a Inicio
          </Link>
          <h1 className="auth-title">Crea tu cuenta</h1>
          <p className="auth-subtitle">Únete a Cozy Hours y comienza tu viaje de productividad emocional</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Escribe tu email"
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Crear contraseña (min. 6 caracteres)"
              disabled={loading}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirmar contraseña"
              disabled={loading}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
           ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicie sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
