
const mongoose = require('mongoose');

const createDate = (hours = 0) => {
	var date = new Date();
	date.setHours(date.getHours() + hours);
	return date;
}

const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  createdAt: { type: Date, required: true, default: createDate() },
  activatesAt: { type: Date, required: true, default: createDate() },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Code', CodeSchema);