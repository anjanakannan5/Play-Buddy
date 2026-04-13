const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  rounds: { type: Number, default: 0 },
  history: [{ word: String, correct: Boolean, date: Date }],
}, { timestamps: true });

module.exports = mongoose.model('Voice', voiceSchema);
