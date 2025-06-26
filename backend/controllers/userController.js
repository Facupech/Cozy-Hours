exports.register = (req, res) => {
  res.send('Registrado');
};

exports.login = (req, res) => {
  res.send('Logueado');
};

exports.getEstado = (req, res) => {
  res.send({ estado: 'feliz' });
};

exports.setEstado = (req, res) => {
  res.send({ mensaje: 'estado actualizado' });
};
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../middleware/auth');

// 👉 DECLARAR todas las funciones primero:

const register = (req, res) => {
  const { email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);

  db.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, hashed], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: 'Usuario registrado correctamente' });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).send({ message: 'Usuario no encontrado' });

    const user = results[0];
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).send({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });
    res.send({ token });
  });
};

const getEstado = (req, res) => {
  db.query('SELECT estado_emocional FROM usuarios WHERE id = ?', [req.userId], (err, results) => {
    if (err) return res.status(400).send(err);
    res.send(results[0]);
  });
};

const setEstado = (req, res) => {
  const { estado } = req.body;
  db.query('UPDATE usuarios SET estado_emocional = ? WHERE id = ?', [estado, req.userId], (err) => {
    if (err) return res.status(400).send(err);
    res.send({ message: 'Estado emocional actualizado' });
  });
};

// 👉 Exportar todas las funciones después de declararlas
module.exports = {
  register,
  login,
  getEstado,
  setEstado
};

