import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../backend/supabase";
import { useAuth } from "../../context/AuthContext";
import { CheckBox, Input, Switch } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { date } from "yup";
import { color } from "react-native-elements/dist/helpers";
import { useLocation } from "../../context/LocationContext";

const CreateNewCourse = ({ isVisible, onClose, toggleModal, fetchCourses }) => {
  const {
    locationIsOn,
    location,
    locationName,
    locationCity,
    turnOnLocation,
    turnOffLocation,
  } = useLocation();
  const [courseName, setCourseName] = useState("");
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [isMeetingTimeSelected, setIsMeetingTimeSelected] = useState(false);
  const [meetingTime, setMeetingTime] = useState();
  const { session, professorMode } = useAuth();
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [startHour, setStartHour] = useState();
  const [startMin, setStartMin] = useState();
  const [startMidDayMarker, setStartMidDayMarker] = useState("AM");
  const [endHour, setEndHour] = useState();
  const [endMin, setEndMin] = useState();
  const [endMidDayMarker, setEndMidDayMarker] = useState("AM");
  const [classDates, setClassDates] = useState([]);
  const [isAutoCheckAttendance, setIsAutoCheckAttendance] = useState(false);

  const weekDate = ["M", "T", "W", "T", "F", "S", "S"];
  const midDayMarkers = ["AM", "PM"];
  const handleSelectDays = (index) => {
    setSelectedDays((prev) =>
      prev.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  // const courses = [
  //   {
  //     id: "1",
  //     class_id: "100",
  //     course_name: "New Course 1",
  //   },
  //   {
  //     id: "2",
  //     class_id: "200",
  //     course_name: "New Course 2",
  //   },
  // ];
  const handleLocation = () => {
    locationIsOn ? turnOffLocation() : turnOnLocation();
  };
  const generateClassTimes = () => {
    if (!dateFrom || !dateTo || !selectedDays.some((day) => day)) {
      Alert.alert("Error", "Please ensure date range and days are selected.");
      return;
    }
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    const daysMap = ["M", "T", "W", "T", "F", "S", "S"]; // Match to weekDate
    const selectedDayIndices = selectedDays
      .map((isSelected, index) => (isSelected ? index : null))
      .filter((index) => index !== null);

    let generatedClassTimes = [];
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dayIndex = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
      if (selectedDayIndices.includes(dayIndex)) {
        const dateStr = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        generatedClassTimes.push(dateStr);
      }
    }

    setClassDates(generatedClassTimes);
    return generatedClassTimes;
  };

  const formatTime = (hour, minute, midDayMarker) => {
    let hourInt = parseInt(hour, 10);
    if (midDayMarker === "PM" && hourInt !== 12) {
      hourInt += 12;
    }
    if (midDayMarker === "AM" && hourInt === 12) {
      hourInt = 0;
    }
    return `${String(hourInt).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:00`;
  };

  const createNewCourse = async () => {
    if (isLocationSelected && !locationIsOn) {
      Alert.alert("Please turn on your location!");
    } else {
      const formattedStartTime = formatTime(
        startHour,
        startMin,
        startMidDayMarker
      );
      const formattedEndTime = formatTime(endHour, endMin, endMidDayMarker);
      const generatedClassDates = generateClassTimes();
      console.log("classDates input: ", generatedClassDates);
      let { data, error } = await supabase.rpc("create_course", {
        course_name_input: courseName,
        email_input: session.user.email,
        latitude_input:
          isLocationSelected && locationIsOn ? location.latitude : null,
        longitude_input:
          isLocationSelected && locationIsOn ? location.longitude : null,
        meeting_dates_input: generatedClassDates || null,
        start_time_input: formattedStartTime || null,
        end_time_input: formattedEndTime || null,
        role_input: "professor",
      });
      if (error) console.error(error);
      else {
        Alert.alert("Course Created", `${courseName} has been created`);
        fetchCourses(
          session.user.email,
          professorMode ? "professor" : "student"
        );
        console.log("course created: ", JSON.stringify(data, null, 2));
      }
    }
  };
  const handleCreateCourse = () => {
    if (!courseName) Alert.alert("Please enter a course name!");
    else {
      generateClassTimes();
      createNewCourse();
      onClose();
      turnOffLocation();
      setCourseName("");
      setIsLocationSelected(false);
      setIsMeetingTimeSelected(false);
      setClassDates([]);
      setDateFrom(null);
      setDateTo(null);
      setStartHour(null);
      setStartMin(null);
      setEndHour(null);
      setEndMin(null);
      setStartMidDayMarker("AM");
      setEndMidDayMarker("AM");
      setSelectedDays([false, false, false, false, false, false, false]);
    }
  };
  useEffect(() => {
    console.log("Generated Class Timesss:", classDates);
    location && console.log("longitude:", location.longitude);
    location && console.log("latitude:", location.longitude);
  }, [classDates, location]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.row}>
            <Text style={styles.sheetHeader}>Create New Course</Text>
            <MaterialCommunityIcons
              onPress={toggleModal}
              name="close"
              size={24}
              color="#424242"
            />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <Text>Enter course name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Course name..."
                value={courseName}
                onChangeText={setCourseName}
              />
              <CheckBox
                title="Input course location"
                checked={isLocationSelected}
                onPress={() => setIsLocationSelected(!isLocationSelected)}
                containerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                  padding: 0,
                  margin: 0,
                  marginLeft: 0,
                  alignItems: "flex-start",
                }}
                textStyle={{
                  color: "#333",
                }}
                uncheckedColor="#424242"
                // disabled={isTimerRunning || isOptionDisabled}
              />
              {isLocationSelected && (
                <View style={[styles.rowItem, { width: "100%" }]}>
                  <View style={styles.rowItem}>
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
              )}
              <CheckBox
                title="Input course meeting time"
                checked={isMeetingTimeSelected}
                onPress={() => setIsMeetingTimeSelected(!isMeetingTimeSelected)}
                containerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                  padding: 0,
                  margin: 0,
                  marginLeft: 0,
                }}
                textStyle={{
                  color: "#333",
                }}
                uncheckedColor="#424242"
                // disabled={isTimerRunning || isOptionDisabled}
              />
              {isMeetingTimeSelected && (
                <View
                  style={{ flexDirection: "column", gap: 18, width: "100%" }}
                >
                  <View style={styles.rowItem}>
                    <Text>From</Text>
                    <TouchableOpacity
                      style={[styles.dateSelect, styles.rowItem]}
                    >
                      <DateTimePicker
                        minimumDate={new Date()}
                        value={dateFrom || new Date()}
                        mode="date"
                        display="compact"
                        onChange={(event, date) => {
                          if (date) setDateFrom(date);
                        }}
                      />
                    </TouchableOpacity>
                    <Text>To</Text>
                    <TouchableOpacity
                      style={[styles.dateSelect, styles.rowItem]}
                    >
                      <DateTimePicker
                        minimumDate={new Date()}
                        style={{ fontSize: 8 }}
                        value={dateTo || new Date()}
                        mode="date"
                        display="compact"
                        onChange={(event, date) => {
                          if (date) setDateTo(date);
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateList}>
                    <Text>Day(s):</Text>
                    {weekDate.map((date, index) => (
                      <TouchableOpacity onPress={() => handleSelectDays(index)}>
                        <Text
                          style={
                            selectedDays[index]
                              ? styles.selectedDate
                              : styles.notSelectedDate
                          }
                        >
                          {date}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.row}>
                    <View style={styles.rowItem}>
                      <Text>Start time</Text>
                      <View style={styles.timeBox}>
                        <TextInput
                          style={styles.timeInput}
                          placeholder="HH"
                          value={startHour}
                          maxLength={2}
                          keyboardType="numeric"
                          onChangeText={setStartHour}
                        />
                        <Text style={{ color: "#ccc", fontSize: 18 }}> : </Text>
                        <TextInput
                          style={styles.timeInput}
                          placeholder="MM"
                          value={startMin}
                          maxLength={2}
                          keyboardType="numeric"
                          onChangeText={setStartMin}
                        />
                      </View>
                      <View style={styles.markerBox}>
                        <RNPickerSelect
                          placeholder={{}}
                          onValueChange={(value) => setStartMidDayMarker(value)}
                          items={midDayMarkers.map((selected) => ({
                            label: selected,
                            value: selected,
                          }))}
                          value={startMidDayMarker}
                          style={{
                            inputIOS: [
                              styles.pickerInput,
                              { fontWeight: "800" },
                            ],
                            inputAndroid: [
                              styles.pickerInput,
                              { fontWeight: "800" },
                            ],
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text>End time</Text>
                      <View style={styles.timeBox}>
                        <TextInput
                          style={styles.timeInput}
                          placeholder="HH"
                          value={endHour}
                          maxLength={2}
                          keyboardType="numeric"
                          onChangeText={setEndHour}
                        />
                        <Text style={{ color: "#ccc", fontSize: 18 }}> : </Text>
                        <TextInput
                          style={styles.timeInput}
                          placeholder="MM"
                          value={endMin}
                          maxLength={2}
                          keyboardType="numeric"
                          onChangeText={setEndMin}
                        />
                      </View>
                      <View style={styles.markerBox}>
                        <RNPickerSelect
                          placeholder={{}}
                          onValueChange={(value) => setEndMidDayMarker(value)}
                          items={midDayMarkers.map((selected) => ({
                            label: selected,
                            value: selected,
                          }))}
                          value={endMidDayMarker}
                          style={{
                            inputIOS: [
                              styles.pickerInput,
                              { fontWeight: "800" },
                            ],
                            inputAndroid: [
                              styles.pickerInput,
                              { fontWeight: "800" },
                            ],
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <CheckBox
                    title="Automatically open attendance checks at the scheduled class time"
                    checked={isAutoCheckAttendance}
                    onPress={() =>
                      setIsAutoCheckAttendance(!isAutoCheckAttendance)
                    }
                    containerStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#fff",
                      padding: 0,
                      margin: 0,
                      marginLeft: 0,
                      alignItems: "flex-start",
                    }}
                    textStyle={{
                      color: "#333",
                    }}
                    uncheckedColor="#424242"
                  />
                </View>
              )}
              <View style={styles.buttonHolder}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateCourse}
                >
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default CreateNewCourse;

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
    minHeight: 800,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 20,
    gap: 10,
  },
  column: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // marginBottom: 20,
    gap: 16,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  sheetHeader: {
    fontSize: 18,
    color: "#424242",
    fontWeight: "bold",
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 16,
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
  input: {
    minWidth: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonHolder: {
    marginTop: 20,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#013976",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  courseName: {
    fontSize: 28,
    color: "#013976",
  },
  dateSelect: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    minWidth: 150,
    height: 50,
    backgroundColor: "#fff", // Ensures a light background
  },
  dateText: {
    fontSize: 16,
    color: "#424242",
    marginLeft: 8, // Space between icon and text
  },
  selectedDate: {
    fontSize: 30,
    fontWeight: "600",
    color: "#EFAB00",
  },
  notSelectedDate: {
    fontSize: 30,
    fontWeight: "600",
    opacity: 0.2,
    color: "#013976",
  },
  dateList: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },

  timeBox: {
    width: 76,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 2,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timeInput: {
    fontSize: 16,
    fontWeight: "800",
  },
  markerBox: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 6,
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  itemIcon: {
    fontSize: 26,
    color: "#424242",
    paddingRight: 8,
  },
});
