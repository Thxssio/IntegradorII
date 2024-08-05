const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    status: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Status', statusSchema);
