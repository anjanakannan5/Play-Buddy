const mongoose = require('mongoose');

const learningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['vocab', 'math', 'story', 'science'], required: true },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  answers: [{ question: String, correct: Boolean }],
}, { timestamps: true });

module.exports = mongoose.model('Learning', learningSchema);
