const express = require('express');
const router = express.Router();
const controlador = require('../controllers/escritorioController');
const pool = require('../db'); // 👈 IMPORTANTE: esto te falta

router.post('/', async (req, res) => {
  const { usuario_id, nombre, estado_emocional } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO escritorios (usuario_id, nombre, estado_emocional) VALUES (?, ?, ?)',
      [usuario_id, nombre, estado_emocional]
    );

    const id = result.insertId;

    // ✅ Esto es lo más importante:
    res.status(201).json({ id, usuario_id, nombre, estado_emocional });

  } catch (err) {
    console.error('❌ Error al crear escritorio:', err);
    res.status(500).json({ message: 'Error al crear escritorio' });
  }
});
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('📥 ID recibido para búsqueda:', userId); // 👈 DEBUG

  try {
    const [rows] = await pool.query('SELECT * FROM escritorios WHERE usuario_id = ?', [userId]);
    console.log('📤 Escritorios encontrados:', rows);   // 👈 DEBUG
    res.json(rows);
  } catch (error) {
    console.error('❌ ERROR EN CONSULTA:', error);       // 👈 LOG DETALLADO
    res.status(500).json({ message: 'Error al obtener escritorios' });
  }
});


module.exports = router;
