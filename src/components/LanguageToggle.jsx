import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './LanguageToggle.css';

const LanguageToggle = ({ className = '' }) => {
  const { language, toggleLanguage, isSpanish } = useLanguage();
  const t = translations[language];

  return (
    <button
      className={`language-toggle ${className}`}
      onClick={toggleLanguage}
      title={isSpanish ? 'Switch to English' : 'Cambiar a Español'}
      aria-label={isSpanish ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className="language-flag">
        {isSpanish ? '🇺🇸' : '🇪🇸'}
      </span>
      <span className="language-text">
        {isSpanish ? 'EN' : 'ES'}
      </span>
    </button>
  );
};

export default LanguageToggle;
