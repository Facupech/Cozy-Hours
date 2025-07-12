const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json());

const escritorioRoutes = require('./routes/escritorioRoutes');
app.use('/api/escritorios', escritorioRoutes);

app.use('/api/users', require('./routes/user'));
app.get('/', (req, res) => {
  res.send('✅ Backend de Escritorio Emocional funcionando.');
});

app.listen(3001, () => console.log('Backend corriendo en http://localhost:3001'));
