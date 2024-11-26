const supabase = require("../server");

// Create a new group
const createGroup = async (req, res) => {
    const { groupName, createdBy } = req.body;
    const { data, error } = await supabase
        .from("groups")
        .insert([{ group_name: groupName, created_by: createdBy }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

// Get groups by user ID
const getGroupsByUser = async (req, res) => {
    const userId = req.params.id;
    const { data, error } = await supabase
        .from("student_groups_mapping")
        .select("*, groups(*)")
        .eq("student_id", userId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Add a member to a group
const addMemberToGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    const { data, error } = await supabase
        .from("student_groups_mapping")
        .insert([{ group_id: groupId, student_id: userId }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

// Remove a member from a group
const removeMemberFromGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    const { data, error } = await supabase
        .from("student_groups_mapping")
        .delete()
        .eq("group_id", groupId)
        .eq("student_id", userId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Delete a group
const deleteGroup = async (req, res) => {
    const groupId = req.params.id;
    const { data, error } = await supabase.from("groups").delete().eq("id", groupId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

module.exports = {
    createGroup,
    getGroupsByUser,
    addMemberToGroup,
    removeMemberFromGroup,
    deleteGroup,
};
