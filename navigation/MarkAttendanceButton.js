import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useLocation } from "../context/LocationContext";
import MarkAttendanceModal from "../Components/MarkAttendanceModal";

const MarkAttendanceButton = ({ children }) => {
  const [location, setLocation] = useState("Kent State University");
  const [code, setCode] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const { locationIsOn, turnOnLocation, turnOffLocation } = useLocation();
  const handleLocation = () => {
    locationIsOn ? turnOffLocation() : turnOnLocation();
  };
  const onSubmitAttendance = () => {
    setCode("");
    Alert.alert("Attendance submitted!");
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={toggleModal}>
        <MaterialCommunityIcons name="plus-circle" size={40} color="#fff" />
      </TouchableOpacity>

      <MarkAttendanceModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        course={{}}
      />
    </View>
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
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 500,
  },
  sheetText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  markAttendanceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 22,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  text: {
    fontSize: 18,
    color: "#424242",
  },
  buttonCenter: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    textAlign: "center",
    backgroundColor: "#EFAB00",
    height: 46,
    width: 108,
    borderRadius: 14,
    paddingVertical: 10,
  },
  buttonDisabled: {
    textAlign: "center",
    backgroundColor: "#dbdbdb",
    height: 46,
    width: 108,
    borderRadius: 14,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: "#000",
    fontSize: 20,
    textAlign: "center",
  },
  buttonDisabledText: {
    color: "#a4a4a4",
    fontSize: 20,
    textAlign: "center",
  },
  itemIcon: {
    fontSize: 26,
    color: "#424242",
    paddingRight: 10,
  },
});

export default MarkAttendanceButton;

//Use this block to open a new screen instead of a modal
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import React from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// const MarkAttendanceButton = ({ onPress, children }) => {
//   return (
//     <TouchableOpacity style={styles.container} onPress={onPress}>
//       <MaterialCommunityIcons name="plus-circle" size={40} color="#fff" />
//     </TouchableOpacity>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#EFAB00",
//     borderRadius: 40,
//     height: 80,
//     width: 80,
//     bottom: 28,
//     borderColor: "#fff",
//     borderWidth: 6,
//   },
// });

// export default MarkAttendanceButton;
