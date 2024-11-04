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
import { supabase } from "../backend/supabase";
import React, { useEffect, useRef, useState } from "react";
import AddNewCourse from "./AddNewCourse";
import { useFocusEffect } from "@react-navigation/native";

export default function HomePage({ navigation }) {
  const [fetchError, setFetchError] = useState(null);
  const [courses, setCourses] = useState(null);
  const [isAddCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const previousCourses = useRef(null);

  const toggleAddCourseModal = () => {
    setAddCourseModalVisible(!isAddCourseModalVisible);
  };

  const fetchCourses = async () => {
    if (
      !courses ||
      JSON.stringify(previousCourses.current) !== JSON.stringify(courses)
    ) {
      setIsLoading(true);
    }
    let { data: course, error } = await supabase.from("course").select("*");
    if (error) {
      setFetchError(error);
      setCourses(null);
      console.log("error :", error);
      setIsLoading(false);
    } else if (course) {
      if (JSON.stringify(previousCourses.current) !== JSON.stringify(course)) {
        setCourses(course);
        previousCourses.current = course;
      }
      setFetchError(null);
    }
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <TouchableOpacity onPress={toggleAddCourseModal}>
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

      <AddNewCourse
        isVisible={isAddCourseModalVisible}
        onClose={() => {
          setAddCourseModalVisible(false);
        }}
        toggleModal={toggleAddCourseModal}
      />
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
