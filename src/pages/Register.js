import React, { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(null);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if(res.ok) {
        setMsg('Registrado correctamente, ya podés iniciar sesión.');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Error al registrar');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Registrarse</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password}
        onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrarse</button>
      {msg && <p style={{color:'green'}}>{msg}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
