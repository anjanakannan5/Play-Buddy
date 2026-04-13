const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// GET /api/events - get all events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'name avatar').sort('-createdAt');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// POST /api/events - create an event
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, type, emoji, date, time, location, ageMin, ageMax, price } = req.body;
    if (!title || !date)
      return res.status(400).json({ message: 'Title and date are required' });
    const event = await Event.create({
      creator: req.user._id,
      title, description, type, emoji, date, time, location, ageMin, ageMax, price,
    });
    const populated = await event.populate('creator', 'name avatar');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// POST /api/events/:id/rsvp - toggle RSVP
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id.toString();
    const idx = event.rsvps.findIndex(id => id.toString() === userId);
    if (idx === -1) {
      event.rsvps.push(req.user._id);
    } else {
      event.rsvps.splice(idx, 1);
    }
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error updating RSVP' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, creator: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found or not authorized' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

module.exports = router;
