const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); // Importar o modelo de usuário

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/water-monitoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    createAdminUser(); // Criar o usuário admin ao iniciar o servidor
}).catch((error) => {
    console.error('Connection error', error.message);
});

const waterSchema = new mongoose.Schema({
    level: Number,
    power: Number,
    voltage: Number,
    current: Number,
    status: { type: String, default: 'desligado' }
});

const Water = mongoose.model('Water', waterSchema);

app.get('/api/data', async (req, res) => {
    try {
        const data = await Water.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/data', async (req, res) => {
    const data = new Water(req.body);
    try {
        const savedData = await data.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/data/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const data = await Water.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota para registrar um novo usuário
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota para autenticar o usuário
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Função para criar o usuário admin
const createAdminUser = async () => {
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        const newAdmin = new User({ username: 'admin', password: hashedPassword });
        await newAdmin.save();
        console.log('Admin user created');
    }
};

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
