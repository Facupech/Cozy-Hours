import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription debe usarse dentro de un SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Inicializar suscripción desde localStorage o por defecto a free
  const [subscription, setSubscription] = useState(() => {
    const savedSubscription = localStorage.getItem('cozy-hours-subscription');
    if (savedSubscription) {
      try {
        return JSON.parse(savedSubscription);
      } catch (error) {
        console.error('Error al analizar la suscripción guardada:', error);
      }
    }
    return {
      type: 'free', // 'free' or 'premium'
      limits: {
        tasks: 10,
        notes: 5,
        desktops: 3
      },
      premiumFeatures: {
        exclusiveMusic: false,
        premiumWallpapers: false,
        advancedCustomization: false,
        prioritySupport: false
      },
      isFirstLogin: false
    };
  });

  // Guardar suscripción en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cozy-hours-subscription', JSON.stringify(subscription));
  }, [subscription]);

  // Manejar la lógica del primer inicio de sesión
  useEffect(() => {
    if (user) {
      const userKey = `cozy-hours-user-${user.id}`;
      const hasLoggedInBefore = localStorage.getItem(userKey);
      
      if (!hasLoggedInBefore) {
        // Primera vez inciando sesión - asegurar que el usuario comience con el plan gratuito
        console.log('Se detectó el primer inicio de sesión, configurando un plan gratuito');
        
        setSubscription({
          type: 'free',
          limits: {
            tasks: 10,
            notes: 5,
            desktops: 3
          },
          premiumFeatures: {
            exclusiveMusic: false,
            premiumWallpapers: false,
            advancedCustomization: false,
            prioritySupport: false
          },
          isFirstLogin: true
        });
        
        // Marcar al usuario como que ha iniciado sesión antes
        localStorage.setItem(userKey, 'true');
      } else {
        // Usuario se ha logeado anteriormente, sincronizar estado suscripción con base de datos si es necesario
        console.log('Usuario que regresa, estado de suscripción:', subscription.type);
      }
    }
  }, [user]);

  const isPremium = () => subscription.type === 'premium';
  
  const canCreateMore = (type, currentCount) => {
    if (isPremium()) return true;
    return currentCount < subscription.limits[type];
  };

  const getLimit = (type) => {
    if (isPremium()) return 'ilimitado';
    return subscription.limits[type];
  };

  const getRemainingCount = (type, currentCount) => {
    if (isPremium()) return 'ilimitado';
    return Math.max(0, subscription.limits[type] - currentCount);
  };

  const upgradeToPremium = () => {
    // Para probar en demo, permitiremos mejorar manualmente
    const confirmUpgrade = window.confirm('🚀 Mejorar al Premium?\n\n✨ Tareas ilimitadas, notas y escritorios\n🎵 Coleccion de musica exclusiva\n🎨 Fondos premium\n⚙️ Customizacion avanzada\n🎯 soporte prioritario\n\nActivar el premium ahora?');
    
    if (confirmUpgrade) {
      setSubscription({
        type: 'premium',
        limits: {
          tasks: Infinity,
          notes: Infinity,
          desktops: Infinity
        },
        premiumFeatures: {
          exclusiveMusic: true,
          premiumWallpapers: true,
          advancedCustomization: true,
          prioritySupport: true
        }
      });
      alert('🎉 Bienvenido al premium!! ');
    }
  };

  const downgradeToFree = () => {
    const confirmDowngrade = window.confirm('Cambiar al plan gratuito?\n\nPerderás el acceso a las funciones premium');
    
    if (confirmDowngrade) {
      setSubscription({
        type: 'free',
        limits: {
          tasks: 10,
          notes: 5,
          desktops: 3
        },
        premiumFeatures: {
          exclusiveMusic: false,
          premiumWallpapers: false,
          advancedCustomization: false,
          prioritySupport: false
        }
      });
      alert('Cambiaste al plan gratuito.');
    }
  };

  const hasPremiumFeature = (feature) => {
    return isPremium() && subscription.premiumFeatures[feature];
  };

  const isFirstLogin = () => {
    return subscription.isFirstLogin;
  };

  const resetFirstLoginFlag = () => {
    setSubscription(prev => ({
      ...prev,
      isFirstLogin: false
    }));
  };

  const value = {
    subscription,
    isPremium,
    canCreateMore,
    getLimit,
    getRemainingCount,
    upgradeToPremium,
    downgradeToFree,
    hasPremiumFeature,
    isFirstLogin,
    resetFirstLoginFlag
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
