import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function Attendance() {
  const [expandedCourse, setExpandedCourse] = useState(null);
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
        { date: "2024-09-07 10:02:00", presence: true },
        { date: "2024-09-14 10:00:00", presence: true },
      ],
    },
    {
      courseId: 3,
      course_name: "Advanced Algorithm",
      attendance: [
        { date: "2024-08-24 10:00:00", presence: true },
        { date: "2024-08-31 10:05:00", presence: false },
        { date: "2024-09-07 10:02:00", presence: true },
        { date: "2024-09-14 10:00:00", presence: true },
      ],
    },
  ];
  const toggleGroup = (courseId) => {
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
              onPress={() => toggleGroup(item.courseId)}
            >
              <Text style={styles.courseName}>{item.course_name}</Text>

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
                        <TextEncoderStream style={styles.attendanceDate}>
                          {getDate(item.date)}
                        </TextEncoderStream>
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
});
