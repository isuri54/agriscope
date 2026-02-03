import mongoose from 'mongoose';

const lossReportSchema = new mongoose.Schema({
  officer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  crop: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Weather', 'Pest', 'Excess', 'Disease', 'Other'],
  },
  cause: {
    type: String,
    required: true,
    trim: true,
  },
  quantityLost: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('LossReport', lossReportSchema);