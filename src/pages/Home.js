import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const emotionalStates = [
  { key: 'happy', label: 'Feliz 😊', color: '#fef3c7' },
  { key: 'sad', label: 'Triste 😢', color: '#d0e6f7' },
  { key: 'focused', label: 'Enfocado 🎯', color: '#d1f2d8' },
  { key: 'tired', label: 'Cansado 😴', color: '#f2f2f2' },
  { key: 'relaxed', label: 'Relajado 😌', color: '#e2d9f3' },
  { key: 'stressed', label: 'Estresado 😖', color: '#f8d7da' },
];

export default function Home({ onSelectEmotionalState }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [escritorios, setEscritorios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('relaxed');

  // 🔁 Cargar escritorios
const cargarEscritorios = async () => {
  if (!user?.id) return;
  try {
    const res = await fetch(`http://localhost:3001/api/escritorios/${user.id}`);
    const data = await res.json();
    console.log('👀 Escritorios obtenidos:', data); // 👈 AGREGÁ ESTO
    setEscritorios(data);
  } catch (err) {
    console.error('Error al cargar escritorios:', err);
  }
};

console.log('👤 Usuario cargado:', user);

useEffect(() => {
  console.log('🔁 Ejecutando useEffect con user:', user);
  cargarEscritorios();
}, [user]);



  // ➕ Crear escritorio
 const crearEscritorio = async () => {
  if (!nombre.trim()) return alert('Poné un nombre');
  if (!user?.id) return alert('No hay usuario activo');

  try {
    const res = await fetch('http://localhost:3001/api/escritorios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: user.id, nombre, estado_emocional: estado })
    });

    if (res.ok) {
      const nuevoEscritorio = await res.json(); // 👈 Backend debe devolver el escritorio creado

      setEscritorios(prev => [...prev, nuevoEscritorio]); // 👈 Actualiza el estado sin recargar

      setNombre(''); // Limpia el input
    } else {
      alert('Error al crear escritorio');
    }
  } catch (err) {
    alert('Error de conexión al crear escritorio');
    console.error(err);
  }
};

return (
console.log('🧾 Escritorios en estado:', escritorios),
   
    <div style={{ padding: '2rem', textAlign: 'center' }}>  

      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2rem'
      }}>
        {emotionalStates.map(state => (
          <button
            key={state.key}
            onClick={() => onSelectEmotionalState(state.key)}
            style={{
              backgroundColor: state.color,
              border: 'none',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              minWidth: '120px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {state.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2>Crear nuevo escritorio</h2>
        <input
          type="text"
          placeholder="Nombre del escritorio"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
        />
        <br />
        <select value={estado} onChange={e => setEstado(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
          {emotionalStates.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <br />
        <button onClick={crearEscritorio} style={{ marginTop: '1rem', padding: '0.7rem 1.5rem', fontSize: '1rem' }}>Crear escritorio</button>
      </div>

    <div style={{ marginTop: '3rem' }}>
  <h3>Escritorios creados</h3>
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  }}>
    {escritorios.length === 0 ? (
      <p>No tenés escritorios creados.</p>
    ) : (
      escritorios.map((e) => (
        <div key={e.id} style={{
          border: '1px solid #ccc',
          borderRadius: '12px',
          padding: '1rem',
          width: '220px',
          backgroundColor: '#fafafa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h4>{e.nombre}</h4>
          <p>Estado: {e.estado_emocional}</p>
          <button
            onClick={() => {
              onSelectEmotionalState(e.estado_emocional);
              navigate('/workspace');
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </div>
      ))
    )}
  </div>
</div>



    </div>
    
  );
}
