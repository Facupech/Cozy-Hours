import React, { useState, useEffect } from 'react';
import { createNote, getDesktopNotes, updateNote, deleteNote } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import './Widget.css';

const NotesWidget = ({ desktopId, onClose, isDesktopMode = false }) => {
  const { user } = useAuth();
  const { canCreateMore, getLimit, getRemainingCount, isPremium, upgradeToPremium } = useSubscription();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [desktopId]);



  const loadNotes = async () => {
    try {
      const { data, error } = await getDesktopNotes(desktopId);
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error al cargar notas :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    // Chequear límites de suscripción 
    if (!canCreateMore('notes', notes.length)) {
      alert(`El plan gratuito está limitado a ${getLimit('notes')} notas. ¡Actualízate a Premium para obtener notas ilimitadas!
`);
      return;
    }

    try {
      const noteData = {
        user_id: user.id,
        desktop_id: desktopId,
        content: newNote.trim(),
        position_x: Math.floor(Math.random() * 300),
        position_y: Math.floor(Math.random() * 200)
      };

      const { data, error } = await createNote(noteData);
      if (error) throw error;

      console.log('Resultado de la creación de notas:', data);
      
      // Actualizar estado local con nueva nota
      if (data) {
        // Manejar respuestas de array y objeto único
        const newNoteFromDB = Array.isArray(data) ? data[0] : data;
        console.log('Añadiendo nota al estado:', newNoteFromDB);
        
        if (newNoteFromDB && newNoteFromDB.id) {
          setNotes(prevNotes => {
            const updated = [newNoteFromDB, ...prevNotes];
            console.log('Matriz de notas actualizada:', updated);
            return updated;
          });
        } else {
          console.log('Estructura de datos de nota no válida, recarga de notas');
          await loadNotes();
        }
      } else {
        console.log('No se devolvieron datos, recargando notas');
        await loadNotes();
      }
      
      setNewNote('');
      console.log('Agregar nota completada');
    } catch (error) {
      console.error('Error al crear la nota:', error);
    }
  };

  const handleEditNote = (note) => {
    setEditingId(note.id);
    setEditingText(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const { data, error } = await updateNote(editingId, { content: editingText.trim() });
      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === editingId ? { ...note, content: editingText.trim() } : note
      ));
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Nota de actualización de error:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const { error } = await deleteNote(noteId);
      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div className={`widget notes-widget ${isDesktopMode ? 'desktop-mode' : ''}`}>
      {!isDesktopMode && (
        <div className="widget-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          padding: '0.5rem 1rem',
          borderBottom: '2px solid #ff0000',
          minHeight: '35px',
          background: 'rgba(255, 0, 0, 0.2)',
          borderRadius: '4px'
        }}>
          <h3 className="widget-title" style={{
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white'
          }}>📝 Notas</h3>
          <button className="widget-close" onClick={onClose} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>×</button>
        </div>
      )}

      <div className="widget-content">
        <form className="add-note-form" onSubmit={handleAddNote}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nota rápida..."
            className="note-input"
            rows={3}
            disabled={!canCreateMore('notes', notes.length)}
          />
          <button 
            type="submit" 
            className="btn btn-primary btn-sm"
            disabled={!canCreateMore('notes', notes.length)}
          >
            Agregar nota
          </button>
        </form>
        
        {/* Estado de suscripción */}
        <div className="subscription-status">
          <span className="note-count">
            {notes.length}/{isPremium() ? '∞' : getLimit('notes')} notas
          </span>
          {!isPremium() && !canCreateMore('notes', notes.length) && (
            <div className="limit-reached">
              <span>Limite alcanzado</span>
              <button className="upgrade-link" onClick={upgradeToPremium}>
                Mejorar a premium
              </button>
            </div>
          )}
        </div>

        <div className="notes-list">
          {loading ? (
            <div className="widget-loading">
              <div className="loading-spinner"></div>
              <p>Cargando notas...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>No hay notas! Agrea una</p>
            </div>
          ) : (
            notes.map(note => {
              console.log('Representación de nota individual:', note.id, note.content);
              return (
              <div key={note.id} className="note-item">
                {editingId === note.id ? (
                  <div className="note-edit">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="note-edit-input"
                      rows={3}
                    />
                    <div className="note-edit-actions">
                      <button 
                        className="btn btn-primary btn-xs"
                        onClick={handleSaveEdit}
                      >
                        guardar
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
                  <div className="note-content">
                    <p className="note-text">{note.content}</p>
                    <div className="note-actions">
                      <button 
                        className="note-action-btn"
                        onClick={() => handleEditNote(note)}
                        title="Editas nota"
                      >
                        ✏️
                      </button>
                      <button 
                        className="note-action-btn delete"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Eliminar nota"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
                <div className="note-timestamp">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesWidget;
