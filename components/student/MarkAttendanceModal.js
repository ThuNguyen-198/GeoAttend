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
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../backend/supabase";

const MarkAttendanceModal = ({ visible, onClose, course }) => {
  const { session } = useAuth();
  // console.log("session: ", JSON.stringify(session, null, 2));
  const {
    locationIsOn,
    location,
    locationName,
    locationCity,
    turnOnLocation,
    turnOffLocation,
  } = useLocation();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [openAttendance, setOpenAttendance] = useState(null);
  const [isCodeRequired, setIsCodeRequired] = useState(false);
  const [isLocationRequired, setIsLocationRequired] = useState(false);
  const [courseLongitude, setCourseLongitude] = useState(null);
  const [courseLatitude, setCourseLatitude] = useState(null);
  const [courseCode, setCourseCode] = useState(null);
  const [code, setCode] = useState("");
  const [isLoadingMarkingAttendance, setIsLoadingMarkingAttendance] =
    useState(false);

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
  useEffect(() => {
    fetchCourses(session.user.email, "student");
  });

  const fetchAttendanceByCourseId = async (courseId) => {
    if (!courseId) {
      console.log("No courseId provided. Exiting fetchAttendanceByCourseId.");
      return; // Exit early
    }
    console.log("Fetching attendance for courseId: ", courseId);
    try {
      let { data, error } = await supabase.rpc(
        "get_open_attendance_by_course_id",
        {
          courseid: courseId,
        }
      );
      if (error) {
        console.error(
          "Error fetching attendance for courseId: ",
          courseId,
          error
        );
      } else if (data && data.length > 0) {
        console.log("Open attendance: ", data[0]);
        setOpenAttendance(data[0]);
        setIsCodeRequired(data[0].isCodeRequired);
        setIsLocationRequired(data[0].isLocationRequired);
        setCourseCode(data[0].attendance_code);
        setCourseLongitude(data[0].longitude);
        setCourseLatitude(data[0].latitude);
        // console.log("code: ", data[0].attendance_code);
        // console.log("location: ", data[0].longitude);
      } else {
        setOpenAttendance(null);
        setIsCodeRequired(false);
        setIsLocationRequired(false);
        setCourseCode(null);
        setCourseLongitude(null);
        setCourseLatitude(null);
      }
    } catch (err) {
      console.error("Unexpected error fetching attendance: ", err);
    }
  };

  // useEffect(() => {
  //   if (course) {
  //     setSelectedCourse(course.courseId);
  //   } else {
  //     setSelectedCourse(null);
  //   }
  // }, [course, visible]);
  useEffect(() => {
    if (course) {
      setSelectedCourse(course.courseId);
    }
  }, [course]);
  useEffect(() => {
    if (!visible) {
      setCode("");
    }
  }, [visible]);
  // useEffect(() => {
  //   if (selectedCourse) {
  //     const selectedCourse = courses.find(
  //       (item) => item.courseId === selectedCourse
  //     );
  //   }
  // }, [selectedCourse]);
  const handleSelectCourse = (value) => {
    setSelectedCourse(value);
    if (!value) {
      console.log("course null, selected course: ", selectedCourse);
      setOpenAttendance(null);
      setIsCodeRequired(false);
      setIsLocationRequired(false);
      return;
    }
    if (value && value !== null) {
      setIsLoadingAttendance(true);
      fetchAttendanceByCourseId(value);
      setIsLoadingAttendance(false);
    }
  };
  const handleLocation = () => {
    locationIsOn ? turnOffLocation() : turnOnLocation();
  };

  const handleSubmitAttendance = async () => {
    // setIsLoadingMarkingAttendance(true);

    let { data, error } = await supabase.rpc("validate_and_mark_attendance", {
      attendance_id_input: openAttendance.id,
      code_input: code,
      latitude_input: location.latitude,
      longitude_input: location.longitude,
      user_email_input: session.user.email,
    });
    if (error) console.error(error);
    else {
      Alert.alert(data);
    }

    console.log("input code: ", code);
    setCode("");
    onClose();
    setIsLoadingMarkingAttendance(false);
    setOpenAttendance(null);
    setIsCodeRequired(false);
    setIsLocationRequired(false);
    setCourseCode(null);
    setCourseLongitude(null);
    setCourseLatitude(null);
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
              onValueChange={(value) => handleSelectCourse(value)}
              items={courses.map((course) => ({
                label: course.course_name,
                value: course.course_id,
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

            {openAttendance === null ? (
              !selectedCourse ? (
                <Text
                  style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}
                >
                  Please select a course to start checking your attendance.
                </Text>
              ) : (
                <Text>
                  This course is currently not open for checking attendance
                </Text>
              )
            ) : (
              <View>
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
                    <Switch
                      value={locationIsOn}
                      onValueChange={handleLocation}
                    />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter the code..."
                    keyboardType="default"
                    value={code}
                    onChangeText={setCode}
                  />
                </View>

                <View style={styles.buttonCenter}>
                  <TouchableOpacity
                    // disabled={!locationIsOn || !code || !selectedCourse}
                    // style={
                    //   locationIsOn && code && selectedCourse
                    //     ? styles.submitButton
                    //     : styles.buttonDisabled
                    // }
                    style={styles.submitButton}
                    onPress={handleSubmitAttendance}
                  >
                    <Text
                      style={styles.submitButtonText}
                      // style={
                      //   locationIsOn && code && selectedCourse
                      //     ? styles.submitButtonText
                      //     : styles.buttonDisabledText
                      // }
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
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
