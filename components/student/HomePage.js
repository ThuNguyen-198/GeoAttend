import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../backend/supabase";
import React, { useEffect, useRef, useState } from "react";
import AddNewCourse from "./AddNewCourse";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import CreateNewCourse from "../professor/CreateNewCourse";

export default function HomePage({ navigation }) {
  const [fetchError, setFetchError] = useState(null);
  const [courses, setCourses] = useState(null);
  const [isAddCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [isCreateCourseModalVisible, setCreateCourseModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const previousCourses = useRef(null);

  const { session, professorMode } = useAuth();
  console.log(JSON.stringify(session, null, 2));

  const toggleAddCourseModal = () => {
    setAddCourseModalVisible(!isAddCourseModalVisible);
  };
  const toggleCreateCourseModal = () => {
    setCreateCourseModalVisible(!isCreateCourseModalVisible);
  };
  const fetchCourses = async (email, role) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses(session.user.email, professorMode ? "professor" : "student");
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <TouchableOpacity
          onPress={
            professorMode ? toggleCreateCourseModal : toggleAddCourseModal
          }
        >
          <MaterialCommunityIcons name="plus" size={38} color="#949494" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#013976" style={styles.loader} />
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("CourseDetails", { item })}
              style={styles.card}
            >
              <Text style={styles.item}>{item.course_name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {professorMode ? (
        <CreateNewCourse
          isVisible={isCreateCourseModalVisible}
          onClose={() => {
            setCreateCourseModalVisible(false);
          }}
          toggleModal={toggleCreateCourseModal}
          fetchCourses={fetchCourses}
        />
      ) : (
        <AddNewCourse
          isVisible={isAddCourseModalVisible}
          onClose={() => {
            setAddCourseModalVisible(false);
          }}
          toggleModal={toggleAddCourseModal}
          fetchCourses={fetchCourses}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    marginHorizontal: 4,
  },
  item: {
    fontSize: 18,
    color: "#013976",
  },
});
