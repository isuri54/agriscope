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
  const { name, district, type, capacity, allocated } = req.body;

  if (!name || !district || !type || capacity == null) {
    return res.status(400).json({ message: 'Name, district, type, and capacity are required' });
  }

  const capacityNum = parseFloat(capacity);
  if (isNaN(capacityNum) || capacityNum < 0) {
    return res.status(400).json({ message: 'Capacity must be a non-negative number' });
  }

  const allocatedNum = parseFloat(allocated) || 0;
  if (isNaN(allocatedNum) || allocatedNum < 0) {
    return res.status(400).json({ message: 'Allocated must be a non-negative number' });
  }

  try {
    const facility = new StorageFacility({
      name: name.trim(),
      district: district.trim(),
      type,
      capacity: capacityNum,
      allocated: allocatedNum,
      officer: req.officer.id,
    });
    await facility.save();
    res.status(201).json(facility);
  } catch (err) {
    console.error('Add facility error:', err);
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error: ' + err.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update facility (full update or incremental allocation)
router.put('/facilities/:id', auth, async (req, res) => {
  const { name, district, type, capacity, allocated } = req.body;

  try {
    const facility = await StorageFacility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    if (facility.officer.toString() !== req.officer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (name !== undefined) facility.name = name;
    if (district !== undefined) facility.district = district;
    if (type !== undefined) facility.type = type;
    if (capacity !== undefined) facility.capacity = Number(capacity);

    if (allocated !== undefined) {
      // ADD the new allocated value to the existing one
      const newAllocated = facility.allocated + (Number(allocated) || 0);

      // Prevent going over capacity
      if (newAllocated > facility.capacity) {
        return res.status(400).json({ message: 'Allocated amount would exceed capacity' });
      }

      facility.allocated = newAllocated;
    }

    await facility.save();
    res.json(facility);
  } catch (err) {
    console.error('Update facility error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete facility
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

  if (!vehicleId || !district || !capacity || !route) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const capacityNum = parseFloat(capacity);
  if (isNaN(capacityNum) || capacityNum < 0) {
    return res.status(400).json({ message: 'Capacity must be a non-negative number' });
  }

  try {
    const vehicle = new TransportVehicle({
      vehicleId: vehicleId.trim(),
      district: district.trim(),
      capacity: capacityNum,
      route: route.trim(),
      officer: req.officer.id,
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Add vehicle error:', err);
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error: ' + err.message });
    } else if (err.code === 11000) {
      res.status(400).json({ message: 'Vehicle ID already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update vehicle (full update)
router.put('/vehicles/:id', auth, async (req, res) => {
  const { vehicleId, district, capacity, route } = req.body;

  try {
    const vehicle = await TransportVehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.officer.toString() !== req.officer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (vehicleId !== undefined) vehicle.vehicleId = vehicleId;
    if (district !== undefined) vehicle.district = district;
    if (capacity !== undefined) vehicle.capacity = Number(capacity);
    if (route !== undefined) vehicle.route = route;

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vehicle
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