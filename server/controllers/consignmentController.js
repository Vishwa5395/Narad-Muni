const Consignment = require('../models/Consignment');
const axios = require('axios'); // To talk to ML service

// ADMIN: Create/Scan new Consignment
exports.createConsignment = async (req, res) => {
  try {
    const { consignmentId, senderDetails, recipientDetails, packageDetails } = req.body;
    
    // Initial call to ML service to get initial ETA based on source/dest distance
    const mlResponse = await axios.post('http://localhost:5000/predict', {
      source: senderDetails.pincode,
      destination: recipientDetails.pincode,
      type: packageDetails.type
    });

    const newConsignment = new Consignment({
      consignmentId,
      senderDetails,
      recipientDetails,
      packageDetails,
      estimatedDeliveryDate: mlResponse.data.estimatedDate,
      currentLocation: { 
        // Assuming scan happens at source
        address: senderDetails.address 
      }
    });

    await newConsignment.save();
    res.status(201).json({ success: true, data: newConsignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// USER: Track Consignment
exports.trackConsignment = async (req, res) => {
  try {
    const { id } = req.params;
    const consignment = await Consignment.findOne({ consignmentId: id });

    if (!consignment) {
      return res.status(404).json({ success: false, message: "Invalid Consignment Number" });
    }

    res.status(200).json({ success: true, data: consignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};