import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import { useLocation } from "../../context/LocationContext";
import { markAttendance } from "../../backend/supabase";


const MarkAttendanceModal = ({ visible, onClose, course }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [courses, setCourses] = useState([
    { courseName: "Advanced Database", courseId: "112" },
    { courseName: "Capstone Project", courseId: "136" },
    { courseName: "Advanced Algorithm", courseId: "143" },
    { courseName: "Course A", courseId: "118" },
    { courseName: "Course B", courseId: "1125" },
    { courseName: "Course C", courseId: "1243" },
  ]);
  // const [location, setLocation] = useState("Kent State University");
  const [code, setCode] = useState("");
  const {
    locationIsOn,
    location,
    locationName,
    locationCity,
    turnOnLocation,
    turnOffLocation,
  } = useLocation();

  const handleMarkAttendance = async () => {
    const attendanceData = {
        student_id: "student_id_here", // Replace with actual ID
        session_id: "session_id_here", // Replace with actual ID
        present: true,
    };

    try {
        await markAttendance(attendanceData);
        Alert.alert("Attendance marked successfully!");
    } catch (error) {
        console.error("Error marking attendance:", error.message);
        Alert.alert("Failed to mark attendance.");
    }
  };

  useEffect(() => {
    if (course) {
      setSelectedValue(course.courseId);
    } else {
      setSelectedValue(null);
    }
  }, [course, visible]);
  useEffect(() => {
    if (!visible) {
      setCode("");
    }
  }, [visible]);
  useEffect(() => {
    if (selectedValue) {
      const selectedCourse = courses.find(
        (item) => item.courseId === selectedValue
      );
      console.log("Selected course:", selectedCourse?.courseName);
    }
  }, [selectedValue]);

  const handleLocation = () => {
    locationIsOn ? turnOffLocation() : turnOnLocation();
  };

  const onSubmitAttendance = () => {
    setCode("");
    Alert.alert("Attendance submitted!");
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles.bottomSheet}>
          <View style={[styles.row, { marginBottom: 20 }]}>
            <Text style={styles.sheetHeader}>Mark Your Attendance</Text>
            <MaterialCommunityIcons
              onPress={onClose}
              name="close"
              size={24}
              color="#424242"
            />
          </View>

          <View style={styles.innerContainer}>
            <RNPickerSelect
              onValueChange={(value) => value && setSelectedValue(value)}
              items={courses.map((course) => ({
                label: course.courseName,
                value: course.courseId,
              }))}
              placeholder={{ label: "Select a course...", value: null }}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
              }}
              value={selectedValue}
              textInputProps={{
                style: styles.courseName,
              }}
            />
            <View style={styles.card}>
              <View style={[styles.row, { width: "100%" }]}>
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name={
                      locationIsOn
                        ? "map-marker-check-outline"
                        : "map-marker-off-outline"
                    }
                    style={styles.itemIcon}
                  />
                  <Text style={styles.text}>
                    {locationIsOn ? (
                      location ? (
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {locationName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#333",
                            }}
                          >
                            {locationCity}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.loadingContainer}>
                          <Text>Getting your location... </Text>
                          <ActivityIndicator size="small" color="#013976" />
                        </View>
                      )
                    ) : (
                      <Text>Please turn on your location</Text>
                    )}
                  </Text>
                </View>
                <Switch value={locationIsOn} onValueChange={handleLocation} />
              </View>

              {/* Code Input */}
              <TextInput
                style={styles.input}
                placeholder="Enter the code..."
                keyboardType="default"
                value={code}
                onChangeText={setCode}
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonCenter}>
              <TouchableOpacity
                disabled={!locationIsOn || !code || !selectedValue}
                style={
                  locationIsOn && code && selectedValue
                    ? styles.submitButton
                    : styles.buttonDisabled
                }
                onPress={onSubmitAttendance}
              >
                <Text
                  style={
                    locationIsOn && code && selectedValue
                      ? styles.submitButtonText
                      : styles.buttonDisabledText
                  }
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 700,
  },
  pickerInput: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemIcon: {
    fontSize: 26,
    color: "#424242",
    paddingRight: 8,
  },
  text: {
    fontSize: 14,
    color: "#424242",
  },
  input: {
    minWidth: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonCenter: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#EFAB00",
    height: 46,
    width: 108,
    borderRadius: 14,
    paddingVertical: 10,
  },
  buttonDisabled: {
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
  sheetHeader: {
    fontSize: 18,
    color: "#424242",
  },
  courseName: {
    fontSize: 28,
    color: "#013976",
    textAlign: "center",
  },
  card: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 20,
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 4,
  },
  innerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 26,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default MarkAttendanceModal;
