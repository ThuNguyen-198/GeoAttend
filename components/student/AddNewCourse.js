import React, { useState } from "react";
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

const AddNewCourse = ({ isVisible, onClose, toggleModal, fetchCourses }) => {
  const [courseInput, setCourseInput] = useState("");
  const [isCourseDisplayed, setDisplayCourse] = useState(false);
  const [courseToAdd, setCourseToAdd] = useState({});
  const { session, professorMode } = useAuth();
  const courses = [
    {
      id: "1",
      class_id: "100",
      course_name: "New Course 1",
    },
    {
      id: "2",
      class_id: "200",
      course_name: "New Course 2",
    },
  ];

  const handleDisplayCourse = async () => {
    if (!courseInput) {
      Alert.alert("Please input a course ID!");
      return;
    }

    let { data, error } = await supabase.rpc("get_course_by_code", {
      course_code_input: courseInput,
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    if (data && data.length > 0) {
      const course = data[0]; // Assuming the RPC returns an array of rows
      setCourseToAdd(course);
      setDisplayCourse(true);
      console.log("display ne: ", course);
    } else {
      Alert.alert("Course Not Found", "This course ID doesn't exist.");
      setDisplayCourse(false);
    }
  };

  const handleAddCourse = async () => {
    let { data, error } = await supabase.rpc("add_user_to_course", {
      course_id_input: courseToAdd.course_id,
      role_name_input: "student",
      user_id_input: session.user.id,
    });
    if (error) console.error(error);
    else {
      fetchCourses(session.user.email, professorMode ? "professor" : "student");
      Alert.alert(
        "Course Added",
        `${courseToAdd.course_name} has been added to your courses`
      );

      onClose();
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
            <Text style={styles.sheetHeader}>Add New Course</Text>
            <MaterialCommunityIcons
              onPress={toggleModal}
              name="close"
              size={24}
              color="#424242"
            />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <Text>Enter Course ID:</Text>
              <TextInput
                style={styles.input}
                placeholder="Course ID..."
                value={courseInput}
                onChangeText={setCourseInput}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleDisplayCourse}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
            {isCourseDisplayed && (
              <View style={[styles.card]}>
                <Text style={styles.courseName}>{courseToAdd.course_name}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleAddCourse}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default AddNewCourse;

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
