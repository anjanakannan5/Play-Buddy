const express = require('express');
const router = express.Router();
const Voice = require('../models/Voice');
const { protect } = require('../middleware/auth');

// GET /api/voice/score - get user's voice game score
router.get('/score', protect, async (req, res) => {
  try {
    let record = await Voice.findOne({ user: req.user._id });
    if (!record) record = { score: 0, rounds: 0, history: [] };
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching score' });
  }
});

// POST /api/voice/submit - submit a voice game result
router.post('/submit', protect, async (req, res) => {
  try {
    const { word, correct } = req.body;
    let record = await Voice.findOne({ user: req.user._id });
    if (!record) {
      record = new Voice({ user: req.user._id, score: 0, rounds: 0, history: [] });
    }
    record.rounds += 1;
    if (correct) record.score += 10;
    record.history.push({ word, correct, date: new Date() });
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error saving voice result' });
  }
});

module.exports = router;
