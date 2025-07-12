import React, { useState, useContext, useEffect } from 'react'; // 👈 se agregó useEffect
import NoteEditor from '../components/NoteEditor';
import TaskList from '../components/TaskList';
import PomodoroTimer from '../components/PomodoroTimer';
import RelaxationPanel from '../components/RelaxationPanel';
import { UserContext } from '../context/UserContext';
import '../styles/Workspace.css';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';


const colors = {
  happy: '#fef3c7',
  sad: '#d0e6f7',
  focused: '#d1f2d8',
  tired: '#f2f2f2',
  relaxed: '#e2d9f3',
  stressed: '#f8d7da',
};

export default function Workspace({ emotionalState, onBack }) {
    const { logout, user } = useContext(UserContext); // 👈 se agregó user

  const [activePanels, setActivePanels] = useState({
    note: false,
    task: false,
    pomodoro: false,
    relax: false,
  });

  const [escritorio, setEscritorio] = useState(null); // 👈 se agregó setEscritorio
  
  useEffect(() => {
  if (!user?.id) return;

  fetch(`http://localhost:3001/api/escritorios/${user.id}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const ultimo = data[data.length - 1]; // último creado
        setEscritorio(ultimo);
      }
    })
    .catch(err => console.error('Error al traer escritorio:', err));
}, [user]);

  const togglePanel = (panel) => {
    setActivePanels(prev => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

const { id } = useParams();

  return (
    <main
      className="workspace"
      style={{
      backgroundColor: colors[escritorio?.estado_emocional] || '#fff',
        minHeight: '100vh',
        transition: 'background-color 0.5s ease',
        paddingLeft: '5rem'
      }}
    >
      {/* Botón volver */}
      <motion.button
  onClick={onBack}
  className="back-floating-btn"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  ←
</motion.button>


      {/* Botón cerrar sesión */}
      <button onClick={logout} className="top-btn right">Cerrar sesión</button>
{escritorio && (
  <div style={{ position: 'absolute', top: '1rem', left: '6rem', fontSize: '1.5rem' }}>
    <strong>📂 {escritorio.nombre}</strong> ({escritorio.estado_emocional})
  </div>
)}
      {/* Sidebar tipo HUD */}
      <div className="hud-sidebar-container">
        <div className="hud-sidebar closed">
          <button onClick={() => togglePanel('note')} className="hud-icon yellow">📝</button>
          <button onClick={() => togglePanel('task')} className="hud-icon red">✅</button>
          <button onClick={() => togglePanel('pomodoro')} className="hud-icon green">⏱️</button>
          <button onClick={() => togglePanel('relax')} className="hud-icon blue">🌿</button>
        </div>
      </div>

      <div className="panels">
        {activePanels.note && <div className="panel"><NoteEditor /></div>}
        {activePanels.task && <div className="panel"><TaskList /></div>}
        {activePanels.pomodoro && <div className="panel"><PomodoroTimer /></div>}
        {activePanels.relax && <div className="panel"><RelaxationPanel /></div>}
      </div>
    </main>
  );
}
