
const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
	phoneNumber: { type: String, required: true },
	code: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', AttemptSchema);