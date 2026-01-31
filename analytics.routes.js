const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/', analyticsController.getSystemAnalytics); // GET /analytics

module.exports = router;

