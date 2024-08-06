const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/water-monitoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
