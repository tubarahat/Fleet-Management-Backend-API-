// index.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
require('dotenv').config();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// index.js (Update)
const vehicleRoutes = require('./routes/vehicle.routes');
app.use('/api/vehicles', vehicleRoutes);


const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Module Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/vehicles', require('./routes/vehicle.routes'));
app.use('/api/trips', require('./routes/trip.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Fleet API running on port ${PORT}`));


const express = require('express');
const app = express();
const logger = require('./middlewares/logger.middleware');
const vehicleLimiter = require('./middlewares/rateLimiter.middleware');

app.use(express.json());
app.use(logger); // Apply Logger globally

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.post('/api/vehicles/add', vehicleLimiter, require('./controllers/vehicle.controller').addVehicle); // Limiter applied here
app.use('/api/trips', require('./routes/trip.routes'));
app.get('/analytics', require('./controllers/analytics.controller').getAnalytics);

// Handling Undefined Route Middleware
app.use((req, res) => {
    res.status(404).json({ message: "This Request Is Not Found" });
});

app.listen(3000, () => console.log("System Online"));
