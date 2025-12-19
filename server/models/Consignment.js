const mongoose = require('mongoose');

const ConsignmentSchema = new mongoose.Schema({
  consignmentId: { type: String, required: true, unique: true, index: true },
  
  // Static Data (Set at creation)
  senderDetails: {
    name: String,
    address: String,
    pincode: String
  },
  recipientDetails: {
    name: String,
    address: String,
    pincode: String
  },
  packageDetails: {
    weight: Number,
    type: { type: String, enum: ['Speed Post', 'Normal Post'], default: 'Normal Post' },
    isFragile: Boolean
  },

  // Dynamic Tracking Data
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    timestamp: { type: Date, default: Date.now }
  },
  status: { type: String, enum: ['In Transit', 'Out for Delivery', 'Delivered', 'Delayed'], default: 'In Transit' },
  
  // Route & History (For Map Polyline)
  locationHistory: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date,
    status: String
  }],

  // ML Predictions
  estimatedDeliveryDate: Date,
  predictedDelay: { type: Number, default: 0 }, // in hours
  weatherCondition: String, // e.g., "Rainy", "Clear"
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consignment', ConsignmentSchema);