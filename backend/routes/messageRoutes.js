const express = require("express");
const {
    sendMessage,
    getMessagesByUser,
    markMessageAsRead,
    deleteMessage,
} = require("../controllers/messageController");
const router = express.Router();

// Define routes
router.post("/send", sendMessage); // Send a new message
router.get("/user/:id", getMessagesByUser); // Get messages for a user
router.put("/mark-read", markMessageAsRead); // Mark a message as read
router.delete("/delete/:id", deleteMessage); // Delete a message

module.exports = router;
