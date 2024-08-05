const express = require('express');
const router = express.Router();
const Status = require('../models/Status');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acesso negado' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const statuses = await Status.find().sort({ timestamp: -1 });
        res.json(statuses);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const newStatus = new Status({
        status: req.body.status
    });

    try {
        const savedStatus = await newStatus.save();
        res.json(savedStatus);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
