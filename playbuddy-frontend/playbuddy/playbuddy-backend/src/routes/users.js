const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/profile - get own profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile - update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, location, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
