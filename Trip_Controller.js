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

const supabase = require('../config/supabase');

// POST /trips/create/
const createTrip = async (req, res) => {
    const { customer_id, vehicle_id, start_date, end_date, location, distance_km, passengers } = req.body;

    try {
        // Requirement: Fetch vehicle to check availability and capacity
        const { data: vehicle, error: vError } = await supabase
            .from('vehicles')
            .select('isAvailable, allowed_passengers')
            .eq('id', vehicle_id)
            .single();

        if (vError || !vehicle) return res.status(404).json({ error: "Vehicle not found" });

        // Edge Case 1: Selected vehicle must be available
        if (!vehicle.isAvailable) return res.status(400).json({ error: "Vehicle is currently unavailable" });

        // Edge Case 2: Passengers must not exceed vehicle's allowed_passengers
        if (passengers > vehicle.allowed_passengers) {
            return res.status(400).json({ error: `Capacity exceeded. Max: ${vehicle.allowed_passengers}` });
        }

        // Create the trip
        const { data: trip, error: tError } = await supabase
            .from('trips')
            .insert([{ customer_id, vehicle_id, start_date, end_date, location, distance_km, passengers }])
            .select();

        if (tError) throw tError;

        // Edge Case 3: vehicle isAvailable must become false
        await supabase.from('vehicles').update({ isAvailable: false }).eq('id', vehicle_id);

        res.status(201).json(trip[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH /trips/end/:tripId
const endTrip = async (req, res) => {
    const { tripId } = req.params;

    try {
        // 1. Get trip and vehicle rate
        const { data: trip, error: tError } = await supabase
            .from('trips')
            .select('*, vehicles(rate_per_km)')
            .eq('id', tripId)
            .single();

        if (tError || !trip) return res.status(404).json({ error: "Trip not found" });

        // 2. Calculate tripCost: distance_km * rate_per_km
        const finalCost = trip.distance_km * trip.vehicles.rate_per_km;

        // 3. Update trip: isCompleted -> true, store tripCost
        const { error: updateError } = await supabase
            .from('trips')
            .update({ isCompleted: true, tripCost: finalCost })
            .eq('id', tripId);


        

        if (updateError) throw updateError;

        // 4. Update vehicle: isAvailable -> true
        await supabase.from('vehicles').update({ isAvailable: true }).eq('id', trip.vehicle_id);

        res.status(200).json({ message: "Trip ended successfully", tripCost: finalCost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Standard CRUD Operations
const getTripById = async (req, res) => {
    const { data, error } = await supabase.from('trips').select('*, vehicles(*)').eq('id', req.params.tripId).single();
    if (error) return res.status(404).json({ error: "Trip not found" });
    res.status(200).json(data);
};

const updateTrip = async (req, res) => {
    const { data, error } = await supabase.from('trips').update(req.body).eq('id', req.params.tripId).select();
    res.status(200).json(data[0]);
};

const deleteTrip = async (req, res) => {
    await supabase.from('trips').delete().eq('id', req.params.tripId);
    res.status(200).json({ message: "Trip deleted" });
};

module.exports = { createTrip, endTrip, getTripById, updateTrip, deleteTrip };

const endTrip = async (req, res) => {
    const { tripId } = req.params;

    try {
        // 1. Fetch trip and the rate of the associated vehicle
        const { data: trip, error: tError } = await supabase
            .from('trips')
            .select('distance_km, vehicle_id, vehicles(rate_per_km)')
            .eq('id', tripId)
            .single();

        if (tError || !trip) return res.status(404).json({ error: "Trip not found" });

        // 2. Calculate tripCost
        const calculatedCost = trip.distance_km * trip.vehicles.rate_per_km;

        // 3. Update trip: isCompleted -> true and store cost
        const { error: updateError } = await supabase
            .from('trips')
            .update({ isCompleted: true, tripCost: calculatedCost })
            .eq('id', tripId);

        if (updateError) throw updateError;

        // 4. Set vehicle isAvailable back to true
        await supabase
            .from('vehicles')
            .update({ isAvailable: true })
            .eq('id', trip.vehicle_id);

        res.status(200).json({ 
            message: "Trip ended successfully", 
            tripCost: calculatedCost 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const endTrip = async (req, res) => {
    const { tripId } = req.params;

    try {
        const { data: trip, error: tError } = await supabase
            .from('trips')
            .select('distance_km, vehicle_id, vehicles(rate_per_km)')
            .eq('id', tripId)
            .single();

        if (tError || !trip) return res.status(404).json({ error: "Trip not found" });

        const calculatedCost = trip.distance_km * trip.vehicles.rate_per_km;

        // Requirement: isCompleted -> true, calculate tripCost
        await supabase.from('trips').update({ 
            isCompleted: true, 
            tripCost: calculatedCost 
        }).eq('id', tripId);

        // Requirement: vehicle isAvailable -> true
        await supabase.from('vehicles').update({ isAvailable: true }).eq('id', trip.vehicle_id);

        res.status(200).json({ message: "Trip ended", tripCost: calculatedCost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
