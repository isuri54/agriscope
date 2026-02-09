import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import CalendarEvent from '../models/CalendarEvent.js';

// GET all events for the logged-in officer
router.get('/events', auth, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ officer: req.officer.id })
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Add new event
router.post('/events', auth, async (req, res) => {
  const { date, type, district, description } = req.body;

  if (!date || !type || !district) {
    return res.status(400).json({ message: 'Date, type, and district are required' });
  }

  try {
    const event = new CalendarEvent({
      officer: req.officer.id,
      date: new Date(date),
      type,
      district,
      description: description || '',
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Remove event (only owner)
router.delete('/events/:id', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ownership check
    if (event.officer.toString() !== req.officer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;