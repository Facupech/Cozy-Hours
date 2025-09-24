import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import LanguageToggle from '../components/LanguageToggle';
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
  const { language } = useLanguage();
  const t = translations[language];
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
      newErrors.email = t.emailRequiredRegister;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmailRegister;
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequiredRegister;
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordMinLength;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordsDontMatch;
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
            general: t.emailAlreadyRegistered
          });
        } else if (error.message && error.message.includes('La contraseña debe tener al menos 6 caracteres')) {
          setErrors({ password: t.passwordMinLength });
        } else {
          setErrors({ 
            general: error.message || t.unexpectedErrorRegister
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
      setErrors({ general: t.unexpectedErrorRegister });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <LanguageToggle className="auth-language-toggle" />
        <div className="auth-header">
          <Link to="/" className="back-link">
            {t.backToHomeRegister}
          </Link>
          <h1 className="auth-title">{t.createAccount}</h1>
          <p className="auth-subtitle">{t.joinCozyHours}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">{t.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder={t.emailPlaceholder}
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">{t.password}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder={t.passwordPlaceholder}
              disabled={loading}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">{t.confirmPassword}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder={t.confirmPasswordPlaceholder}
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
                {t.creatingAccount}
              </>
            ) : (
              t.createAccountBtn
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
           {t.alreadyHaveAccount}{' '}
            <Link to="/login" className="auth-link">
              {t.signInHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
