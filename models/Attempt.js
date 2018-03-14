
const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
	phoneNumber: { type: String, required: true },
	code: { type: String, required: true },
	success: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', AttemptSchema);