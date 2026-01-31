const supabase = require('../config/supabase');

const getSystemAnalytics = async (req, res) => {
    try {
        // Parallel queries to fetch counts using database-level aggregation
        const [
            { count: totalCustomers },
            { count: totalOwners },
            { count: totalDrivers },
            { count: totalVehicles },
            { count: totalTrips }
        ] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'owner'),
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'driver'),
            supabase.from('vehicles').select('*', { count: 'exact', head: true }),
            supabase.from('trips').select('*', { count: 'exact', head: true })
        ]);

        res.status(200).json({
            total_customers: totalCustomers,
            total_owners: totalOwners,
            total_drivers: totalDrivers,
            total_vehicles: totalVehicles,
            total_trips: totalTrips
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getSystemAnalytics };

