import React from 'react';

const Header = ({ onNavigate }) => (
  <header style={headerStyle}>
    <div style={{ fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
      Escritorio Emocional - Oracle
    </div>
    <nav>
      <button style={btnStyle} onClick={() => onNavigate('home')}>Inicio</button>
      <button style={btnStyle} onClick={() => onNavigate('contact')}>Contacto</button>
    </nav>
  </header>
);

const headerStyle = {
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  width: '100%',
  top: 0,
  zIndex: 1000,
};

const btnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  marginLeft: '1rem',
  fontSize: '1rem',
};

export default Header;
