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
import { CheckBox } from "react-native-elements";

const CheckAttendanceModal = ({ visible, onClose, course }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([
    { courseName: "Advanced Database", courseId: "112" },
    { courseName: "Capstone Project", courseId: "136" },
    { courseName: "Advanced Algorithm", courseId: "143" },
    { courseName: "Course A", courseId: "118" },
    { courseName: "Course B", courseId: "1125" },
    { courseName: "Course C", courseId: "1243" },
  ]);
  const [code, setCode] = useState("");
  const [isRequireLocation, setIsRequireLocation] = useState(true);
  const [isRequireCode, setIsRequireCode] = useState(true);
  const [isOnCheckingAttendance, setIsOnCheckingAttendance] = useState(false);
  const [timer, setTimer] = useState(3600); // 1 hour in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (course) {
      setSelectedCourse(course.courseId);
    } else {
      setSelectedCourse(null);
    }
  }, [course, visible]);

  useEffect(() => {
    if (!visible) {
      resetTimer();
    }
  }, [visible]);

  useEffect(() => {
    if (selectedCourse) {
      const selectedCourse = courses.find(
        (item) => item.courseId === selectedCourse
      );
    }
  }, [selectedCourse]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const generateRandomCode = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  };

  const handleCheckingAttendance = () => {
    setIsOnCheckingAttendance(!isOnCheckingAttendance);
    if (isRequireCode) {
      const code = generateRandomCode();
      setCode(code);
    }
    setIsTimerRunning(!isOnCheckingAttendance);
  };

  const resetTimer = () => {
    setTimer(3600);
    setIsTimerRunning(false);
    setIsOnCheckingAttendance(false);
  };

  const handleCloseModal = () => {
    onClose();
    resetTimer();
    setSelectedCourse("");
    setCode("");
    setIsRequireCode(true);
    setIsRequireLocation(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Modal
        isVisible={visible}
        onBackdropPress={handleCloseModal}
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
            <Text style={styles.sheetHeader}>Check Attendance</Text>
            <MaterialCommunityIcons
              onPress={handleCloseModal}
              name="close"
              size={24}
              color="#424242"
            />
          </View>

          <View style={styles.innerContainer}>
            <RNPickerSelect
              onValueChange={(value) => value && setSelectedCourse(value)}
              items={courses.map((course) => ({
                label: course.courseName,
                value: course.courseId,
              }))}
              placeholder={{ label: "Select a course...", value: null }}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
              }}
              value={selectedCourse}
              textInputProps={{
                style: styles.courseName,
              }}
            />
            <View style={styles.checkBoxSectionContainer}>
              <CheckBox
                title="Require location"
                checked={isRequireLocation}
                onPress={() => setIsRequireLocation(!isRequireLocation)}
                containerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                }}
                textStyle={{ color: "#333" }}
                uncheckedColor="#424242"
              />
              <CheckBox
                title="Require code"
                checked={isRequireCode}
                onPress={() => setIsRequireCode(!isRequireCode)}
                containerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                }}
                textStyle={{ color: "#333" }}
                uncheckedColor="#424242"
              />
            </View>

            {/* Button */}
            <View style={styles.buttonCenter}>
              <TouchableOpacity
                disabled={!selectedCourse}
                style={
                  selectedCourse ? styles.submitButton : styles.buttonDisabled
                }
                onPress={handleCheckingAttendance}
              >
                {isOnCheckingAttendance ? (
                  <Text
                    style={
                      selectedCourse
                        ? styles.submitButtonText
                        : styles.buttonDisabledText
                    }
                  >
                    Stop checking attendance
                  </Text>
                ) : (
                  <Text
                    style={
                      selectedCourse
                        ? styles.submitButtonText
                        : styles.buttonDisabledText
                    }
                  >
                    Start checking attendance
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {/* Display code */}
            {isOnCheckingAttendance && code && (
              <View style={styles.displayedCode}>
                <Text style={styles.displayedCode}>{code}</Text>
              </View>
            )}
            {/* Display remaining time */}
            {isOnCheckingAttendance && (
              <View style={styles.row}>
                <Text style={{ fontSize: 20, color: "#a4a4a4" }}>
                  Time remaining:{" "}
                </Text>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
              </View>
            )}
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
    width: 280,
    borderRadius: 14,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#dbdbdb",
    height: 46,
    width: 280,
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
  checkBoxSectionContainer: {
    width: "100%",
    flexDirection: "column",
    alignContent: "flex-start",
  },
  displayedCode: {
    fontSize: 50,
    color: "#fca311",
    fontWeight: "600",
  },
  timerContainer: {
    marginTop: 20,
  },
  timerText: {
    fontSize: 24,
    color: "#424242",
    fontWeight: "bold",
  },
});

export default CheckAttendanceModal;
