const express = require('express');
const router = express.Router();
const { trackParcel, createParcel } = require('../controllers/trackingController');

router.post('/track', trackParcel); // User searches
router.post('/create', createParcel); // Admin creates

module.exports = router;