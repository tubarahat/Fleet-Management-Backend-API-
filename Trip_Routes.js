// routes/trip.routes.js
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

// Note: You should apply a 'isCustomer' middleware here similar to 'isOwner'
router.post('/create', tripController.createTrip);
router.get('/:tripId', tripController.getTrip);
router.patch('/update/:tripId', tripController.updateTrip);
router.delete('/delete/:tripId', tripController.deleteTrip);

module.exports = router;
