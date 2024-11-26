import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useLocation } from "../../context/LocationContext";
import MarkAttendanceModal from "./MarkAttendanceModal";
import { fetchCourseDetails } from "../../backend/supabase";


export default function CourseDetails() {
  const [markAttendanceIsOpen, setMarkAttendanceIsOpen] = useState(false);
  const [attendanceRecordIsOpen, setAttendanceRecordIsOpen] = useState(false);
  const [groupIsOpen, setGroupIsOpen] = useState(false);
  const [location, setLocation] = useState("Kent State University");
  const [code, setCode] = useState("");
  const { locationIsOn, turnOnLocation, turnOffLocation } = useLocation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [course, setCourse] = useState({});
  const route = useRoute();
  const { item } = route.params;
  
  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const data = await fetchCourseDetails(item.id);
            setCourse(data);
        } catch (error) {
            console.error("Error fetching course details:", error.message);
        }
    };

    fetchDetails();
  }, [item.id]);

  const handleLocation = () => {
    locationIsOn ? turnOffLocation() : turnOnLocation();
  };
  const onSubmitAttendance = () => {
    setCode("");
    Alert.alert("Attendance submitted!");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, styles.row, styles.borderLine]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.row}>
          <MaterialCommunityIcons name="plus" style={styles.itemIcon} />
          <Text style={styles.cardName}>Mark Attendance</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.row]}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="file-document-outline"
            style={styles.itemIcon}
          />
          <Text style={styles.cardName}>Attendance Record</Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-down"
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, styles.row]}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="account-group-outline"
            style={styles.itemIcon}
          />
          <Text style={styles.cardName}>Groups</Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-down"
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>
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
  markAttendanceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 22,
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
  cardName: {
    fontSize: 18,
    color: "#013976",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  text: {
    fontSize: 18,
    color: "#424242",
  },
  buttonCenter: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    textAlign: "center",
    backgroundColor: "#EFAB00",
    height: 46,
    width: 108,
    borderRadius: 14,
    paddingVertical: 10,
  },
  buttonDisabled: {
    textAlign: "center",
    backgroundColor: "#dbdbdb",
    height: 46,
    width: 108,
    borderRadius: 14,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: "#000",
    fontSize: 20,
    textAlign: "center",
  },
  buttonDisabledText: {
    color: "#a4a4a4",
    fontSize: 20,
    textAlign: "center",
  },
  borderLine: {
    borderWidth: 1,
    borderColor: "#EFAB00",
  },
});
