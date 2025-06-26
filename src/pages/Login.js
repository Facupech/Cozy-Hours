import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if(res.ok) {
        login(data.token);
      } else {
        setError(data.message || 'Error en login');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password}
        onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Ingresar</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
