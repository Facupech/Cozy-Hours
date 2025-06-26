const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // usuario de XAMPP
  password: '',           // sin contraseña por defecto
  database: 'escritorio_emocional'
});

db.connect((err) => {
  if (err) throw err;
  console.log('🟢 Conectado a MySQL');
});

module.exports = db;
