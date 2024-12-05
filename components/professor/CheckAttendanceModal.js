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
import { supabase } from "../../backend/supabase";
import { useAuth } from "../../context/AuthContext";
import getAddressFromCoordinates from "../../utils/getAddressFromCoordinates";

const CheckAttendanceModal = ({ visible, onClose, course }) => {
  const { session } = useAuth();
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [code, setCode] = useState();
  const [isLocationRequired, setIsLocationRequired] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [longitude, setLongtitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [address, setAddress] = useState(null);
  const [isCodeRequired, setIsCodeRequired] = useState(false);
  const [isOnCheckingAttendance, setIsOnCheckingAttendance] = useState(false);
  const [timer, setTimer] = useState(3600); // 1 hour in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState("1 hour");
  const [customTime, setCustomTime] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isOptionDisabled, setIsOptionDisable] = useState(true);
  const fetchCourses = async (email, role) => {
    // setIsLoading(true);
    try {
      let { data, error } = await supabase.rpc("fetch_user_courses", {
        email_input: email,
        role_input: role,
      });
      if (error) console.log("error: ", error);
      else if (data) {
        setCourses(data);
      }
    } catch (error) {
      console.error("Unexpected error when fetching courses:", error);
    }
    // setIsLoading(false);
  };
  // const fetchLocation = async () => {
  //   setIsLoadingLocation(true);
  //   let { data, error } = await supabase.rpc("get_course_location", {
  //     courseid: selectedCourseIndex,
  //   });
  //   if (error) console.error(error);
  //   else {
  //     setLongtitude(data[0].longitude);
  //     setLatitude(data[0].latitude);
  //   }
  //   setIsLoadingLocation(false);
  // };
  const createAttendance = async (
    course_id_input,
    start_time_input,
    end_time_input,
    iscoderequired_input,
    islocationrequired_input,
    attendance_code_input,
    latitude_input,
    longitude_input,
    isOpen
  ) => {
    let { data, error } = await supabase.rpc("check_attendance", {
      p_course_id: course_id_input,
      p_start_time: start_time_input,
      p_end_time: end_time_input,
      p_iscoderequired: iscoderequired_input,
      p_islocationrequired: islocationrequired_input,
      p_attendance_code: attendance_code_input,
      p_latitude: latitude_input,
      p_longitude: longitude_input,
      p_isopen: true,
    });
    if (error)
      console.error("error on calling function check_attendance: ", error);
    else {
      console.log("You're checking attendance now");
    }
  };
  useEffect(() => {
    fetchCourses(session.user.email, "professor");
  });

  useEffect(() => {
    if (course) {
      setSelectedCourseIndex(course.courseId);
    } else {
      setSelectedCourseIndex(null);
    }
  }, [course, visible]);

  useEffect(() => {
    if (!visible) {
      resetTimer();
    }
  }, [visible]);

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
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isTimerRunning && timer === 0) {
      handleStopCheckingAttendance(); // Call the function when timer reaches 0
      setIsTimerRunning(false); // Stop the timer
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
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };
  //-------------------------------------
  const resetTimer = () => {
    setTimer(3600);
    setIsTimerRunning(false);
    setIsOnCheckingAttendance(false);
  };
  //-------------------------------------
  const handleSelectCourse = (value) => {
    if (courses[selectedCourseIndex]) {
      const courseId = courses[selectedCourseIndex].course_id;
      setSelectedCourseId(courseId);
    }
    setIsLocationRequired(false);
    setAddress(null);
    setLatitude(null);
    setLongtitude(null);
    setIsCodeRequired(true);
    setSelectedCourseIndex(value);
    if (value !== null) {
      setIsOptionDisable(false);
    } else {
      setIsOptionDisable(true);
    }
  };
  //-------------------------------------

  //-------------------------------------
  const handleRequireLocation = async () => {
    if (isLocationRequired) {
    } else {
      if (
        courses[selectedCourseIndex] &&
        courses[selectedCourseIndex].longitude
      ) {
        console.log("there is a location");
        setLongtitude(courses[selectedCourseIndex].longitude);
      }
      if (
        courses[selectedCourseIndex] &&
        courses[selectedCourseIndex].latitude
      ) {
        setLatitude(courses[selectedCourseIndex].latitude);
      }
    }
    setIsLocationRequired(!isLocationRequired);
  };
  useEffect(() => {
    if (longitude && latitude) {
      const add = getAddressFromCoordinates(longitude, latitude);
      setAddress(add);
    } else setAddress(null);
  }, [longitude, latitude]);
  //-------------------------------------
  const handleRequireCode = () => {
    if (isCodeRequired) setIsCodeRequired(!isCodeRequired);
    else {
      const code = generateRandomCode();
      setCode(code);
      setIsCodeRequired(!isCodeRequired);
    }
  };
  const handleStartCheckingAttendance = () => {
    const startTime = new Date();
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + timer);
    createAttendance(
      selectedCourseId,
      startTime,
      endTime,
      isCodeRequired,
      isLocationRequired,
      code,
      latitude,
      longitude,
      true
    );

    setIsOnCheckingAttendance(!isOnCheckingAttendance);
    setIsTimerRunning(!isOnCheckingAttendance);
  };
  const handleStopCheckingAttendance = async () => {
    //call rpc function to update column isOpen to false

    let { data, error } = await supabase.rpc("update_checking_attendance", {
      attendance_status: false,
    });
    if (error) console.error(error);
    setIsOnCheckingAttendance(!isOnCheckingAttendance);
    setIsTimerRunning(!isOnCheckingAttendance);
    //reset states
    resetTimer();
    setSelectedCourseIndex(null);
    setCode(null);
    setIsCodeRequired(false);
    setIsLocationRequired(false);
    setSelectedTimer("1 hour");
    setIsLoadingLocation(false);
    setLongtitude(null);
    setSelectedCourseId(null);
  };
  const handleEditAttendance = () => {};
  const handleDeleteAttendance = () => {
    setDeleteModalVisible(true);
  };
  const handleCloseModal = () => {
    onClose();
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
                onValueChange={(value) => handleSelectCourse(value)}
                items={courses.map((course, index) => ({
                  label: course.course_name,
                  value: index,
                }))}
                placeholder={{ label: "Select a course here", value: null }}
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
                value={selectedCourseIndex}
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
                  checked={isLocationRequired}
                  onPress={handleRequireLocation}
                  containerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#fff",
                    opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                    paddingLeft: 0,
                  }}
                  textStyle={{
                    color: "#333",
                    opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                  }}
                  uncheckedColor="#424242"
                  disabled={isTimerRunning || isOptionDisabled}
                />
                {isLocationRequired && !address && (
                  <Text>
                    A location has not yet been designated for this course.
                  </Text>
                )}
                {/* {isLocationRequired && !address && (
                  <Text style={{ paddingHorizontal: 10 }}>
                    A location has not yet been designated for this course.
                  </Text>
                )}
                {isLocationRequired && address && <Text>{address.name}</Text>} */}

                <CheckBox
                  title="Require code"
                  checked={isCodeRequired}
                  onPress={handleRequireCode}
                  containerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#fff",
                    opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                    paddingLeft: 0,
                  }}
                  textStyle={{
                    color: "#333",
                    opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                  }}
                  uncheckedColor="#424242"
                  disabled={isTimerRunning || isOptionDisabled}
                />
                <View style={styles.pair}>
                  <Text
                    style={{
                      color: "#333",
                      paddingLeft: 10,
                      paddingTop: 20,
                      fontWeight: "700",
                      opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
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
                        {
                          opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                        },
                      ],
                      inputAndroid: [
                        styles.pickerInput,
                        {
                          opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                        },
                      ],
                    }}
                    value={selectedTimer}
                    disabled={isTimerRunning || isOptionDisabled}
                  />
                  {selectedTimer === "other" && (
                    <TextInput
                      style={[
                        styles.input,
                        {
                          opacity: isTimerRunning || isOptionDisabled ? 0.5 : 1,
                        },
                      ]}
                      keyboardType="numeric"
                      placeholder="Enter time in minutes"
                      value={customTime}
                      onChangeText={setCustomTime}
                      editable={!isTimerRunning || !isOptionDisabled}
                    />
                  )}
                </View>
              </View>

              {/* Button */}
              <View style={styles.buttonCenter}>
                <TouchableOpacity
                  disabled={selectedCourseIndex === null || isOptionDisabled}
                  style={
                    selectedCourseIndex !== null
                      ? styles.submitButton
                      : styles.buttonDisabled
                  }
                  onPress={
                    isOnCheckingAttendance
                      ? handleStopCheckingAttendance
                      : handleStartCheckingAttendance
                  }
                >
                  {isOnCheckingAttendance ? (
                    <Text
                      style={
                        selectedCourseIndex !== null
                          ? styles.submitButtonText
                          : styles.buttonDisabledText
                      }
                    >
                      Stop checking attendance
                    </Text>
                  ) : (
                    <Text
                      style={
                        selectedCourseIndex !== null
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
                  {isCodeRequired && code && (
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
    marginTop: 48,
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
