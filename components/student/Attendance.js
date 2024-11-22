import React, { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../backend/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
export default function Attendance() {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [attendanceList, setAttendanceList] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const previousAttendanceList = useRef(null);
  const { session } = useAuth();
  const user = session.user.email;
  console.log(JSON.stringify(user, null, 2));
  const courses = [
    {
      courseId: 1,
      course_name: "Advanced Database",
      attendance: [
        { date: "2024-08-24 10:00:00", presence: true },
        { date: "2024-08-31 10:05:00", presence: false },
        { date: "2024-09-07 10:02:00", presence: true },
        { date: "2024-09-14 10:00:00", presence: true },
      ],
    },
    {
      courseId: 2,
      course_name: "Capstone Project",
      attendance: [
        { date: "2024-08-24 10:00:00", presence: true },
        { date: "2024-08-31 10:05:00", presence: false },
        { date: "2024-09-07 10:02:00", presence: false },
        { date: "2024-09-14 10:00:00", presence: true },
      ],
    },
    {
      courseId: 3,
      course_name: "Advanced Algorithm",
      attendance: [
        { date: "2024-08-24 10:00:00", presence: true },
        { date: "2024-08-31 10:05:00", presence: true },
        { date: "2024-09-07 10:02:00", presence: true },
        { date: "2024-09-14 10:00:00", presence: true },
      ],
    },
  ];
  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };
  const getWeekDay = (datetimeString) => {
    const datetime = new Date(datetimeString);
    const weekday = datetime.toLocaleDateString("en-US", { weekday: "long" });
    return weekday;
  };
  const getDate = (datetimeString) => {
    const datetime = new Date(datetimeString);
    const date = datetime.toLocaleDateString("en-CA");
    return date;
  };
  const countAttendance = (attendaceList) => {
    const presence = attendaceList.filter((entry) => entry.presence === true);
    return presence.length + "/" + attendaceList.length;
  };
  const attendanceColor = (attendaceList) => {
    const presence = attendaceList.filter((entry) => entry.presence === true);
    if (presence.length / attendaceList.length === 1) return "green";
    else if (presence.length / attendaceList.length >= 0.75) return "yellow";
    else return "red";
  };

  // const fetchAttendanceList = async () => {
  //   if (
  //     !attendanceList ||
  //     JSON.stringify(previousAttendanceList.current) !==
  //       JSON.stringify(attendanceList)
  //   ) {
  //     setIsLoading(true);
  //   }
  //   let { data: attendance, error } = await supabase
  //     .from("groups")
  //     .select(
  //       "name AS group_name, email AS group_email, students:name AS student_name"
  //     )
  //     .join("student_courses", "groups.group", "student_courses.studentId")
  //     .join("students", "student_courses.studentId", "students.id")
  //     .eq("students.email", user);
  //   if (error) {
  //     setFetchError(error);
  //     setAttendanceList(null);
  //     console.log("error :", error);
  //     setIsLoading(false);
  //   } else if (attendance) {
  //     if (
  //       JSON.stringify(previousAttendanceList.current) !==
  //       JSON.stringify(attendance)
  //     ) {
  //       setAttendanceList(attendance);
  //       previousAttendanceList.current = attendance;
  //       console.log(attendanceList);
  //     }
  //     setFetchError(null);
  //   }
  //   setIsLoading(false);
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchAttendanceList();
  //   }, [])
  // );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={[styles.card, styles.row]}
              onPress={() => toggleCourse(item.courseId)}
            >
              <Text style={styles.courseName}>{item.course_name}</Text>
              <Text
                style={[
                  styles.attendanceCount,
                  attendanceColor(item.attendance) === "green"
                    ? styles.green
                    : attendanceColor(item.attendance) === "yellow"
                    ? styles.yellow
                    : styles.red,
                ]}
              >
                {countAttendance(item.attendance)}
              </Text>
              <MaterialCommunityIcons
                name={
                  expandedCourse === item.courseId
                    ? "chevron-up"
                    : "chevron-down"
                }
                style={styles.dropDownIcon}
              />
            </TouchableOpacity>

            {expandedCourse === item.courseId && item.attendance.length > 0 && (
              <FlatList
                data={item.attendance}
                renderItem={(
                  { item, index } // Change `member` to `item`
                ) => (
                  <View style={{ paddingHorizontal: 20 }}>
                    <View style={styles.attendanceRow}>
                      <View style={styles.pair}>
                        <Text style={styles.attendanceDate}>
                          {getWeekDay(item.date)}
                        </Text>
                        <Text style={styles.attendanceDate}>
                          {getDate(item.date)}
                        </Text>
                      </View>

                      <TouchableOpacity>
                        <MaterialCommunityIcons
                          name={item.presence ? "check" : "close"}
                          size={20}
                          color={item.presence ? "#13B307" : "red"}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: 0.6,
                        backgroundColor: "#d9d9d9",
                      }}
                    ></View>
                  </View>
                )}
                // keyExtractor={(item) =>
                //   `${item.date}-${item.presence}-${item.courseId}`
                // }
              />
            )}
          </View>
        )}
        // keyExtractor={(item) => item.courseId.toString()}
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
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
    borderWidth: 0,
    borderColor: "#A4A4A4",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseName: {
    fontSize: 18,
    color: "#013976",
  },
  dropDownIcon: {
    fontSize: 30,
    color: "#424242",
    paddingLeft: 30,
  },
  attendanceRow: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  attendanceDate: {
    fontSize: 16,
    color: "#424242",
  },
  attendanceCount: {
    color: "#13B307",
    fontSize: 20,
    fontWeight: "600",
  },
  green: {
    color: "#13B307",
  },
  yellow: {
    color: "#EFAB00",
  },
  red: {
    color: "#BE0319",
  },
});
