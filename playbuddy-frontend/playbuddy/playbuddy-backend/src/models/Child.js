const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  age: { type: String, required: true },
  grade: { type: String, default: '' },
  avatar: { type: String, default: '🦊' },
  interests: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);
