

import React from 'react';
import NoteEditor from '../components/NoteEditor';
import TaskList from '../components/TaskList';
import PomodoroTimer from '../components/PomodoroTimer';
import RelaxationPanel from '../components/RelaxationPanel';

const colors = {
  happy: '#fef3c7',
  sad: '#d0e6f7',
  focused: '#d1f2d8',
  tired: '#f2f2f2',
  relaxed: '#e2d9f3',
  stressed: '#f8d7da',
};

const Workspace = ({ emotionalState, onBack }) => {
  return (
    <main
      style={{
        backgroundColor: colors[emotionalState] || '#fff',
        minHeight: '100vh',
        paddingTop: '6rem',
        paddingBottom: '3rem',
        transition: 'background-color 0.5s ease',
      }}
    >
      <button onClick={onBack} style={{ margin: '1rem' }}>← Cambiar estado emocional</button>
      <h2 style={{ textAlign: 'center' }}>Tu espacio personalizado: {emotionalState}</h2>
      <div className="workspace-grid">
        <NoteEditor />
        <TaskList />
        <PomodoroTimer />
        <RelaxationPanel />
      </div>
    </main>
  );
};

export default Workspace;

