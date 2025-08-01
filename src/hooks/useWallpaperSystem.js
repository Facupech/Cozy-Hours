import { useState, useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

// Definición de fondos de pantalla por estado emocional
const wallpapers = {
  happy: [
    { 
      id: 'happy-1', 
      name: 'Planicie Soleada', 
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
      type: 'image',
      premium: false 
    },
    { 
      id: 'happy-2', 
      name: 'Amanecer Radiante', 
      url: 'https://images.unsplash.com/photo-1693552067222-0e2ef8ed06b0?w=1600&auto=format&fit=crop&q=80', 
      type: 'image',
      premium: true 
    },
    { 
      id: 'happy-video-1', 
      name: 'Flores Floreciendo', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/happy-video-1.mp4', 
      type: 'video',
      premium: true,
      description: 'Time-lapse de flores creciendo en un campo soleado'
    },
    { 
      id: 'happy-video-2', 
      name: 'Girasoles Danzando', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/happy-video-2.mp4', 
      type: 'video',
      premium: true,
      description: 'Girasoles animados balanceándose con la brisa'
    }
  ],
  focused: [
    { 
      id: 'focused-1', 
      name: 'Profundidades del Océano', 
      url: 'https://images.pexels.com/photos/15591206/pexels-photo-15591206.jpeg', 
      type: 'image',
      premium: false 
    },
    { 
      id: 'focused-video-1', 
      name: 'Río Fluyendo', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/focused-video-1.mp4', 
      type: 'video',
      premium: true,
      description: 'Río fluyendo a través de un bosque'
    },
    { 
      id: 'focused-video-2', 
      name: 'Pescando en el Océano', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/focused-video-2.mp4', 
      type: 'video',
      premium: true,
      description: 'Barco pescando en océano sereno'
    },
    { 
      id: 'focused-video-3', 
      name: 'Lluvia en Ventana', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/focused-video-3.mp4', 
      type: 'video',
      premium: true,
      description: 'Gotas de agua deslizándose por una ventana con luces de ciudad desenfocadas'
    }
  ],
  relaxed: [
    { 
      id: 'relaxed-1', 
      name: 'Brisa de Bosque', 
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
      type: 'image',
      premium: false 
    },
    { 
      id: 'relaxed-video-1', 
      name: 'Árboles Meciéndose', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/relaxed-video-1.mp4', 
      type: 'video',
      premium: true,
      description: 'Árboles meciéndose suavemente en un día lluvioso y nublado'
    },
    { 
      id: 'relaxed-video-2', 
      name: 'Nubes Flotantes', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/relaxed-video-2.mp4', 
      type: 'video',
      premium: true,
      description: 'Nubes flotando en un cielo sereno'
    },
    { 
      id: 'relaxed-video-3', 
      name: 'Olas de Playa', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/relaxed-video-3.mp4', 
      type: 'video',
      premium: true,
      description: 'Olas suaves rompiendo en una playa tranquila al atardecer'
    }
  ],
  energetic: [
    { 
      id: 'energetic-1', 
      name: 'Estallido de Lava', 
      url: 'https://cdn.pixabay.com/photo/2022/08/19/09/05/volcano-7396466_1280.jpg', 
      type: 'image',
      premium: false 
    },
    { 
      id: 'energetic-video-1', 
      name: 'Tormenta Eléctrica', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/energetic-video-1.mp4', 
      type: 'video',
      premium: true,
      description: 'Tormenta eléctrica en una ciudad de noche'
    },
    { 
      id: 'energetic-video-2', 
      name: 'Energía Pulsante', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/energetic-video-2.mp4', 
      type: 'video',
      premium: true,
      description: 'Energía vibrante con colores eléctricos'
    },
    { 
      id: 'energetic-video-3', 
      name: 'Tráfico en Ciudad', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/energetic-video-3.mp4', 
      type: 'video',
      premium: true,
      description: 'Tráfico lento en una ciudad atardeciente'
    }
  ],
  creative: [
    { 
      id: 'creative-1', 
      name: 'Prado en Alturas', 
      url: 'https://cdn.pixabay.com/photo/2019/03/11/22/47/kamchatka-4049692_1280.jpg', 
      type: 'image',
      premium: false 
    },
    { 
      id: 'creative-video-1', 
      name: 'Aurora Boreal', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/creative-video-1.mp4', 
      type: 'video',
      premium: true,
      description: 'Aurora boreal bailando en el cielo nocturno'
    },
    { 
      id: 'creative-video-2', 
      name: 'Explosión de Colores', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/creative-video-2.mp4', 
      type: 'video',
      premium: true,
      description: 'Colores vibrantes explotando y mezclándose en patrones artísticos'
    },
    { 
      id: 'creative-video-3', 
      name: 'Tinta en Agua', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers//creative-video-3.mp4', 
      type: 'video',
      premium: true,
      description: 'Tinta naranja en agua creando arte fluido'
    }
  ],
  calm: [
    { 
      id: 'calm-1', 
      name: 'Aguas Pacíficas', 
      url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
      type: 'image',
      premium: false 
    },
    { 
      id: 'calm-video-1', 
      name: 'Niebla y Montaña', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/calm-video-1.mp4', 
      type: 'video',
      premium: true,
      description: 'Niebla serena y una montaña al fondo con un cielo azul'
    },
    { 
      id: 'calm-video-2', 
      name: 'Jardín Zen', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/calm-video-2.mp4', 
      type: 'video',
      premium: true,
      description: 'Pacífico jardín Zen con suaves caídas de hojas de cerezo'
    },
    { 
      id: 'calm-video-3', 
      name: 'Espacio de Meditación', 
      url: 'https://zegbjygxmtsybxnqayoj.supabase.co/storage/v1/object/public/wallpapers/calm-video-3.mp4', 
      type: 'video',
      premium: true,
      description: 'Espacio de meditación tranquilo con suave luz de velas e incienso'
    }
  ]
};

export const useWallpaperSystem = (emotionalState, onWallpaperChange) => {
  const { isPremium } = useSubscription();
  const premium = isPremium();
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(30000); // 30 segundos por defecto

  // Obtener fondos disponibles según suscripción
  const getAvailableWallpapers = (state) => {
    const stateWallpapers = wallpapers[state] || wallpapers.happy;
    return premium ? stateWallpapers : stateWallpapers.filter(w => !w.premium);
  };

  // Obtener fondo actual
  const getCurrentWallpaper = () => {
    const available = getAvailableWallpapers(emotionalState);
    if (available.length === 0) return null;
    return available[currentWallpaperIndex % available.length];
  };

  // Cambiar al siguiente fondo
  const nextWallpaper = () => {
    const available = getAvailableWallpapers(emotionalState);
    if (available.length > 1) {
      setCurrentWallpaperIndex(prev => (prev + 1) % available.length);
    }
  };

  // Seleccionar fondo específico
  const selectWallpaper = (wallpaperId) => {
    const available = getAvailableWallpapers(emotionalState);
    const index = available.findIndex(w => w.id === wallpaperId);
    if (index !== -1) {
      setCurrentWallpaperIndex(index);
    }
  };

  // Efecto para rotación automática
  useEffect(() => {
    if (!rotationEnabled) return;

    const available = getAvailableWallpapers(emotionalState);
    if (available.length <= 1) return;

    const interval = setInterval(() => {
      nextWallpaper();
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [rotationEnabled, rotationInterval, emotionalState, premium]);

  // Efecto para notificar cambios de fondo
  useEffect(() => {
    const currentWallpaper = getCurrentWallpaper();
    if (currentWallpaper && onWallpaperChange) {
      onWallpaperChange(currentWallpaper);
    }
  }, [currentWallpaperIndex, emotionalState, premium]);

  // Resetear índice cuando cambia el estado emocional
  useEffect(() => {
    setCurrentWallpaperIndex(0);
  }, [emotionalState]);

  return {
    currentWallpaper: getCurrentWallpaper(),
    availableWallpapers: getAvailableWallpapers(emotionalState),
    allWallpapers: wallpapers[emotionalState] || wallpapers.happy,
    rotationEnabled,
    rotationInterval,
    setRotationEnabled,
    setRotationInterval,
    nextWallpaper,
    selectWallpaper,
    currentWallpaperIndex
  };
};