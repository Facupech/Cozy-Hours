import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const { signIn } = useAuth();
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
      newErrors.email = 'email requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'email invalido';
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Credencial de inicio de sesión no válidas')) {
          setErrors({ general: 'Correo electrónico o contraseña no válidos' });
        } else if (error.message.includes('Correo electrónico no confirmado')) {
          setErrors({ general: 'Por favor revise su correo electrónico y confirme su cuenta antes de iniciar sesión.' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      // Verificar si el usuario ha completado la configuración emocional
      navigate('/emotional-setup');
    } catch (error) {
      setErrors({ general: 'Se produjo un error inesperado. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetError('Por favor ingrese su correo electrónico');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Por favor ingrese un correo electrónico válido');
      return;
    }
    
    setResetError('');
    setLoading(true);
    
    try {
      // Primero intentamos enviar el correo con la URL de redirección
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      setResetError(error.message || 'Ocurrió un error al enviar el correo de recuperación. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    setShowResetForm(false);
    setResetEmail('');
    setResetError('');
    setResetSent(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {!showResetForm ? (
          <>
            <div className="auth-header">
              <Link to="/" className="back-link">
                ← Volver a la página de inicio
              </Link>
              <h1 className="auth-title">Bienvenido de nuevo</h1>
              <p className="auth-subtitle">Inicie sesión en su cuenta de Cozy Hours</p>
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
                  placeholder="Escribe tu contraseña"
                  disabled={loading}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group text-right">
                <button 
                  type="button" 
                  className="forgot-password-link"
                  onClick={() => setShowResetForm(true)}
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Iniciar sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="auth-link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="auth-header">
              <button 
                type="button" 
                className="back-link"
                onClick={handleBackToLogin}
              >
                ← Volver al inicio de sesión
              </button>
              <h1 className="auth-title">Recuperar contraseña</h1>
              <p className="auth-subtitle">
                {resetSent 
                  ? 'Revisa tu correo electrónico para restablecer tu contraseña.'
                  : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'}
              </p>
            </div>

            {!resetSent ? (
              <form className="auth-form" onSubmit={handleResetPassword}>
                {resetError && (
                  <div className="error-message">
                    {resetError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="reset-email" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    id="reset-email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="form-input"
                    placeholder="tucorreo@ejemplo.com"
                    disabled={loading}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Enviando...
                    </>
                  ) : (
                    'Enviar enlace de recuperación'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="success-message">
                  <p>Hemos enviado un correo a <strong>{resetEmail}</strong> con instrucciones para restablecer tu contraseña.</p>
                  <p>Si no ves el correo, revisa tu carpeta de spam.</p>
                </div>
                <button 
                  className="btn btn-secondary mt-4"
                  onClick={handleBackToLogin}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
