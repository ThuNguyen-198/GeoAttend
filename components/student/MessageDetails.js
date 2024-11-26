import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { markMessageAsRead, deleteMessage } from "../../backend/supabase";

const MessageDetails = () => {
  return (
    <View>
      <Text>MessageDetails</Text>
    </View>
  );
};

const handleMarkAsRead = async (messageId) => {
  try {
      await markMessageAsRead(messageId);
      alert("Message marked as read!");
  } catch (error) {
      console.error("Error marking message as read:", error.message);
  }
};

const handleDeleteMessage = async (messageId) => {
  try {
      await deleteMessage(messageId);
      alert("Message deleted successfully!");
  } catch (error) {
      console.error("Error deleting message:", error.message);
  }
};

export default MessageDetails;

const styles = StyleSheet.create({});
