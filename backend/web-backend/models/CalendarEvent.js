import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  officer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Festival', 'Weather', 'Government Program', 'Other'],
  },
  district: {
    type: String,
    required: true,
    trim: true,
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

export default mongoose.model('CalendarEvent', calendarEventSchema);