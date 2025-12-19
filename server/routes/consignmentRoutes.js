// server/routes/consignmentRoutes.js
const express = require('express');
const router = express.Router();
const consignmentController = require('../controllers/consignmentController');

// Route: POST /api/consignment/create
// Description: Admin scans/creates a new consignment
router.post('/create', consignmentController.createConsignment);

// Route: GET /api/consignment/track/:id
// Description: User tracks a parcel by ID
router.get('/track/:id', consignmentController.trackConsignment);

module.exports = router;