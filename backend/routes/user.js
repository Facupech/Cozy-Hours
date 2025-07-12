const express = require('express');
const router = express.Router(); // ✅ CORRECTO

const userController = require('../controllers/userController');
const verifyToken  = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/estado', async (req, res) => {
    res.json({ estado_emocional: 'cachondo' });
  const email = req.query.email;
  const [rows] = await db.query('SELECT estado_emocional FROM usuarios WHERE email = ?', [email]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json({ estado_emocional: rows[0].estado_emocional });
});

router.post('/login', userController.login);


module.exports = router;

