const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ← Cambialo si tenés contraseña en XAMPP
  database: 'escritorio_emocional',
});

module.exports = db;