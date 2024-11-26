const express = require("express");
const {
    createGroup,
    getGroupsByUser,
    addMemberToGroup,
    removeMemberFromGroup,
    deleteGroup,
} = require("../controllers/groupController");
const router = express.Router();

// Define routes
router.post("/create", createGroup); // Create a new group
router.get("/user/:id", getGroupsByUser); // Get groups by user ID
router.post("/add-member", addMemberToGroup); // Add a member to a group
router.delete("/remove-member", removeMemberFromGroup); // Remove a member from a group
router.delete("/delete/:id", deleteGroup); // Delete a group

module.exports = router;
