import React, { useState } from 'react';
import './EscritorioNuevo.css';

export default function EscritorioNuevo({ onCreate }) {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('relaxed');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ nombre, estado });
    setNombre('');
    setEstado('relaxed');
    setShowForm(false);
  };

  return (
    <div className="nuevo-escritorio-container">
      <button className="boton-mas" onClick={() => setShowForm(true)}>＋</button>

      {showForm && (
        <div className="modal-escritorio">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre del escritorio"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="happy">Feliz</option>
              <option value="sad">Triste</option>
              <option value="focused">Concentrado</option>
              <option value="tired">Cansado</option>
              <option value="relaxed">Relajado</option>
              <option value="stressed">Estresado</option>
            </select>
            <button type="submit">Crear</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
