require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = process.env.SECRET_KEY;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/waterMonitoring')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Modelos
const Status = require('./models/Status');
const User = require('./models/User');

// Rotas
const statusRoutes = require('./routes/status');
const authRoutes = require('./routes/auth');
app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
