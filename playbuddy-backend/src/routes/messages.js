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

// GET /api/messages/unread-count - get total unread messages
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

// PUT /api/messages/mark-read/:userId - mark messages from a user as read
router.put('/mark-read/:userId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking messages as read' });
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
