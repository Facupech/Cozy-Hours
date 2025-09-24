import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { translations } from '../translations/translations';
import './NotesWidget.css';

const STORAGE_KEY = 'cozy-notes';

const NotesWidget = ({ onClose }) => {
  const { language } = useLanguage();
  const { canCreateMore, getLimit, isPremium, upgradeToPremium } = useSubscription();
  const t = translations[language];
  
  const [notes, setNotes] = useState(() => {
    // Cargar notas desde localStorage al iniciar
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [
      { 
        id: 1, 
        title: t.exampleNoteTitle || 'Nota de ejemplo', 
        content: t.exampleNoteContent || 'Esta es una nota de ejemplo. ¡Pruébala!', 
        updatedAt: new Date().toISOString() 
      }
    ];
  });
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Generar un ID único para nuevas notas
  const generateId = () => Math.max(0, ...notes.map(note => note.id)) + 1;

  // Guardar notas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Agregar una nueva nota
  const handleAddNote = () => {
    if (!newNote.title.trim()) return;
    
    // Verificar límites de suscripción
    if (!canCreateMore('notes', notes.length)) {
      alert(t.freePlanNotesLimit || `El plan gratuito está limitado a ${getLimit('notes')} notas. ¡Actualiza a Premium para notas ilimitadas!`);
      return;
    }
    
    const note = {
      id: generateId(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    setNewNote({ title: '', content: '' });
    setShowAddForm(false);
  };

  // Actualizar una nota existente
  const handleUpdateNote = (updatedNote) => {
    if (!updatedNote.title.trim()) return;
    
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id 
        ? { 
            ...updatedNote, 
            title: updatedNote.title.trim(),
            content: updatedNote.content.trim(),
            updatedAt: new Date().toISOString() 
          }
        : note
    );
    
    setNotes(updatedNotes);
    setEditingNote(null);
  };

  // Eliminar una nota
  const handleDeleteNote = (id) => {
    if (window.confirm(t.confirmDeleteNote || '¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotes(notes.filter(note => note.id !== id));
      if (editingNote?.id === id) {
        setEditingNote(null);
      }
    }
  };

  // Manejar la tecla Enter en los inputs
  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className="notes-widget">
      <div className="widget-header">
        <h3>{t.myNotes || 'Mis Notas'}</h3>
        <div className="widget-actions">
          <div className="notes-count">
            {notes.length}/{isPremium() ? '∞' : getLimit('notes')} {t.notes || 'notas'}
          </div>
          <button 
            className="add-note-button"
            onClick={() => setShowAddForm(true)}
            disabled={!canCreateMore('notes', notes.length)}
          >
            <FiPlus /> {t.newNote || 'Nueva nota'}
          </button>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div className="notes-content">
        {loading ? (
          <div className="loading">{t.loading || 'Cargando...'}</div>
        ) : (
          <div className="notes-content-inner">
            {showAddForm && (
              <div className="note-form-container">
                <div className="note-form">
                  <input
                    type="text"
                    className="note-title-input"
                    placeholder={t.noteTitlePlaceholder || 'Título de la nota'}
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    autoFocus
                  />
                  <textarea
                    className="note-content-input"
                    placeholder={t.noteContentPlaceholder || 'Escribe tu nota aquí...'}
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    rows="4"
                  />
                  <div className="form-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewNote({ title: '', content: '' });
                      }}
                    >
                      <FiX /> {t.cancel || 'Cancelar'}
                    </button>
                    <button 
                      className="save-button"
                      onClick={handleAddNote}
                      disabled={!newNote.title.trim()}
                    >
                      <FiCheck /> {t.save || 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Estado de suscripción */}
            {!isPremium() && !canCreateMore('notes', notes.length) && (
              <div className="limit-reached">
                <span>{t.limitReached || 'Limite alcanzado'}</span>
                <button className="upgrade-link" onClick={upgradeToPremium}>
                  {t.upgradeToPremium}
                </button>
              </div>
            )}
            
            {!showAddForm && notes.length === 0 && (
              <div className="empty-notes">
                <p>{t.noNotesYet || 'No hay notas aún'}</p>
                <button 
                  className="add-note-button"
                  onClick={() => setShowAddForm(true)}
                  disabled={!canCreateMore('notes', notes.length)}
                >
                  <FiPlus /> {t.createFirstNote || 'Crear mi primera nota'}
                </button>
              </div>
            )}

            {!showAddForm && notes.length > 0 && (
              <div className="notes-list">
                <div className="notes-grid">
                  {notes.map((note) => (
                    <div key={note.id} className="note-card">
                      {editingNote?.id === note.id ? (
                        <div className="note-edit-form">
                          <input
                            type="text"
                            className="note-title-input"
                            value={editingNote.title}
                            onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                            placeholder={t.title || 'Título'}
                            autoFocus
                          />
                          <textarea
                            className="note-content-input"
                            value={editingNote.content}
                            onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                            placeholder={t.noteContentPlaceholder || 'Contenido de la nota'}
                            rows="3"
                          />
                          <div className="note-actions">
                            <button 
                              className="save-button"
                              onClick={() => handleUpdateNote(editingNote)}
                              disabled={!editingNote.title.trim()}
                            >
                              <FiCheck /> {t.save || 'Guardar'}
                            </button>
                            <button 
                              className="cancel-button"
                              onClick={() => setEditingNote(null)}
                            >
                              <FiX /> {t.cancel || 'Cancelar'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="note-header">
                            <h4 className="note-title">{note.title}</h4>
                            <div className="note-actions">
                              <button 
                                className="icon-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingNote({...note});
                                }}
                                title={t.editNote || 'Editar nota'}
                              >
                                <FiEdit2 />
                              </button>
                              <button 
                                className="icon-button danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                title={t.deleteNote || 'Eliminar nota'}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          <div className="note-content">
                            {note.content || <span className="empty-content">{t.noContent || 'Sin contenido'}</span>}
                          </div>
                          <div className="note-footer">
                            <span className="note-date">
                              {new Date(note.updatedAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesWidget;
