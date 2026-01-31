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
