
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({  
  username: { type: String, required: false, unique: true, sparse: true },
  phoneNumber: { type: String, required: true, unique: true },
  score: { type: Number, default: 0, required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);