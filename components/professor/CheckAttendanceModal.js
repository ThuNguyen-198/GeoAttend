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
  const [selectedTimer, setSelectedTimer] = useState("1 hour");
  const [customTime, setCustomTime] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

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
  useEffect(() => {
    let timerValue = 3600; // Default to 1 hour
    switch (selectedTimer) {
      case "5 mins":
        timerValue = 5 * 60;
        break;
      case "10 mins":
        timerValue = 10 * 60;
        break;
      case "15 mins":
        timerValue = 15 * 60;
        break;
      case "30 mins":
        timerValue = 30 * 60;
        break;
      case "2 hours":
        timerValue = 2 * 3600;
        break;
      case "other":
        if (customTime) {
          timerValue = parseInt(customTime, 10) * 60 || 0;
        }
        break;
      default:
        timerValue = 3600;
    }
    setTimer(timerValue);
  }, [selectedTimer, customTime]);

  const generateRandomCode = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
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

  const resetTimer = () => {
    setTimer(3600);
    setIsTimerRunning(false);
    setIsOnCheckingAttendance(false);
  };
  const handleCheckingAttendance = () => {
    setIsOnCheckingAttendance(!isOnCheckingAttendance);
    if (isRequireCode) {
      const code = generateRandomCode();
      setCode(code);
    }
    setIsTimerRunning(!isOnCheckingAttendance);
  };
  const handleEditAttendance = () => {};
  const handleDeleteAttendance = () => {
    setDeleteModalVisible(true);
  };
  const handleCloseModal = () => {
    onClose();
    resetTimer();
    setSelectedCourse("");
    setCode("");
    setIsRequireCode(true);
    setIsRequireLocation(true);
    setSelectedTimer("1 hour");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <Modal
          isVisible={visible}
          onBackdropPress={handleCloseModal}
          style={[styles.modal, { zIndex: 10 }]}
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
                  inputIOS: [
                    styles.pickerInput,
                    { opacity: isTimerRunning ? 0.5 : 1 },
                  ],
                  inputAndroid: [
                    styles.pickerInput,
                    { opacity: isTimerRunning ? 0.5 : 1 },
                  ],
                }}
                value={selectedCourse}
                textInputProps={{
                  style: [
                    styles.courseName,
                    { opacity: isTimerRunning ? 0.5 : 1 },
                  ],
                }}
                disabled={isTimerRunning}
              />
              <View style={styles.checkBoxSectionContainer}>
                <CheckBox
                  title="Require location"
                  checked={isRequireLocation}
                  onPress={() => setIsRequireLocation(!isRequireLocation)}
                  containerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#fff",
                    opacity: isTimerRunning ? 0.5 : 1,
                  }}
                  textStyle={{
                    color: "#333",
                    opacity: isTimerRunning ? 0.5 : 1,
                  }}
                  uncheckedColor="#424242"
                  disabled={isTimerRunning}
                />
                <CheckBox
                  title="Require code"
                  checked={isRequireCode}
                  onPress={() => setIsRequireCode(!isRequireCode)}
                  containerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#fff",
                    opacity: isTimerRunning ? 0.5 : 1,
                  }}
                  textStyle={{
                    color: "#333",
                    opacity: isTimerRunning ? 0.5 : 1,
                  }}
                  uncheckedColor="#424242"
                  disabled={isTimerRunning}
                />
                <View style={styles.pair}>
                  <Text
                    style={{
                      color: "#333",
                      paddingLeft: 20,
                      paddingTop: 20,
                      fontWeight: "700",
                      opacity: isTimerRunning ? 0.5 : 1,
                    }}
                  >
                    Set Timer
                  </Text>
                  <RNPickerSelect
                    onValueChange={(value) => setSelectedTimer(value)}
                    items={[
                      { label: "5 mins", value: "5 mins" },
                      { label: "10 mins", value: "10 mins" },
                      { label: "15 mins", value: "15 mins" },
                      { label: "30 mins", value: "30 mins" },
                      { label: "1 hour", value: "1 hour" },
                      { label: "2 hours", value: "2 hours" },
                      { label: "Other", value: "other" },
                    ]}
                    placeholder={{ label: "Select timer...", value: null }}
                    style={{
                      inputIOS: [
                        styles.pickerInput,
                        { opacity: isTimerRunning ? 0.5 : 1 },
                      ],
                      inputAndroid: [
                        styles.pickerInput,
                        { opacity: isTimerRunning ? 0.5 : 1 },
                      ],
                    }}
                    value={selectedTimer}
                    disabled={isTimerRunning}
                  />
                  {selectedTimer === "other" && (
                    <TextInput
                      style={[
                        styles.input,
                        { opacity: isTimerRunning ? 0.5 : 1 },
                      ]}
                      keyboardType="numeric"
                      placeholder="Enter time in minutes"
                      value={customTime}
                      onChangeText={setCustomTime}
                      editable={!isTimerRunning}
                    />
                  )}
                </View>
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
              {isOnCheckingAttendance && (
                <View style={styles.card}>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "flex-end",
                      gap: 16,
                    }}
                  >
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        name="pencil"
                        size={22}
                        color="#013976"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        name="delete"
                        size={22}
                        color="#DB4437"
                        onPress={handleDeleteAttendance}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* Display code */}
                  {isRequireCode && code && (
                    <View style={styles.displayedCode}>
                      <Text style={styles.displayedCode}>{code}</Text>
                    </View>
                  )}
                  {/* Display remaining time */}

                  <View style={styles.row}>
                    <Text style={{ fontSize: 20, color: "#a4a4a4" }}>
                      Time remaining:{" "}
                    </Text>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isDeleteModalVisible}
          onBackdropPress={() => setDeleteModalVisible(false)} // Close on backdrop click
          style={styles.modal}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={styles.bottomSheet}>
            <Text style={styles.confirmationText}>
              Are you sure you want to delete this attendance?
            </Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={handleDeleteAttendance}>
                <Text style={styles.confirmButton}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.cancelButton}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
    minWidth: 80,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  innerContainer: {
    paddingTop: 16,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 26,
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
  timerText: {
    fontSize: 24,
    color: "#424242",
    fontWeight: "bold",
  },
  pair: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 160,
    textAlign: "center",
  },
  card: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 4,
  },
});

export default CheckAttendanceModal;
