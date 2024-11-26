const supabase = require("../server");

// Mark attendance for a session
const markAttendance = async (req, res) => {
    const { student_id, session_id, present } = req.body;
    const { data, error } = await supabase
        .from("tn-user-attendance")
        .insert([{ student_id, session_id, present }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

// Check attendance for a session
const checkAttendance = async (req, res) => {
    const sessionId = req.params.id;
    const { data, error } = await supabase
        .from("tn-user-attendance")
        .select("*")
        .eq("session_id", sessionId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Get attendance by course ID
const getAttendanceByCourse = async (req, res) => {
    const courseId = req.params.id;
    const { data, error } = await supabase
        .from("tn-attendance")
        .select("*, tn-user-attendance(*)")
        .eq("course_id", courseId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Get attendance by student ID
const getAttendanceByStudent = async (req, res) => {
    const studentId = req.params.id;
    const { data, error } = await supabase
        .from("tn-user-attendance")
        .select("*, tn-attendance(*)")
        .eq("student_id", studentId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

module.exports = {
    markAttendance,
    checkAttendance,
    getAttendanceByCourse,
    getAttendanceByStudent,
};
