import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './PlanSelector.css';

const PlanSelector = ({ showTitle = true }) => {
  const { subscription, isPremium, upgradeToPremium, downgradeToFree } = useSubscription();
  const { language } = useLanguage();
  const t = translations[language];

  const handlePlanChange = (planType) => {
    if (planType === 'premium' && !isPremium()) {
      upgradeToPremium();
    } else if (planType === 'free' && isPremium()) {
      downgradeToFree();
    }
  };

  return (
    <div className="plan-selector">
      {showTitle && <h3 className="plan-selector-title">{t.chooseYourPlan || 'Escoger tu plan'}</h3>}
      
      <div className="plan-options">
        {/* Plan Gratuito */}
        <div 
          className={`plan-option ${!isPremium() ? 'activo' : ''}`}
          onClick={() => handlePlanChange('free')}
        >
          <div className="plan-header">
            <span className="plan-icon">🆓</span>
            <h4 className="plan-name">{t.free}</h4>
            <span className="plan-price">$0/{t.month || 'mes'}</span>
          </div>
          
          <div className="plan-features">
            <div className="feature">✅ {t.basicEmotionalDesktop || 'Espacio de escritorio emocional básico'}</div>
            <div className="feature">✅ {t.standardMusicCollection || 'Colección de música estándar'}</div>
            <div className="feature">✅ {t.basicWallpapers || 'Fondos de pantalla básicos'}</div>
            <div className="feature-limited">📝 {t.upTo5Notes || 'Hasta 5 notas'}</div>
            <div className="feature-limited">✅ {t.upTo10Tasks || 'Hasta 10 tareas'}</div>
            <div className="feature-limited">🖥️ {t.upTo3Desktops || 'Hasta 3 escritorios'}</div>
          </div>
          
          {!isPremium() && <div className="current-plan">{t.currentPlan || 'Plan actual'}</div>}
        </div>

        {/* Plan Premium */}
        <div 
          className={`plan-option premium ${isPremium() ? 'activo' : ''}`}
          onClick={() => handlePlanChange('premium')}
        >
          <div className="plan-header">
            <span className="plan-icon">👑</span>
            <h4 className="plan-name">{t.premium}</h4>
            <span className="plan-price">$4.99/{t.month || 'mes'}</span>
          </div>
          
          <div className="plan-features">
            <div className="feature">✨ {t.everythingFromFreePlan || 'Todo del plan gratuito'}</div>
            <div className="feature premium-feature">🎵 {t.exclusivePremiumMusic || 'Música premium exclusiva'}</div>
            <div className="feature premium-feature">🎨 {t.premiumWallpapers || 'Fondos de pantalla premium'}</div>
            <div className="feature premium-feature">⚙️ {t.advancedCustomization || 'Customización avanzada'}</div>
            <div className="feature premium-feature">📝 {t.unlimitedNotes || 'Notas ilimitadas'}</div>
            <div className="feature premium-feature">✅ {t.unlimitedTasks || 'Tareas ilimitadas'}</div>
            <div className="feature premium-feature">🖥️ {t.unlimitedDesktops || 'Escritorios ilimitados'}</div>
            <div className="feature premium-feature">🎯 {t.prioritySupport || 'Soporte prioritario'}</div>
          </div>
          
          {isPremium() && <div className="current-plan premium">{t.currentPlan || 'Plan actual'}</div>}
          {!isPremium() && <div className="upgrade-badge">{t.mostPopular || 'Más popular'}</div>}
        </div>
      </div>
      
      <div className="plan-note">
        <p>💡 {t.planChangeNote || 'Cambia de plan en cualquier momento. ¡Las funciones Premium se activan instantáneamente!'}</p>
      </div>
    </div>
  );
};

export default PlanSelector;
