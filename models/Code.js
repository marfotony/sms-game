
const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  activatesAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Code', CodeSchema);