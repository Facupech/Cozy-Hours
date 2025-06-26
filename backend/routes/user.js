const express = require('express');
const router = express.Router(); // ✅ CORRECTO

const userController = require('../controllers/userController');
const verifyToken  = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Acá podrías generar un token JWT si querés
    res.json({ token: 'token-fake', estado_emocional: usuario.estado_emocional });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno' });
  }
});

router.get('/estado', async (req, res) => {
    res.json({ estado_emocional: 'cachondo' });
  const email = req.query.email;
  const [rows] = await db.query('SELECT estado_emocional FROM usuarios WHERE email = ?', [email]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json({ estado_emocional: rows[0].estado_emocional });
});

router.post('/estado', verifyToken, userController.setEstado);

module.exports = router;

