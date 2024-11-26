const express = require("express");
const {
    markAttendance,
    checkAttendance,
    getAttendanceByCourse,
    getAttendanceByStudent,
} = require("../controllers/attendanceController");
const router = express.Router();

// Define routes
router.post("/mark", markAttendance); // Mark attendance
router.get("/check/:id", checkAttendance); // Check attendance for a session
router.get("/course/:id", getAttendanceByCourse); // Get attendance by course ID
router.get("/student/:id", getAttendanceByStudent); // Get attendance by student ID

module.exports = router;
