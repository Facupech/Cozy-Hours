import React, { useState, useRef, useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import './MusicPlayer.css';

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
    { 
      id: 2, 
      title: 'Good Vibes', 
      artist: 'Happy Tunes', 
      duration: '2:58',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: false
    },
    { 
      id: 3, 
      title: 'Positive Energy', 
      artist: 'Joy Music', 
      duration: '4:12',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // Pistas premium
    { 
      id: 19, 
      title: 'Golden Hour Bliss', 
      artist: 'Premium Vibes', 
      duration: '5:30',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: true
    },
    { 
      id: 20, 
      title: 'Euphoric Dreams', 
      artist: 'Elite Happiness', 
      duration: '4:45',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: true
    }
  ],
  focused: [
    { 
      id: 4, 
      title: 'Deep Focus', 
      artist: 'Ambient Sounds', 
      duration: '8:45',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    { 
      id: 5, 
      title: 'Concentration', 
      artist: 'Study Music', 
      duration: '6:30',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: false
    },
    { 
      id: 6, 
      title: 'Flow State', 
      artist: 'Focus Beats', 
      duration: '7:15',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // Pistas premium
    { 
      id: 21, 
      title: 'Ultra Focus Zone', 
      artist: 'Premium Focus', 
      duration: '10:00',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: true
    },
    { 
      id: 22, 
      title: 'Neural Enhancement', 
      artist: 'Elite Concentration', 
      duration: '8:30',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: true
    }
  ],
  relaxed: [
    { 
      id: 7, 
      title: 'Peaceful Mind', 
      artist: 'Calm Waves', 
      duration: '5:20',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    { 
      id: 8, 
      title: 'Gentle Breeze', 
      artist: 'Nature Sounds', 
      duration: '4:45',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: false
    },
    { 
      id: 9, 
      title: 'Tranquil Moments', 
      artist: 'Relaxation', 
      duration: '6:10',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // Pistas premium
    { 
      id: 23, 
      title: 'Zen Garden Deluxe', 
      artist: 'Premium Relaxation', 
      duration: '12:00',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: true
    },
    { 
      id: 24, 
      title: 'Ocean Depths', 
      artist: 'Elite Calm', 
      duration: '9:15',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: true
    }
  ],
  energetic: [
    { 
      id: 10, 
      title: 'Power Up', 
      artist: 'Energy Boost', 
      duration: '3:15',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    { 
      id: 11, 
      title: 'High Voltage', 
      artist: 'Electric Beats', 
      duration: '2:45',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: false
    },
    { 
      id: 12, 
      title: 'Adrenaline Rush', 
      artist: 'Dynamic Music', 
      duration: '3:30',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // Pistas premium
    { 
      id: 25, 
      title: 'Maximum Overdrive', 
      artist: 'Premium Energy', 
      duration: '4:20',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: true
    },
    { 
      id: 26, 
      title: 'Turbo Boost Elite', 
      artist: 'Elite Power', 
      duration: '3:45',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: true
    }
  ],
  creative: [
    { 
      id: 13, 
      title: 'Inspiration Flow', 
      artist: 'Creative Minds', 
      duration: '4:55',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    { 
      id: 14, 
      title: 'Artistic Vision', 
      artist: 'Imagination', 
      duration: '5:40',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: false
    },
    { 
      id: 15, 
      title: 'Innovation', 
      artist: 'Creative Spark', 
      duration: '4:20',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // Pistas premium
    { 
      id: 27, 
      title: 'Genius Mode', 
      artist: 'Premium Creativity', 
      duration: '6:30',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: true
    },
    { 
      id: 28, 
      title: 'Masterpiece Maker', 
      artist: 'Elite Inspiration', 
      duration: '7:15',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: true
    }
  ],
  calm: [
    { 
      id: 16, 
      title: 'Serenity', 
      artist: 'Peaceful Sounds', 
      duration: '7:00',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    { 
      id: 17, 
      title: 'Meditation', 
      artist: 'Mindful Music', 
      duration: '8:30',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: false
    },
    { 
      id: 18, 
      title: 'Inner Peace', 
      artist: 'Zen Harmony', 
      duration: '6:45',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: false
    },
    // Pistas premium
    { 
      id: 29, 
      title: 'Transcendence', 
      artist: 'Premium Zen', 
      duration: '15:00',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      premium: true
    },
    { 
      id: 30, 
      title: 'Enlightenment', 
      artist: 'Elite Meditation', 
      duration: '12:30',
      url: 'https://file-examples.com/storage/fe68c1f7d44fa0b0c2f1a8b/2017/11/file_example_MP3_700KB.mp3',
      premium: true
    }
  ]
};

// Función para detectar automáticamente el estado emocional
const detectEmotionalState = () => {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const random = Math.random();
  
  // Energía mañanera (6-11 AM)
  if (hour >= 6 && hour < 11) {
    return random > 0.5 ? 'energetico' : 'Feliz';
  }
  // Horas de trabajo (11 AM - 5 PM)
  else if (hour >= 11 && hour < 17) {
    return random > 0.6 ? 'concentrado' : 'creativo';
  }
  // Relajación de tarde-noche (5-9 PM)
  else if (hour >= 17 && hour < 21) {
    return random > 0.4 ? 'Relajado' : 'Feliz';
  }
  // Noche calmada (9 PM - 6 AM)
  else {
    return random > 0.3 ? 'calmado' : 'relajado';
  }
};

// Función para obtener la descripción del estado emocional
const getEmotionDescription = (emotion) => {
  const descriptions = {
    happy: '😊 Vibraciones edificantes y alegres',
    focused: '🎯 Música de concentración profunda.',
    relaxed: '😌 Sonidos pacíficos y calmantes',
    energetic: '⚡ Ritmos motivacionales de alta energía',
    creative: '🎨 Melodías inspiradoras e imaginativas',
    calm: '🧘   Audio meditativo y sereno'
  };
  return descriptions[emotion] || '🎵 Selección de música personalizada';
};

const MusicPlayer = ({ emotionalState, musicType, isDesktopMode = false }) => {
  const { isPremium, hasPremiumFeature, upgradeToPremium } = useSubscription();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [musicVolume, setMusicVolume] = useState(70);
  const [ambientVolume, setAmbientVolume] = useState(30);
  const [detectedEmotion, setDetectedEmotion] = useState(() => detectEmotionalState());
  const audioRef = useRef(null);

  // Obtener pistas basado en el estado emocional detectado y filtrar por suscripción
  const allTracks = musicSets[detectedEmotion] || musicSets.happy;
  const tracks = allTracks.filter(track => {
    if (track.premium && !hasPremiumFeature('exclusiveMusic')) {
      return false; // Esconder pistas premium para usuarios gratuitos
    }
    return true;
  });

  useEffect(() => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }
  }, [detectedEmotion, tracks]);

  // Resetear la pista actual cuando cambia el estado emocional
  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [detectedEmotion]);

  // Detección automática del estado emocional cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      const newEmotion = detectEmotionalState();
      if (newEmotion !== detectedEmotion) {
        setDetectedEmotion(newEmotion);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [detectedEmotion]);

  // Actualizar fuente de audio cuando cambia la pista
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = musicVolume / 100;
    }
  }, [currentTrack, musicVolume]);

  // Actualizar el volumen cuando cambia el control deslizante
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Falló la reproducción de audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (track) => {
    // Chequear si la pista es premium y el usuario no tiene acceso
    if (track.premium && !hasPremiumFeature('exclusiveMusic')) {
      const confirmUpgrade = window.confirm('¡Musica Premium!\n\nTEsta es una canción premium exclusiva. ¿Mejora tu suscripción a Premium para desbloquear toda la música premium?');
      if (confirmUpgrade) {
        upgradeToPremium();
      }
      return;
    }
    
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      if (isPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(error => {
            console.log('Falló la reproducción de audio:', error);
          });
        }, 100);
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack?.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentTrack(tracks[previousIndex]);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.log('Error en la reproducción de audio:', error);
          });
        }
      }, 100);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack?.id);
    const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    setCurrentTrack(tracks[nextIndex]);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.log('Falló la reproducción de audio:', error);
          });
        }
      }, 100);
    }
  };

  return (
    <div className={`music-player ${isMinimized ? 'minimizado ' : ''} ${isDesktopMode ? 'desktop-mode' : ''}`}>
      <audio 
        ref={audioRef}
        onEnded={handleNext}
        onError={(e) => console.log('Error de audio:', e)}
      />
      {!isDesktopMode && (
        <div className="player-header">
          <h3 className="player-title">🎵 Musica</h3>
          <button 
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
        </div>
      )}



      {currentTrack && (
        <div className="current-track">
          <h4 className="track-name">{currentTrack.title}</h4>
          <p className="track-artist">{currentTrack.artist}</p>
          <p className="current-emotion">🎭 Reproduciendo: {detectedEmotion} musica</p>
        </div>
      )}

      <div className="playback-controls">
        <button className="control-btn" onClick={handlePrevious}>
          ⏮️
        </button>
        <button className="control-btn play-pause" onClick={handlePlayPause}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="control-btn" onClick={handleNext}>
          ⏭️
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="volume-section">
            <div className="volume-group">
              <div className="volume-label">
                <span>🎵 Musica</span>
                <span className="volume-value">{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(e.target.value)}
                className="volume-slider"
              />
            </div>

            <div className="volume-group">
              <div className="volume-label">
                <span>🌊 Ambiente</span>
                <span className="volume-value">{ambientVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(e.target.value)}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="track-selection">
            <div className="track-list">
              {/* Mostrar pistas disponibles */}
              {tracks.map(track => (
                <div
                  key={track.id}
                  className={`track-item ${currentTrack?.id === track.id ? 'active' : ''} ${track.premium ? 'premium-track' : ''}`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="track-info">
                    <h4>
                      {track.title}
                      {track.premium && <span className="premium-badge">👑</span>}
                    </h4>
                    <p>{track.artist}</p>
                  </div>
                  <span className="track-duration">{track.duration}</span>
                </div>
              ))}
              
              {/* Mostrar premium pistas bloqueadas para usuarios gratuitos */}
              {!hasPremiumFeature('exclusiveMusic') && (
                <>
                  <div className="premium-section-divider">
                    <span>👑 Musica premium</span>
                  </div>
                  {allTracks.filter(track => track.premium).map(track => (
                    <div
                      key={`locked-${track.id}`}
                      className="track-item premium-locked"
                      onClick={() => handleTrackSelect(track)}
                    >
                      <div className="track-info">
                        <h4>
                          🔒 {track.title}
                          <span className="premium-badge">👑</span>
                        </h4>
                        <p>{track.artist}</p>
                      </div>
                      <span className="track-duration">{track.duration}</span>
                      <button className="unlock-btn" onClick={(e) => {
                        e.stopPropagation();
                        upgradeToPremium();
                      }}>
                        Desbloquear
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;
