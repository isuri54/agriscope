import mongoose from 'mongoose';

const transportVehicleSchema = new mongoose.Schema({
  vehicleId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  district: { 
    type: String, 
    required: true, 
    trim: true 
  },
  capacity: { 
    type: Number, 
    required: true, 
    min: 0 
  },           // in tons
  route: { 
    type: String, 
    required: true, 
    trim: true 
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

export default mongoose.model('TransportVehicle', transportVehicleSchema);