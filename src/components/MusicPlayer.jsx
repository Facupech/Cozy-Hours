import React from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  return (
    <div className="music-player">
      <div className="music-player-message">
        <h3>¡Próximamente!</h3>
        <p>Estamos trabajando en el reproductor de música para ofrecerte la mejor experiencia.</p>
        <p>Muy pronto podrás disfrutar de listas de reproducción personalizadas según tu estado de ánimo.</p>
      </div>
    </div>
  );
};

/*
// Código del reproductor de música (comentado temporalmente)
// Descomentar y actualizar cuando esté listo para implementar

import { useSubscription } from '../contexts/SubscriptionContext';

const musicSets = {
  happy: [
    { 
      id: 1, 
      title: 'Sunny Days', 
      artist: 'Upbeat Collective', 
      duration: '3:24',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // ... más pistas ...
  ],
  // ... más estados emocionales ...
};
*/

export default MusicPlayer;
