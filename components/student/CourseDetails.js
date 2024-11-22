import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import MarkAttendanceModal from "./MarkAttendanceModal";

export default function CourseDetails() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [course, setCourse] = useState({});
  const [expandedCards, setExpandedCards] = useState([]); // State to track expanded cards
  const route = useRoute();
  const { item } = route.params;

  useEffect(() => {
    setCourse(item);
  }, []);
  console.log(item);
  // Function to toggle card expansion
  const toggleCard = (index) => {
    setExpandedCards(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Remove index if it's already expanded
          : [...prev, index] // Add index if it's not expanded
    );
  };

  const cards = [
    {
      id: 1,
      title: "Mark Attendance",
      icon: "plus",
      expandable: false,
      onPress: () => setModalVisible(true),
    },
    {
      id: 2,
      title: "Attendance Record",
      icon: "file-document-outline",
      expandable: true,
      content: "Record details or actions go here.",
    },
    {
      id: 3,
      title: "Groups",
      icon: "account-group-outline",
      expandable: true,
      content: "Group details or actions go here.",
    },
    {
      id: 4,
      title: "Course Information",
      icon: "information-outline",
      expandable: true,
      content: item.course_code
        ? `Course ID: ${item.course_code}`
        : "This course does not have an ID",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity
              style={[styles.card, styles.row]}
              onPress={() =>
                item.expandable
                  ? toggleCard(index)
                  : item.onPress && item.onPress()
              }
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name={item.icon}
                  style={styles.itemIcon}
                />
                <Text style={styles.cardName}>{item.title}</Text>
              </View>
              {item.expandable && (
                <MaterialCommunityIcons
                  name={
                    expandedCards.includes(index)
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  style={styles.dropdownIcon}
                />
              )}
            </TouchableOpacity>

            {item.expandable && expandedCards.includes(index) && (
              <View style={styles.expandedContent}>
                <Text style={styles.text}>{item.content}</Text>
              </View>
            )}
          </>
        )}
      />
      <MarkAttendanceModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        course={course}
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardName: {
    fontSize: 18,
    color: "#013976",
  },
  dropdownIcon: {
    fontSize: 30,
    color: "#424242",
  },
  itemIcon: {
    fontSize: 26,
    color: "#424242",
    paddingRight: 10,
  },
  expandedContent: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginTop: -5,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#424242",
    letterSpacing: 1.3,
  },
});
