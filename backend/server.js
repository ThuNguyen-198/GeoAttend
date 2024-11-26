const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes'); // Import course routes
const supabase = require('./supabase/supabaseClient'); // Adjust the path as needed

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// Health Check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_ANON_KEY
// );

//const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

//const courseRoutes = require("./routes/courseRoutes");
app.use("/courses", courseRoutes);

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/attendance", attendanceRoutes);

const groupRoutes = require("./routes/groupRoutes");
app.use("/groups", groupRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/messages", messageRoutes);

const SERVER_PORT = process.env.PORT || 5000;
app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
});

module.exports = supabase;
