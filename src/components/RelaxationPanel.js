import React from 'react';

const RelaxationPanel = () => {
  return (
    <div className="panel">
      <h3>🌿 Espacio de Relajación</h3>
      <p>Respirá profundo. Cerrá los ojos. Estás haciendo lo mejor que podés.</p>
      <audio controls>
        <source src="/sounds/relax.mp3" type="audio/mpeg" />
        Tu navegador no soporta el audio.
      </audio>
    </div>
  );
};

export default RelaxationPanel;
