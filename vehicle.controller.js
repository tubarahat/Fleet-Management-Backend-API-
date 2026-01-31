// controllers/vehicle.controller.js
const supabase = require('../config/supabase');

// POST /vehicles/add/
const addVehicle = async (req, res) => {
    const { name, registration_number, allowed_passengers, rate_per_km, owner_id } = req.body;

    try {
        const { data, error } = await supabase
            .from('vehicles')
            .insert([{ name, registration_number, allowed_passengers, rate_per_km, owner_id }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Vehicle added successfully", vehicle: data[0] });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PATCH /vehicles/assign-driver/:vehicleId
const assignDriver = async (req, res) => {
    const { vehicleId } = req.params;
    const { driver_id } = req.body;

    try {
        const { data, error } = await supabase
            .from('vehicles')
            .update({ driver_id })
            .eq('id', vehicleId)
            .select();

        if (error) throw error;
        res.status(200).json({ message: "Driver assigned successfully", vehicle: data[0] });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// GET /vehicles/:vehicleId
const getVehicleById = async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*, users!vehicles_owner_id_fkey(name)') // Join to see owner name
            .eq('id', vehicleId)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ error: "Vehicle not found" });
    }
};

module.exports = { addVehicle, assignDriver, getVehicleById };

