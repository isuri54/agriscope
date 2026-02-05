import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import StorageFacility from '../models/StorageFacility.js';
import TransportVehicle from '../models/TransportVehicle.js';

// Get all facilities for the logged-in officer
router.get('/facilities', auth, async (req, res) => {
  try {
    const facilities = await StorageFacility.find({ officer: req.officer.id })
      .sort({ createdAt: -1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new facility
router.post('/facilities', auth, async (req, res) => {
  const { name, district, type, capacity } = req.body;
  try {
    const facility = new StorageFacility({
      name, district, type, capacity,
      officer: req.officer.id,
    });
    await facility.save();
    res.status(201).json(facility);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete facility (only owner)
router.delete('/facilities/:id', auth, async (req, res) => {
  try {
    const facility = await StorageFacility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Not found' });
    if (facility.officer.toString() !== req.officer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await facility.deleteOne();
    res.json({ message: 'Facility removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all vehicles for the logged-in officer
router.get('/vehicles', auth, async (req, res) => {
  try {
    const vehicles = await TransportVehicle.find({ officer: req.officer.id })
      .sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new vehicle
router.post('/vehicles', auth, async (req, res) => {
  const { vehicleId, district, capacity, route } = req.body;
  try {
    const vehicle = new TransportVehicle({
      vehicleId, district, capacity, route,
      officer: req.officer.id,
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vehicle (only owner)
router.delete('/vehicles/:id', auth, async (req, res) => {
  try {
    const vehicle = await TransportVehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Not found' });
    if (vehicle.officer.toString() !== req.officer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;