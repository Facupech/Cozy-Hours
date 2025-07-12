const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../middleware/auth');

// REGISTRO
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    await db.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuario = rows[0];
    const isValid = bcrypt.compareSync(password, usuario.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Token de prueba
    res.json({
      token: 'token-fake',
      user: {
        id: usuario.id,
        email: usuario.email,
        estado_emocional: usuario.estado_emocional
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET ESTADO EMOCIONAL
const getEstado = (req, res) => {
  db.query('SELECT estado_emocional FROM usuarios WHERE id = ?', [req.userId], (err, results) => {
    if (err) return res.status(400).send(err);
    res.send(results[0]);
  });
};

// SET ESTADO EMOCIONAL
const setEstado = (req, res) => {
  const { estado } = req.body;
  db.query('UPDATE usuarios SET estado_emocional = ? WHERE id = ?', [estado, req.userId], (err) => {
    if (err) return res.status(400).send(err);
    res.send({ message: 'Estado emocional actualizado' });
  });
};

// EXPORTACIÓN
module.exports = {
  register,
  login,
  getEstado,
  setEstado
};
