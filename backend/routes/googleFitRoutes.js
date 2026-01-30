const express = require('express');
const router = express.Router();
const { authGoogleFit, googleFitCallback, connectGoogleFit, syncData, getStoredData } = require('../controllers/googleFitController');
const { protect } = require('../middleware/authMiddleware');

router.get('/auth', protect, authGoogleFit);
router.post('/connect', protect, connectGoogleFit); // New step to finish connection with User ID
router.get('/callback', googleFitCallback); // Public callback
router.post('/sync', protect, syncData);
router.get('/data', protect, getStoredData);

module.exports = router;
