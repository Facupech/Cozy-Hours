import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="panel">
      <h3>⏱ Temporizador Pomodoro</h3>
      <div style={{ fontSize: '2rem' }}>{formatTime(seconds)}</div>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
      <button onClick={() => { setSeconds(25 * 60); setIsRunning(false); }}>Reiniciar</button>
    </div>
  );
};

export default PomodoroTimer;
