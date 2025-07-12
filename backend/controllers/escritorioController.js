const db = require('../db');

exports.crearEscritorio = (req, res) => {
  const { usuario_id, nombre, estado_emocional } = req.body;

  if (!usuario_id || !nombre || !estado_emocional) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  db.query(
    'INSERT INTO escritorios (usuario_id, nombre, estado_emocional) VALUES (?, ?, ?)',
    [usuario_id, nombre, estado_emocional],
    (err, result) => {
      if (err) {
        console.error('Error al insertar:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      // ESTA LÍNEA ES CLAVE
      return res.json({ message: 'Escritorio creado', id: result.insertId });
    }
  );
  console.log('Datos recibidos en POST /escritorios:', req.body);

};


exports.obtenerEscritorios = (req, res) => {
  const { usuario_id } = req.params;
  db.query(
    'SELECT * FROM escritorios WHERE usuario_id = ?',
    [usuario_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
};
