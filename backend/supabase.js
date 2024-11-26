import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SUPABASE_URL } from "@env";
import { api } from "./supabase";

export const api = axios.create({
    baseURL: `${SUPABASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};

// Fetch all courses
export const fetchCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// Fetch details of a specific course
export const fetchCourseDetails = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// Create a new course
export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

// Enroll a student in a course
export const enrollInCourse = async (enrollmentData) => {
  const response = await api.post("/courses/enroll", enrollmentData);
  return response.data;
};

// Fetch students in a course
export const fetchCourseStudents = async (id) => {
  const response = await api.get(`/courses/${id}/students`);
  return response.data;
};

// Mark attendance
export const markAttendance = async (attendanceData) => {
  const response = await api.post("/attendance/mark", attendanceData);
  return response.data;
};

// Check attendance for a session
export const checkAttendance = async (sessionId) => {
  const response = await api.get(`/attendance/check/${sessionId}`);
  return response.data;
};

// Get attendance by course ID
export const getAttendanceByCourse = async (courseId) => {
  const response = await api.get(`/attendance/course/${courseId}`);
  return response.data;
};

// Get attendance by student ID
export const getAttendanceByStudent = async (studentId) => {
  const response = await api.get(`/attendance/student/${studentId}`);
  return response.data;
};

// Create a new group
export const createGroup = async (groupData) => {
  const response = await api.post("/groups/create", groupData);
  return response.data;
};

// Get groups by user ID
export const getGroupsByUser = async (userId) => {
  const response = await api.get(`/groups/user/${userId}`);
  return response.data;
};

// Add a member to a group
export const addMemberToGroup = async (memberData) => {
  const response = await api.post("/groups/add-member", memberData);
  return response.data;
};

// Remove a member from a group
export const removeMemberFromGroup = async (memberData) => {
  const response = await api.delete("/groups/remove-member", { data: memberData });
  return response.data;
};

// Delete a group
export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/delete/${groupId}`);
  return response.data;
};

// Send a message
export const sendMessage = async (messageData) => {
  const response = await api.post("/messages/send", messageData);
  return response.data;
};

// Get messages for a user
export const getMessagesByUser = async (userId) => {
  const response = await api.get(`/messages/user/${userId}`);
  return response.data;
};

// Mark a message as read
export const markMessageAsRead = async (messageId) => {
  const response = await api.put("/messages/mark-read", { messageId });
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/delete/${messageId}`);
  return response.data;
};