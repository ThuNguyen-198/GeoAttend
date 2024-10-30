import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";
import { supabase } from "../backend/supabase";
import { useEffect, useState } from "react";
import { supabase } from "../backend/supabase";

import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
export default function HomePage({ navigation }) {
const something = supabase .from("course").select('*');
  console.log(something)
  const [fetchError, setFetchError] = useState(null);
  const [courses, setCourses] = useState(null);
  // const courses = [
  //   { courseId: "112", courseName: "Advanced Database" },
  //   { courseId: "136", courseName: "Capstone Project" },
  //   { courseId: "143", courseName: "Advanced Algorithm" },
  // ];
  useEffect(() => {
    const fetchCourses = async () => {
      let { data: course, error } = await supabase.from("course").select("*");
      if (error) {
        setFetchError(error);
        setCourses(null);
        console.log("error :", fetchError);
      } else if (course) {
        setCourses(course);
        setFetchError(null);
      }
    };
    fetchCourses();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <MaterialCommunityIcons name="plus" size={38} color="#949494" />
      </View>

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
