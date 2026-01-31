// controllers/user.controller.js
const supabase = require('../config/supabase');

const signUp = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Basic Validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const validRoles = ['customer', 'owner', 'driver'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role provided" });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password, role }])
            .select();

        if (error) {
            if (error.code === '23505') { // PostgreSQL unique violation code
                return res.status(400).json({ error: "Email already exists" });
            }
            throw error;
        }

        res.status(201).json({ message: "User created successfully", user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signUp };
