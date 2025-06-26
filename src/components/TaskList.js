import React, { useState } from 'react';

const TaskList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, done: false }]);
      setTask('');
    }
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  return (
    <div className="panel">
      <h3>✅ Lista de Tareas</h3>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Escribí una tarea..."
      />
      <button onClick={addTask}>Agregar</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i} onClick={() => toggleTask(i)} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
