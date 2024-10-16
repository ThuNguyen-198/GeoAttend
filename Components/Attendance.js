import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function Attendance() {
  const courses = [
    { courseName: "Advanced Database", numOfClass: 4, attended: 3 },
    { courseName: "Capstone Project", numOfClass: 8, attended: 8 },
    { courseName: "Advanced Algorithm", numOfClass: 8, attended: 4 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, styles.row]}>
            <Text style={styles.item}>{item.courseName}</Text>
            <View>
              <Text></Text>
              <MaterialCommunityIcons
                name="chevron-down"
                style={styles.dropdownIcon}
              />
            </View>
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
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
    borderWidth: 0.3,
    borderColor: "#A4A4A4",
  },
  item: {
    fontSize: 18,
    color: "#013976",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    gap: 10,
    paddingVertical: 14,
  },
  dropdownIcon: {
    fontSize: 30,
    color: "#424242",
  },
});
