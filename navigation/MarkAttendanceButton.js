import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const MarkAttendanceButton = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <MaterialCommunityIcons name="plus-circle" size={40} color="#fff" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFAB00",
    borderRadius: 40,
    height: 80,
    width: 80,
    bottom: 28,
    borderColor: "#fff",
    borderWidth: 6,
  },
});

export default MarkAttendanceButton;
