import React from 'react';
import EmotionalSelector from '../components/EmotionalSelector';

const Home = ({ onSelectEmotionalState }) => {
  return (
    <main style={mainStyle}>
      <section style={{ marginTop: '6rem', padding: '2rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h1>Bienvenido a Escritorio Emocional</h1>
        <p>
          Una plataforma para adaptar tu entorno digital según tu estado emocional, potenciando tu concentración, bienestar y productividad.
        </p>
        <p>Selecciona cómo te sentís hoy para comenzar:</p>
        <EmotionalSelector onSelect={onSelectEmotionalState} />
      </section>
    </main>
  );
};

const mainStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-background)',
  paddingBottom: '3rem',
};

export default Home;
