import mongoose from 'mongoose';

const plantingScheduleSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  plantingDate: {
    type: Date,
    required: true,
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  area: {
    type: Number,
    required: true,
    min: 0,
  },
  expectedYield: {
    type: Number,
    required: true,
    min: 0,
  },
  officer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PlantingSchedule', plantingScheduleSchema);