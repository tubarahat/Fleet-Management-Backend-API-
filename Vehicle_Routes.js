// routes/vehicle.routes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { isOwner } = require('../middlewares/auth.middleware');

router.post('/add', isOwner, vehicleController.addVehicle);
router.patch('/assign-driver/:vehicleId', isOwner, vehicleController.assignDriver);
router.get('/:vehicleId', vehicleController.getVehicleById);

module.exports = router;
