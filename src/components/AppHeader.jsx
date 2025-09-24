import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import AccountSettings from './AccountSettings';
import './AppHeader.css';

const AppHeader = ({ showLogo = true, title = null }) => {
  const { user } = useAuth();
  const { subscription, isPremium } = useSubscription();
  const { language } = useLanguage();
  const t = translations[language];
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  
  if (!user) return null;

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || t.user || 'Usuario';
  };

  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          
          <div className="header-left">
            {showLogo && (
              <div className="logo">
                <h1>Cozy Hours</h1>
              </div>
            )}
            {title && (
              <div className="page-title">
                <h2>{title}</h2>
              </div>
            )}
          </div>

          
          <div className="header-right">
         
            <div className={`subscription-badge ${isPremium() ? 'premium' : 'free'}`}>
              {isPremium() ? (
                <>
                  <span className="badge-icon">✨</span>
                  <span className="badge-text">{t.premium}</span>
                </>
              ) : (
                <>
                  <span className="badge-icon">🆓</span>
                  <span className="badge-text">{t.free}</span>
                </>
              )}
            </div>

           
            <button 
              className="user-profile-btn"
              onClick={() => setShowAccountSettings(true)}
              title={t.accountSettings || 'Configuración de cuenta'}
            >
              {getUserAvatar() ? (
                <img 
                  src={getUserAvatar()} 
                  alt={t.avatar || 'Avatar'} 
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
              <span className="user-name">{getUserDisplayName()}</span>
              <span className="dropdown-arrow">⚙️</span>
            </button>
          </div>
        </div>
      </header>

      
      <AccountSettings 
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
      />
    </>
  );
};

export default AppHeader;
