import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import LanguageToggle from '../components/LanguageToggle';
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
      newErrors.email = t.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired;
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
          setErrors({ general: t.invalidCredentials });
        } else if (error.message.includes('Correo electrónico no confirmado')) {
          setErrors({ general: t.emailNotConfirmed });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      // Verificar si el usuario ha completado la configuración emocional
      navigate('/emotional-setup');
    } catch (error) {
      setErrors({ general: t.unexpectedError });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetError(t.pleaseEnterEmail);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError(t.pleaseEnterValidEmail);
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
      setResetError(error.message || t.recoveryEmailError);
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
        <LanguageToggle className="auth-language-toggle" />
        {!showResetForm ? (
          <>
            <div className="auth-header">
              <Link to="/" className="back-link">
                {t.backToHome}
              </Link>
              <h1 className="auth-title">{t.welcomeBack}</h1>
              <p className="auth-subtitle">{t.loginSubtitle}</p>
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

              <div className="form-group text-right">
                <button 
                  type="button" 
                  className="forgot-password-link"
                  onClick={() => setShowResetForm(true)}
                  disabled={loading}
                >
                  {t.forgotPassword}
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
                    {t.signingIn}
                  </>
                ) : (
                  t.signIn
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {t.noAccount}{' '}
                <Link to="/register" className="auth-link">
                  {t.signUpHere}
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
                {t.backToLogin}
              </button>
              <h1 className="auth-title">{t.resetPassword}</h1>
              <p className="auth-subtitle">
                {resetSent 
                  ? t.resetPasswordSent
                  : t.resetPasswordSubtitle}
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
                  <label htmlFor="reset-email" className="form-label">{t.emailAddress}</label>
                  <input
                    type="email"
                    id="reset-email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="form-input"
                    placeholder={t.emailPlaceholderReset}
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
                      {t.sending}
                    </>
                  ) : (
                    t.sendRecoveryLink
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="success-message">
                  <p>{t.resetEmailSent} <strong>{resetEmail}</strong> {t.resetEmailSent2}</p>
                  <p>{t.checkSpam}</p>
                </div>
                <button 
                  className="btn btn-secondary mt-4"
                  onClick={handleBackToLogin}
                >
                  {t.backToLoginBtn}
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
