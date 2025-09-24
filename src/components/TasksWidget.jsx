import React, { useState, useEffect } from 'react';
import { createTask, getDesktopTasks, updateTask, deleteTask } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './Widget.css';

const TasksWidget = ({ desktopId, onClose, isDesktopMode = false }) => {
  const { user } = useAuth();
  const { canCreateMore, getLimit, getRemainingCount, isPremium, upgradeToPremium } = useSubscription();
  const { language } = useLanguage();
  const t = translations[language];
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [desktopId]);

  const loadTasks = async () => {
    try {
      const { data, error } = await getDesktopTasks(desktopId);
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // Chequear límites de suscripción
    if (!canCreateMore('tasks', tasks.length)) {
      alert(t.freePlanTaskLimit || `Free plan is limited to ${getLimit('tasks')} tasks. Upgrade to Premium for unlimited tasks!`);
      return;
    }

    try {
      const taskData = {
        user_id: user.id,
        desktop_id: desktopId,
        title: newTask.trim(),
        is_completed: false
      };

      const { data, error } = await createTask(taskData);
      if (data) {
        const newTaskFromDB = Array.isArray(data) ? data[0] : data;
        if (newTaskFromDB && newTaskFromDB.id) {
          setTasks(prevTasks => [newTaskFromDB, ...prevTasks]);
        } else {
          await loadTasks();
        }
      } else {
        await loadTasks();
      }
      setNewTask('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const { data, error } = await updateTask(task.id, { completed: !task.completed });
      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, completed: !task.completed } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const handleSaveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const { data, error } = await updateTask(editingId, { title: editingText.trim() });
      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === editingId ? { ...task, title: editingText.trim() } : task
      ));
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await deleteTask(taskId);
      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className={`widget tasks-widget ${isDesktopMode ? 'desktop-mode' : ''}`}>
      {!isDesktopMode && (
        <div className="widget-header">
          <h3 className="widget-title">✅ {t.tasks}</h3>
          <div className="task-stats">
            {tasks.length > 0 && (
              <span className="stats-text">
                {completedTasks.length}/{tasks.length} {t.completed || 'completado'}
              </span>
            )}
          </div>
          <button className="widget-close" onClick={onClose}>×</button>
        </div>
      )}

      <div className="widget-content">
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={t.addNewTask || 'Añadir una nueva tarea...'}
            className="task-input"
            disabled={!canCreateMore('tasks', tasks.length)}
          />
          <button 
            type="submit" 
            className="btn btn-primary btn-sm"
            disabled={!canCreateMore('tasks', tasks.length)}
          >
            {t.addTask || 'añadir tarea'}
          </button>
        </form>
        
        {/* Estado de suscripción */}
        <div className="subscription-status">
          <span className="task-count">
            {tasks.length}/{isPremium() ? '∞' : getLimit('tasks')} {t.tasks}
          </span>
          {!isPremium() && !canCreateMore('tasks', tasks.length) && (
            <div className="limit-reached">
              <span>{t.limitReached || 'Limite alcanzado'}</span>
              <button className="upgrade-link" onClick={upgradeToPremium}>
                {t.upgradeToPremium}
              </button>
            </div>
          )}
        </div>

        <div className="tasks-list">
          {loading ? (
            <div className="widget-loading">
              <div className="loading-spinner"></div>
              <p>Cargando tareas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No hay tareas. Añade tu primera tarea!</p>
            </div>
          ) : (
            <>
              {/* Tareas pendientes */}
              {pendingTasks.length > 0 && (
                <div className="task-section">
                  <h4 className="section-title">Para hacer</h4>
                  {pendingTasks.map(task => (
                    <div key={task.id} className="task-item">
                      {editingId === task.id ? (
                        <div className="task-edit">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="task-edit-input"
                          />
                          <div className="task-edit-actions">
                            <button 
                              className="btn btn-primary btn-xs"
                              onClick={handleSaveEdit}
                            >
                              Guardar
                            </button>
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="task-content">
                          <div className="task-main">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleComplete(task)}
                              className="task-checkbox"
                            />
                            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="task-actions">
                            <button 
                              className="task-action-btn"
                              onClick={() => handleEditTask(task)}
                              title="Editar tarea"
                            >
                              ✏️
                            </button>
                            <button 
                              className="task-action-btn delete"
                              onClick={() => handleDeleteTask(task.id)}
                              title="Eliminar tarea"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tareas completadas */}
              {completedTasks.length > 0 && (
                <div className="task-section completed-section">
                  <h4 className="section-title">Completado</h4>
                  {completedTasks.map(task => (
                    <div key={task.id} className="task-item completed">
                      <div className="task-content">
                        <div className="task-main">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task)}
                            className="task-checkbox"
                          />
                          <span className="task-text completed">
                            {task.title}
                          </span>
                        </div>
                        <div className="task-actions">
                          <button 
                            className="task-action-btn delete"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Eliminar tarea"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksWidget;
