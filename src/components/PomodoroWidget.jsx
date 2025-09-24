import React, { useState, useEffect, useRef } from 'react';
import './Widget.css';

const PomodoroWidget = ({ onClose, isDesktopMode = false }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'trabajo' o 'descanso'
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef(null);

  const workDuration = 25 * 60; // 25 minutos
  const shortBreakDuration = 5 * 60; // 5 minutos
  const longBreakDuration = 15 * 60; // 15 minutos

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Mostrar notificación
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${sessionType === 'work' ? 'Trabajo' : 'descanso'} completado!`, {
        body: sessionType === 'work' ? 'Tiempo de descansar!' : 'listo para seguir trabajando?',
        icon: '/favicon.ico'
      });
    }

    if (sessionType === 'work') {
      setSessionCount(prev => prev + 1);
      // Después de 4 sesiones de trabajo, tomar un descanso largo
      const isLongBreak = (sessionCount + 1) % 4 === 0;
      setSessionType('break');
      setTimeLeft(isLongBreak ? longBreakDuration : shortBreakDuration);
    } else {
      setSessionType('work');
      setTimeLeft(workDuration);
    }
  };

  const handleStart = () => {
    // Pedir permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(sessionType === 'work' ? workDuration : 
                sessionType === 'break' && (sessionCount % 4 === 0) ? longBreakDuration : shortBreakDuration);
  };

  const handleSkip = () => {
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = sessionType === 'work' ? workDuration : 
                     (sessionCount % 4 === 0) ? longBreakDuration : shortBreakDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionInfo = () => {
    if (sessionType === 'work') {
      return {
        title: 'Pomodoro',
        emoji: '🎯',
        color: '#4A90E2'
      };
    } else {
      const isLongBreak = sessionCount % 4 === 0;
      return {
        title: isLongBreak ? 'largo descanso' : 'Breve descanso',
        emoji: isLongBreak ? '😌' : '☕',
        color: isLongBreak ? '#7ED321' : '#FF6B35'
      };
    }
  };

  const sessionInfo = getSessionInfo();

  return (
    <div className={`widget pomodoro-widget ${isDesktopMode ? 'desktop-mode' : ''}`}>
      {!isDesktopMode && (
        <div className="widget-header">
          <h3 className="widget-title">⏰ Temporizador Pomodoro</h3>
          <button className="widget-close" onClick={onClose}>×</button>
        </div>
      )}

      <div className="widget-content">
        <div className="pomodoro-container">
          <div className="session-info">
            <div className="session-emoji">{sessionInfo.emoji}</div>
            <h4 className="session-title">{sessionInfo.title}</h4>
            <div className="session-stats">
              <span>Sesion {sessionCount + 1}</span>
              {sessionCount > 0 && <span> • {sessionCount} completado</span>}
            </div>
          </div>

          <div className="timer-display">
            <div className="timer-circle">
              <svg className="progress-ring" width="100" height="100">
                <circle
                  className="progress-ring-background"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="4"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="progress-ring-progress"
                  stroke={sessionInfo.color}
                  strokeWidth="4"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - getProgress() / 100)}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="timer-text">
                <div className="time-display">{formatTime(timeLeft)}</div>
                <div className="time-label">
                  {sessionType === 'work' ? 'Concentrado' : 'Descanso'}
                </div>
              </div>
            </div>
          </div>

          <div className="timer-controls">
            {!isActive ? (
              <button className="control-btn primary" onClick={handleStart}>
                ▶️ 
              </button>
            ) : (
              <button className="control-btn" onClick={handlePause}>
                ⏸️ 
              </button>
            )}
            
            <button className="control-btn" onClick={handleReset}>
              🔄 
            </button>
            
            <button className="control-btn" onClick={handleSkip}>
              ⏭️ 
            </button>
          </div>

          <div className="pomodoro-info">
            <div className="info-compact">
              <span className="info-item">Trabajo: 25m</span>
              <span className="info-item">Descanso: 5m</span>
              <span className="info-item">Largo: 15m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget;
