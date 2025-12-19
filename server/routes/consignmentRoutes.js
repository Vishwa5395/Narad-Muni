const express = require('express');
const router = express.Router();
const consignmentController = require('../controllers/consignmentController');

// Existing Routes
router.post('/create', consignmentController.createConsignment);
router.get('/track/:id', consignmentController.trackConsignment);

// NEW: Scan Route
// URL will be: http://localhost:4000/api/consignment/scan
router.post('/scan', consignmentController.handleBarcodeScan);

module.exports = router;