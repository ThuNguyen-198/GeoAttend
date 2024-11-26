import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { addMemberToGroup, removeMemberFromGroup, deleteGroup } from "../../backend/supabase";

const GroupDetails = () => {
  return (
    <View>
      <Text>GroupDetails</Text>
    </View>
  );
};

const handleAddMember = async () => {
  try {
      await addMemberToGroup({ groupId: "group_id_here", userId: "user_id_here" });
      alert("Member added successfully!");
  } catch (error) {
      console.error("Error adding member:", error.message);
  }
};

const handleRemoveMember = async () => {
  try {
      await removeMemberFromGroup({ groupId: "group_id_here", userId: "user_id_here" });
      alert("Member removed successfully!");
  } catch (error) {
      console.error("Error removing member:", error.message);
  }
};

const handleDeleteGroup = async () => {
  try {
      await deleteGroup("group_id_here");
      alert("Group deleted successfully!");
  } catch (error) {
      console.error("Error deleting group:", error.message);
  }
};

export default GroupDetails;

const styles = StyleSheet.create({});
