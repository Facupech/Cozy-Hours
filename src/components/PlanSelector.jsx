import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import './PlanSelector.css';

const PlanSelector = ({ showTitle = true }) => {
  const { subscription, isPremium, upgradeToPremium, downgradeToFree } = useSubscription();

  const handlePlanChange = (planType) => {
    if (planType === 'premium' && !isPremium()) {
      upgradeToPremium();
    } else if (planType === 'free' && isPremium()) {
      downgradeToFree();
    }
  };

  return (
    <div className="plan-selector">
      {showTitle && <h3 className="plan-selector-title">Escoger tu plan</h3>}
      
      <div className="plan-options">
        {/* Plan Gratuito */}
        <div 
          className={`plan-option ${!isPremium() ? 'activo' : ''}`}
          onClick={() => handlePlanChange('free')}
        >
          <div className="plan-header">
            <span className="plan-icon">🆓</span>
            <h4 className="plan-name">Gratuito</h4>
            <span className="plan-price">$0/mes</span>
          </div>
          
          <div className="plan-features">
            <div className="feature">✅ Espacio de escritorio emocional básico</div>
            <div className="feature">✅ Colección de música estándar</div>
            <div className="feature">✅ Fondos de pantalla básicos</div>
            <div className="feature-limited">📝 Hasta 5 notas</div>
            <div className="feature-limited">✅ Hasta 10 tareas</div>
            <div className="feature-limited">🖥️ Hasta 3 escritorios</div>
          </div>
          
          {!isPremium() && <div className="current-plan">Plan actual</div>}
        </div>

        {/* Plan Premium */}
        <div 
          className={`plan-option premium ${isPremium() ? 'activo' : ''}`}
          onClick={() => handlePlanChange('premium')}
        >
          <div className="plan-header">
            <span className="plan-icon">👑</span>
            <h4 className="plan-name">Premium</h4>
            <span className="plan-price">$4.99/mes</span>
          </div>
          
          <div className="plan-features">
            <div className="feature">✨ Todo del plan gratuito</div>
            <div className="feature premium-feature">🎵 Música premium exclusiva</div>
            <div className="feature premium-feature">🎨 Fondos de pantalla premium</div>
            <div className="feature premium-feature">⚙️ Customización avanzada</div>
            <div className="feature premium-feature">📝 Notas ilimitadas</div>
            <div className="feature premium-feature">✅ Tareas ilimitadas</div>
            <div className="feature premium-feature">🖥️ Escritorios ilimitados</div>
            <div className="feature premium-feature">🎯 Soporte prioritario</div>
          </div>
          
          {isPremium() && <div className="current-plan premium">Plan actual</div>}
          {!isPremium() && <div className="upgrade-badge">Más popular</div>}
        </div>
      </div>
      
      <div className="plan-note">
        <p>💡 Cambia de plan en cualquier momento. ¡Las funciones Premium se activan instantáneamente!</p>
      </div>
    </div>
  );
};

export default PlanSelector;
