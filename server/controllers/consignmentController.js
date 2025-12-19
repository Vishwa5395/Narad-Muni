const Consignment = require('../models/Consignment');
const axios = require('axios'); // To talk to ML service

// ADMIN: Create/Scan new Consignment
exports.createConsignment = async (req, res) => {
  try {
    const { consignmentId, senderDetails, recipientDetails, packageDetails } = req.body;
    
    // Initial call to ML service to get initial ETA based on source/dest distance
    // const mlResponse = await axios.post('http://localhost:5000/predict', {
    //   source: senderDetails.pincode,
    //   destination: recipientDetails.pincode,
    //   type: packageDetails.type
    // });

    

    // const newConsignment = new Consignment({
    //   consignmentId,
    //   senderDetails,
    //   recipientDetails,
    //   packageDetails,
    //   estimatedDeliveryDate: mlResponse.data.estimatedDate,
    //   currentLocation: { 
    //     // Assuming scan happens at source
    //     address: senderDetails.address 
    //   }
    // });

    const newConsignment = new Consignment({
      consignmentId,
      senderDetails,
      recipientDetails,
      packageDetails,
      estimatedDeliveryDate: mockEstimatedDate, // Using mock date
      currentLocation: { 
        latitude: 28.6139, // Default: New Delhi
        longitude: 77.2090, 
        address: senderDetails.address || "Source Location"
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

// ... existing imports and functions ...

// NEW: Handle Barcode Scan Event (Admin Side)
exports.handleBarcodeScan = async (req, res) => {
  try {
    const { barcode, scanLocation } = req.body;

    // 1. Check if Consignment exists
    const consignment = await Consignment.findOne({ consignmentId: barcode });

    // Scenario A: New Package (Not in DB)
    if (!consignment) {
      return res.status(200).json({ 
        success: true, 
        found: false, 
        message: "Consignment not found. Please register." 
      });
    }

    // Scenario B: Existing Package (Update Location)
    // Add old location to history
    consignment.locationHistory.push({
      latitude: consignment.currentLocation.latitude,
      longitude: consignment.currentLocation.longitude,
      status: consignment.status,
      timestamp: new Date()
    });

    // Update to new location (Simulating a scan at a new Hub)
    consignment.currentLocation = {
      latitude: scanLocation?.latitude || consignment.currentLocation.latitude,
      longitude: scanLocation?.longitude || consignment.currentLocation.longitude,
      address: scanLocation?.address || "Scanned at Transit Hub",
      timestamp: new Date()
    };
    
    consignment.status = "In Transit"; // Update status
    
    await consignment.save();

    return res.status(200).json({ 
      success: true, 
      found: true, 
      data: consignment,
      message: "Location updated successfully." 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};