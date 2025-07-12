import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState('relaxed');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, estado_emocional: estado }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000); // redirige al login
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  return (
    <form className="register-container" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password}
        onChange={(e) => setPassword(e.target.value)} required />

      <select value={estado} onChange={(e) => setEstado(e.target.value)} required>
        <option value="relaxed">Relajado</option>
        <option value="happy">Feliz</option>
        <option value="sad">Triste</option>
        <option value="focused">Concentrado</option>
        <option value="tired">Cansado</option>
        <option value="stressed">Estresado</option>
      </select>

      <button type="submit">Registrarse</button>

      {success && <p className="success">✅ Cuenta creada. Redirigiendo...</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
