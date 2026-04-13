const express = require('express');
const router = express.Router();
const Child = require('../models/Child');
const { protect } = require('../middleware/auth');

// GET /api/children - get all children for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const children = await Child.find({ parent: req.user._id });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching children' });
  }
});

// POST /api/children - add a child
router.post('/', protect, async (req, res) => {
  try {
    const { name, age, grade, avatar, interests } = req.body;
    if (!name || !age)
      return res.status(400).json({ message: 'Name and age are required' });
    const child = await Child.create({ parent: req.user._id, name, age, grade, avatar, interests });
    res.status(201).json(child);
  } catch (err) {
    res.status(500).json({ message: 'Error adding child' });
  }
});

// PUT /api/children/:id - update a child
router.put('/:id', protect, async (req, res) => {
  try {
    const child = await Child.findOneAndUpdate(
      { _id: req.params.id, parent: req.user._id },
      req.body,
      { new: true }
    );
    if (!child) return res.status(404).json({ message: 'Child not found' });
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: 'Error updating child' });
  }
});

// DELETE /api/children/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const child = await Child.findOneAndDelete({ _id: req.params.id, parent: req.user._id });
    if (!child) return res.status(404).json({ message: 'Child not found' });
    res.json({ message: 'Child removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting child' });
  }
});

module.exports = router;
