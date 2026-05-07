import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import PlantingSchedule from '../models/PlantingSchedule.js';

// @route   GET /api/harvest/schedules
// @desc    Get all schedules for the logged-in officer
router.get('/schedules', auth, async (req, res) => {
  try {
    const schedules = await PlantingSchedule.find({ officer: req.officer.id })
      .sort({ plantingDate: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/harvest/schedules
// @desc    Add new planting schedule
router.post('/schedules', auth, async (req, res) => {
  const { crop, district, plantingDate, harvestDate, area, expectedHarvest } = req.body;

  try {
    const newSchedule = new PlantingSchedule({
      crop,
      district,
      plantingDate,
      harvestDate,
      area,
      expectedHarvest,
      officer: req.officer.id,
    });

    const schedule = await newSchedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/harvest/schedules/:id
// @desc    Update schedule
router.put('/schedules/:id', auth, async (req, res) => {
  try {
    const schedule = await PlantingSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.officer.toString() !== req.officer.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await PlantingSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/harvest/schedules/:id
// @desc    Delete a schedule (only owner can delete)
router.delete('/schedules/:id', auth, async (req, res) => {
  try {
    const schedule = await PlantingSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check ownership
    if (schedule.officer.toString() !== req.officer.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;