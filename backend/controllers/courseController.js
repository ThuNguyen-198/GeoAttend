const supabase = require('../supabase/supabaseClient');

// Get all courses
const getCourses = async (req, res) => {
    try {
        const { data: courses, error } = await supabase.from('tn_course').select('*');
        if (error) {
            return res.status(400).json({ message: 'Error fetching courses', error });
        }
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get course details by ID
const getCourseDetails = async (req, res) => {
    const courseId = req.params.id;
    const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
    if (error) return res.status(404).json({ error: error.message });
    res.status(200).json(data);
};

// Create a new course
const createCourse = async (req, res) => {
    const { name, professor_id } = req.body;
    const { data, error } = await supabase.from("courses").insert([{ name, professor_id }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

// Enroll a student in a course
const enrollStudent = async (req, res) => {
    const { student_id, course_id } = req.body;
    const { data, error } = await supabase
        .from("student_courses_mapping")
        .insert([{ student_id, course_id }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

// Get students in a course
const getCourseStudents = async (req, res) => {
    const courseId = req.params.id;
    const { data, error } = await supabase
        .from("student_courses_mapping")
        .select("*, students(*)")
        .eq("course_id", courseId);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

module.exports = { getCourses, getCourseDetails, createCourse, enrollStudent, getCourseStudents };
