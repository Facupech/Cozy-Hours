import React, { useState, useEffect } from 'react';
import { createNote, getDesktopNotes, updateNote, deleteNote } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import NoteDetail from './NoteDetail';
import './Widget.css';
import './NotesWidget.css';

const NotesWidget = ({ desktopId, onClose, isDesktopMode = false }) => {
  const { user } = useAuth();
  const { canCreateMore, getLimit } = useSubscription();
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [desktopId]);

  const loadNotes = async () => {
    try {
      const { data, error } = await getDesktopNotes(desktopId);
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error al cargar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const title = newNoteTitle.trim() || 'Nueva nota';
    
    if (!canCreateMore('notes', notes.length)) {
      alert(`El plan gratuito está limitado a ${getLimit('notes')} notas. ¡Actualízate a Premium para obtener notas ilimitadas!`);
      return;
    }

    try {
      const noteData = {
        user_id: user.id,
        desktop_id: desktopId,
        title: title,
        content: '',
        position_x: Math.floor(Math.random() * 300),
        position_y: Math.floor(Math.random() * 200)
      };

      const { data, error } = await createNote(noteData);
      if (error) throw error;
      
      const newNote = data[0];
      setNotes(prev => [...prev, newNote]);
      setNewNoteTitle('');
      setSelectedNote(newNote);
      setIsAddingNote(false);
    } catch (error) {
      console.error('Error al crear la nota:', error);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) return;
    
    try {
      const { error } = await deleteNote(noteId);
      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  const handleNewNoteClick = () => {
    setIsAddingNote(true);
  };

  const handleCancelAddNote = () => {
    setIsAddingNote(false);
    setNewNoteTitle('');
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleCloseDetail = () => {
    setSelectedNote(null);
  };

  return (
    <div className={`widget notes-widget ${isDesktopMode ? 'desktop-mode' : ''}`}>
      <div className="widget-header">
        <h3>Notas</h3>
        <div className="widget-actions">
          <button 
            onClick={handleNewNoteClick}
            className="add-note-button"
            disabled={isAddingNote}
          >
            + Nueva nota
          </button>
          <button onClick={onClose} className="close-button">×</button>
        </div>
      </div>
      
      <div className="notes-list">
        {loading ? (
          <div className="loading">Cargando notas...</div>
        ) : notes.length === 0 ? (
          <div className="empty-notes">No hay notas. ¡Crea una nueva!</div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className="note-item"
              onClick={() => handleNoteClick(note)}
            >
              <div className="note-header">
                <h4 className="note-title">
                  {note.title || 'Sin título'}
                </h4>
                <button 
                  className="delete-note"
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  title="Eliminar nota"
                >
                  🗑️
                </button>
              </div>
              <div className="note-preview">
                {note.content ? (
                  note.content.length > 100 
                    ? `${note.content.substring(0, 100)}...`
                    : note.content
                ) : 'Sin contenido'}
              </div>
              <div className="note-date">
                {new Date(note.updated_at || note.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
      
      {isAddingNote && (
        <div className="add-note-form-container">
          <h4>Nueva nota</h4>
          <form onSubmit={handleAddNote}>
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Título de la nota"
              className="note-title-input"
              autoFocus
            />
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancelAddNote}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={!newNoteTitle.trim()}
              >
                Crear nota
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedNote && (
        <NoteDetail 
          note={selectedNote} 
          onClose={handleCloseDetail}
          onSave={handleNoteUpdate}
        />
      )}
    </div>
  );
};

export default NotesWidget;
