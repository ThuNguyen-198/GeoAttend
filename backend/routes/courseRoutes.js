const express = require("express");
const {
    getCourses,
    getCourseDetails,
    createCourse,
    enrollStudent,
    getCourseStudents,
} = require("../controllers/courseController");
const router = express.Router();

// Define routes
router.get("/", getCourses); // Fetch all courses
router.get("/:id", getCourseDetails); // Get course details by ID
router.post("/", createCourse); // Create a new course
router.post("/enroll", enrollStudent); // Enroll a student in a course
router.get("/:id/students", getCourseStudents); // Get students in a course

module.exports = router;
