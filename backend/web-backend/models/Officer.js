import mongoose from 'mongoose';

const officerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'officer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Officer = mongoose.model('Officer', officerSchema);
export default Officer;