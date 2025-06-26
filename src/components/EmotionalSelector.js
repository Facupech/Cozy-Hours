import React from 'react';

const states = [
  { id: 'happy', label: 'Feliz', color: 'var(--color-happy)' },
  { id: 'sad', label: 'Triste', color: 'var(--color-sad)' },
  { id: 'focused', label: 'Enfocado', color: 'var(--color-focused)' },
  { id: 'tired', label: 'Cansado', color: 'var(--color-tired)' },
  { id: 'relaxed', label: 'Relajado', color: 'var(--color-relaxed)' },
  { id: 'stressed', label: 'Estresado', color: 'var(--color-stressed)' },
];

const EmotionalSelector = ({ onSelect }) => {
  return (
    <div style={containerStyle}>
      {states.map(({ id, label, color }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          style={{ ...buttonStyle, backgroundColor: color }}
          aria-label={`Seleccionar estado emocional: ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: '1rem',
};

const buttonStyle = {
  border: 'none',
  borderRadius: '0.5rem',
  color: 'white',
  padding: '1rem 1.5rem',
  fontSize: '1.2rem',
  cursor: 'pointer',
  minWidth: '120px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};

export default EmotionalSelector;
