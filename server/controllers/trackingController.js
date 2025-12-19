const Parcel = require('../models/Parcel');
const { spawn } = require('child_process');
const path = require('path');

// 1. ADMIN: Register a new Parcel
const createParcel = async (req, res) => {
    try {
        const newParcel = await Parcel.create(req.body);
        res.status(201).json({ success: true, data: newParcel });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. USER: Track Parcel + Get AI Prediction
const trackParcel = async (req, res) => {
    const { trackingId } = req.body;

    try {
        const parcel = await Parcel.findOne({ trackingId });

        if (!parcel) {
            return res.status(404).json({ success: false, message: "Parcel not found" });
        }

        // --- THE AI INTEGRATION ---
        // We run the Python script dynamically based on the parcel's data
        // Inputs: Weather(Mocked=1), Traffic(Mocked=2), Distance(Mocked=500), Type(0=Normal, 1=Speed)
        
        const scriptPath = path.join(__dirname, '../ml_model/predict.py');
        const postTypeMap = { 'Normal': 0, 'Speed Post': 1, 'Prime': 2 };
        const typeCode = postTypeMap[parcel.postType] || 0;

        const pythonProcess = spawn('python', [scriptPath, 1, 2, 500, typeCode]);

        let predictionData = '';

        pythonProcess.stdout.on('data', (data) => {
            predictionData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            const predictedHours = parseFloat(predictionData) || 24; // Default if script fails
            
            // Return Parcel Data + AI Prediction
            res.status(200).json({
                success: true,
                data: {
                    ...parcel._doc,
                    predictedDelay: predictedHours,
                    aiInsight: predictedHours > 10 
                        ? `Heavy rain detected. Est. delay: ${predictedHours} hrs.` 
                        : "Route clear. On time."
                }
            });
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createParcel, trackParcel };