// controllers/trip.controller.js
const supabase = require('../config/supabase');

// POST /trips/create/
const createTrip = async (req, res) => {
    const { customer_id, vehicle_id, start_date, end_date, location, distance_km, passengers } = req.body;

    try {
        // 1. Fetch vehicle details for validation
        const { data: vehicle, error: vError } = await supabase
            .from('vehicles')
            .select('isAvailable, allowed_passengers, rate_per_km')
            .eq('id', vehicle_id)
            .single();

        if (vError || !vehicle) return res.status(404).json({ error: "Vehicle not found" });

        // Edge Case 1: Check availability
        if (!vehicle.isAvailable) return res.status(400).json({ error: "Selected vehicle is not available" });

        // Edge Case 2: Check passenger capacity
        if (passengers > vehicle.allowed_passengers) {
            return res.status(400).json({ error: `Vehicle capacity exceeded. Max: ${vehicle.allowed_passengers}` });
        }

        // Calculate trip cost based on distance and vehicle rate
        const tripCost = distance_km * vehicle.rate_per_km;

        // 2. Create the Trip
        const { data: trip, error: tError } = await supabase
            .from('trips')
            .insert([{ customer_id, vehicle_id, start_date, end_date, location, distance_km, passengers, tripCost }])
            .select();

        if (tError) throw tError;

        // Edge Case 3: Set vehicle isAvailable to false
        await supabase.from('vehicles').update({ isAvailable: false }).eq('id', vehicle_id);

        res.status(201).json({ message: "Trip created successfully", trip: trip[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /trips/:tripId
const getTrip = async (req, res) => {
    const { data, error } = await supabase.from('trips').select('*, vehicles(*)').eq('id', req.params.tripId).single();
    if (error) return res.status(404).json({ error: "Trip not found" });
    res.status(200).json(data);
};

// PATCH /trips/update/:tripId
const updateTrip = async (req, res) => {
    const { data, error } = await supabase.from('trips').update(req.body).eq('id', req.params.tripId).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data[0]);
};

// DELETE /trips/delete/:tripId
const deleteTrip = async (req, res) => {
    const { error } = await supabase.from('trips').delete().eq('id', req.params.tripId);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Trip deleted successfully" });
};

module.exports = { createTrip, getTrip, updateTrip, deleteTrip };

