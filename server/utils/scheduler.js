const cron = require('node-cron');
const Consignment = require('../models/Consignment');
const axios = require('axios');

const initScheduler = () => {
  // Run every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('Running 12-hour ML update cycle...');
    
    // 1. Get all active consignments
    const activeConsignments = await Consignment.find({ status: { $ne: 'Delivered' } });

    // 2. Loop through and update
    for (let item of activeConsignments) {
      try {
        // Call Python ML Service
        const prediction = await axios.post('http://localhost:5000/update-prediction', {
          currentLat: item.currentLocation.latitude,
          currentLong: item.currentLocation.longitude,
          destPincode: item.recipientDetails.pincode
        });

        // Update DB
        item.estimatedDeliveryDate = prediction.data.newDate;
        item.weatherCondition = prediction.data.weather;
        item.predictedDelay = prediction.data.delayHours;
        
        await item.save();
      } catch (err) {
        console.error(`Failed to update ${item.consignmentId}`, err);
      }
    }
  });
};

module.exports = initScheduler;