const mongoose = require('mongoose');

const ParcelSchema = new mongoose.Schema({
  // 1. Identification
  trackingId: { type: String, required: true, unique: true }, // The Barcode ID
  
  // 2. Package Details (Input by Admin)
  senderName: String,
  recipientName: String,
  weight: Number, // in kg
  isFragile: Boolean,
  postType: { 
    type: String, 
    enum: ['Normal', 'Speed Post', 'Prime'], 
    default: 'Normal' 
  },
  
  // 3. Location Data
  sourcePincode: { type: String, required: true },
  destPincode: { type: String, required: true },
  currentLocation: { type: String, default: "Sorting Hub" },
  
  // 4. Coordinates (For the Map)
  // We will fetch these from the Pincode later
  sourceCoordinates: { 
    lat: Number, 
    lng: Number 
  },
  destCoordinates: { 
    lat: Number, 
    lng: Number 
  },

  // 5. The "Smart" Data (From ML Model)
  predictedDelivery: Date,
  delayRisk: { type: String, default: "Low" }, // "Low", "High"
  
  // 6. Status
  status: { 
    type: String, 
    enum: ['Booked', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'],
    default: 'Booked' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Parcel', ParcelSchema);