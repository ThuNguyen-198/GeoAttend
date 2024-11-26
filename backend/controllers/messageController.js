const supabase = require("../server");

// Send a new message
const sendMessage = async (req, res) => {
    const { senderId, recipientId, message } = req.body;
    const { data, error } = await supabase.from("messages").insert([
        {
            sender_id: senderId,
            recipient_id: recipientId,
            message,
            status: "unread",
        },
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

// Get messages for a user
const getMessagesByUser = async (req, res) => {
    const userId = req.params.id;
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Mark a message as read
const markMessageAsRead = async (req, res) => {
    const { messageId } = req.body;
    const { data, error } = await supabase
        .from("messages")
        .update({ status: "read" })
        .eq("id", messageId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Delete a message
const deleteMessage = async (req, res) => {
    const messageId = req.params.id;
    const { data, error } = await supabase.from("messages").delete().eq("id", messageId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

module.exports = {
    sendMessage,
    getMessagesByUser,
    markMessageAsRead,
    deleteMessage,
};
