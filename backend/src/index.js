require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { InfluxDB } = require('@influxdata/influxdb-client');
const User = require('./models/userModel');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuração do InfluxDB
const influxToken = process.env.INFLUXDB_TOKEN;
const influxOrg = process.env.INFLUXDB_ORG;
const influxBucket = process.env.INFLUXDB_BUCKET;
const influxURL = process.env.INFLUXDB_URL;

const influxDB = new InfluxDB({ url: influxURL, token: influxToken });
const queryApi = influxDB.getQueryApi(influxOrg);


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    createAdminUser(); // Criar o usuário admin ao iniciar o servidor
}).catch((error) => {
    console.error('Connection error', error.message);
});


// Rota para obter dados do InfluxDB
app.get('/api/influx-data', async (req, res) => {
    const fluxQuery = `from(bucket: "${influxBucket}")
                        |> range(start: -1h)
                        |> filter(fn: (r) => r._measurement == "water_data")
                        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
                        |> sort(columns: ["_time"], desc: true)`;

    try {
        let data = [];
        await queryApi.queryRows(fluxQuery, {
            next: (row, tableMeta) => {
                const rowData = tableMeta.toObject(row);
                data.push({
                    time: rowData._time,
                    level: rowData.level || null,
                    power: rowData.power || null,
                    voltage: rowData.voltage || null,
                    current: rowData.current || null,
                });
            },
            error: (error) => {
                console.error('Error querying InfluxDB:', error);
                res.status(500).json({ message: 'Error querying InfluxDB' });
            },
            complete: () => {
                res.json(data);
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
