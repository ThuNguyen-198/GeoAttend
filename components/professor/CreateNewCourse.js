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
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../backend/supabase";
import { useAuth } from "../../context/AuthContext";

const CreateNewCourse = ({ isVisible, onClose, toggleModal, fetchCourses }) => {
  const [courseName, setCourseName] = useState("");
  const [isCourseDisplayed, setDisplayCourse] = useState(false);
  const [courseToAdd, setCourseToAdd] = useState({});
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [meetingTime, setMeetingTime] = useState();
  const { session, professorMode } = useAuth();
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
  const createNewCourse = async () => {
    let { data, error } = await supabase.rpc("create_course", {
      course_name_input: courseName,
      email_input: session.user.email,
      latitude_input: latitude || null,
      longitude_input: longitude || null,
      meeting_time_input: meetingTime || null,
      role_input: "professor",
    });
    if (error) console.error(error);
    else {
      Alert.alert("Course Created", `${courseName} has been created`);
      fetchCourses(session.user.email, professorMode ? "professor" : "student");
      console.log(data);
    }
  };
  const handleCreateCourse = () => {
    if (!courseName) Alert.alert("Please enter a course name!");
    else {
      createNewCourse();
      onClose();
      setCourseName("");
    }
  };

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
                placeholder="Course ID..."
                value={courseName}
                onChangeText={setCourseName}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateCourse}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
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
    minHeight: 700,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
    alignItems: "center",
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
});
