const supabase = require("../server");

// Register
const registerUser = async (req, res) => {
    const { email, password, full_name, role } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name, role },
        },
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ user: data.user });
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ user: data.user });
};

// Logout
const logoutUser = async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).send("Logged out successfully");
};

module.exports = { registerUser, loginUser, logoutUser };
