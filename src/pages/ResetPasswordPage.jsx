import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Intentar recuperar sesión desde URL (hash) o query cuando es un enlace de recuperación
    const initFromRecoveryLink = async () => {
      try {
        // 1) Priorizar tokens en el hash (#) que envía Supabase
        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
        const hashType = hashParams.get('type');
        const hashAccess = hashParams.get('access_token');
        const hashRefresh = hashParams.get('refresh_token');

        // 2) También considerar query params como fallback
        const queryParams = new URLSearchParams(location.search);
        const queryType = queryParams.get('type');
        const queryAccess = queryParams.get('access_token');
        const queryRefresh = queryParams.get('refresh_token');

        const type = hashType || queryType;
        const accessToken = hashAccess || queryAccess;
        const refreshToken = hashRefresh || queryRefresh;

        if (type === 'recovery') {
          if (!accessToken) {
            // Enlace inválido/expirado: no hay access_token
            setMessage({
              type: 'error',
              text: 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.'
            });
            return;
          }

          // setSession en supabase v2 requiere ambos tokens para persistir la sesión
          // Los enlaces de recuperación normalmente incluyen refresh_token también.
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (error) {
            console.error('Error al configurar la sesión:', error);
            setMessage({
              type: 'error',
              text: 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.'
            });
            return;
          }

          // Limpiar la URL para ocultar los tokens
          window.history.replaceState({}, document.title, window.location.pathname);

          // Obtener el usuario actual con v2
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error('Error obteniendo usuario tras setSession:', userError);
          }
          if (userData?.user?.email) {
            setEmail(userData.user.email);
          }
          return;
        }

        // Si Supabase nos redirige con error en el hash (por ejemplo otp_expired)
        const errorCode = hashParams.get('error_code') || queryParams.get('error_code');
        const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
        if (errorCode) {
          setMessage({
            type: 'error',
            text: errorDesc || 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.'
          });
          return;
        }

        // Si llegamos aquí y no hay nada útil en la URL, verificar si ya hay sesión (por ejemplo, usuario ya autenticado)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          setEmail(sessionData.session.user.email);
        } else {
          setMessage({
            type: 'error',
            text: 'No se encontró un enlace de restablecimiento válido. Por favor, solicita uno nuevo.'
          });
        }
      } catch (err) {
        console.error('Error procesando enlace de recuperación:', err);
        setMessage({
          type: 'error',
          text: 'Hubo un problema procesando el enlace de restablecimiento. Por favor, solicita uno nuevo.'
        });
      }
    };

    initFromRecoveryLink();
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Verificar que exista una sesión válida antes de actualizar
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        throw new Error('No hay una sesión activa para restablecer la contraseña. El enlace puede haber expirado. Solicita uno nuevo.');
      }

      // Actualizar la contraseña del usuario actual
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });
      
      if (error) throw error;
      
      // Cerrar sesión después de cambiar la contraseña
      await supabase.auth.signOut();
      
      setMessage({
        type: 'success',
        text: '¡Tu contraseña ha sido actualizada correctamente! Redirigiendo al inicio de sesión...'
      });
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login', { state: { passwordUpdated: true } });
      }, 3000);
      
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Ocurrió un error al restablecer la contraseña. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/login" className="back-link">
            ← Volver al inicio de sesión
          </Link>
          <h1 className="auth-title">Restablecer Contraseña</h1>
          <p className="auth-subtitle">
            {message.type === 'success' 
              ? message.text
              : email 
                ? `Establece una nueva contraseña para ${email}`
                : 'Ingresa tu nueva contraseña para continuar.'}
          </p>
        </div>

        {message.type !== 'success' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            {message.text && (
              <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password" className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Ingresa tu nueva contraseña"
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
                placeholder="Confirma tu nueva contraseña"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            ¿Recordaste tu contraseña?{' '}
            <a href="/login" className="auth-link">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
