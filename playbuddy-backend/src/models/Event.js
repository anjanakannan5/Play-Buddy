const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['Art', 'Sports', 'Music', 'Games', 'Education', 'Other'], default: 'Other' },
  emoji: { type: String, default: '🎉' },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  location: { type: String, default: '' },
  ageMin: { type: Number, default: 2 },
  ageMax: { type: Number, default: 12 },
  price: { type: String, default: 'FREE' },
  rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
