const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/messages/contacts - get all users (potential contacts)
router.get('/contacts', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name avatar email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// GET /api/messages/:userId - get conversation with a user
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// POST /api/messages - send a message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text)
      return res.status(400).json({ message: 'Receiver and text are required' });
    const message = await Message.create({ sender: req.user._id, receiver: receiverId, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
