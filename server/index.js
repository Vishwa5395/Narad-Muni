// server/index.js
require('dotenv').config(); // Load environment variables first
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import internal modules
const consignmentRoutes = require('./routes/consignmentRoutes');
const initScheduler = require('./utils/scheduler'); // The Cron job we discussed

const app = express();

// --- Middlewares ---
app.use(cors()); // Allow frontend (React) to talk to backend
app.use(express.json()); // Parse incoming JSON payloads

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// --- Routes ---
// All consignment related endpoints will start with /api/consignment
app.use('/api/consignment', consignmentRoutes);

// Health Check Route (Good for testing if server is running)
app.get('/', (req, res) => {
  res.send('Logistics Backend is Running...');
});

// --- Initialize Background Jobs ---
// Starts the 12-hour cycle to check ML delays
initScheduler(); 

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});