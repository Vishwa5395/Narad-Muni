// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // <--- Import DB Config
const trackingRoutes = require('./routes/trackingRoutes'); // <--- Import Routes

dotenv.config();

// 1. Connect to Database
connectDB(); 

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Mount Routes
app.use('/api', trackingRoutes); // Now logic lives at /api/track

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});