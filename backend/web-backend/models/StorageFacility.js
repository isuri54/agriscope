import mongoose from 'mongoose';

const storageFacilitySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  district: { 
    type: String, 
    required: true, 
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['Dry Storage', 'Cold Storage'], 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true, 
    min: 0 
  },          // in tons
  allocated: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  officer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Officer', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model('StorageFacility', storageFacilitySchema);