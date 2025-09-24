import React, { useState, useEffect } from 'react';
import './ClockWidget.css';

const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long'
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="clock-widget">
      <div className="clock-time">
        {formatTime(currentTime)}
      </div>
      <div className="clock-day">
        {formatDay(currentTime)}
      </div>
      <div className="clock-date">
        {formatShortDate(currentTime)}
      </div>
    </div>
  );
};

export default ClockWidget;
