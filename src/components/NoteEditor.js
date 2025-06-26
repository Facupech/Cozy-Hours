import React, { useState } from 'react';

const NoteEditor = () => {
  const [text, setText] = useState('');

  return (
    <div className="panel">
      <h3>📝 Notas</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="8"
        placeholder="Escribí tus ideas o apuntes acá..."
      ></textarea>
    </div>
  );
};

export default NoteEditor;
