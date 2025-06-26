import React from 'react';

const Footer = ({ onNavigate }) => (
  <footer style={footerStyle}>
    <button style={btnStyle} onClick={() => onNavigate('home')}>Inicio</button>
    <button style={btnStyle} onClick={() => onNavigate('workspace')}>Área de Trabajo</button>
    <button style={btnStyle} onClick={() => onNavigate('contact')}>Contacto</button>
  </footer>
);

const footerStyle = {
  backgroundColor: 'var(--color-secondary)',
  color: 'white',
  padding: '0.5rem 1rem',
  display: 'flex',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  bottom: 0,
};

const btnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  margin: '0 1rem',
  fontSize: '1rem',
};

export default Footer;
