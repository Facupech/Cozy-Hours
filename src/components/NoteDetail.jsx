import React, { useState, useEffect, useCallback } from 'react';
import { updateNote } from '../lib/supabase';
import './NoteDetail.css';

const NoteDetail = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!hasChanges) return;
    
    const timer = setTimeout(async () => {
      await handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, hasChanges]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      await updateNote(note.id, { 
        title: title.trim() || 'Sin título',
        content: content.trim() 
      });
      setLastSaved(new Date().toLocaleTimeString());
      setHasChanges(false);
      if (onSave) onSave();
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    } finally {
      setIsSaving(false);
    }
  }, [note?.id, title, content, hasChanges, onSave]);

  return (
    <div className="note-detail-overlay">
      <div className="note-detail-container">
        <div className="note-detail-header">
          <input
            type="text"
            className="note-detail-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Título de la nota"
          />
          <div className="note-detail-actions">
            {lastSaved && (
              <span className="last-saved">
                {isSaving ? 'Guardando...' : `Guardado: ${lastSaved}`}
              </span>
            )}
            <button onClick={onClose} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
        <div className="note-detail-content">
          <textarea
            className="note-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="Escribe tu nota aquí..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
