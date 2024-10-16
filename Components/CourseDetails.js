import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";

export default function CourseDetails() {
  const [markAttendanceIsOpen, setMarkAttendanceIsOpen] = useState(false);
  const [attendanceRecordIsOpen, setAttendanceRecordIsOpen] = useState(false);
  const [groupIsOpen, setGroupIsOpen] = useState(false);
  const [locationIsOn, setLocationIsOn] = useState(false);
  const [location, setLocation] = useState("Kent State University");
  const [code, setCode] = useState("");
  const route = useRoute();
  const course = route.params;
  console.log(course);
  const onSubmitAttendance = () => {
    setCode("");
    Alert.alert("Attendance submitted!");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, styles.row]}
        onPress={() => setMarkAttendanceIsOpen(!markAttendanceIsOpen)}
      >
        <View style={styles.row}>
          <MaterialCommunityIcons name="plus" style={styles.itemIcon} />
          <Text style={styles.cardName}>Mark Attendance</Text>
        </View>

        <MaterialCommunityIcons
          name={markAttendanceIsOpen ? "chevron-up" : "chevron-down"}
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>
      {/* ----------------------------------------------------------- */}
      {markAttendanceIsOpen && (
        <View style={styles.markAttendanceContainer}>
          <View style={[styles.row, styles.paddingBottom]}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              style={styles.itemIcon}
            />
            <Text style={styles.text}>
              {locationIsOn ? (
                location
              ) : (
                <Text onPress={() => setLocationIsOn(!locationIsOn)}>
                  Turn on my location
                </Text>
              )}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter the code..."
            keyboardType="default"
            value={code}
            onChangeText={setCode}
          />
          <View style={styles.buttonCenter}>
            <TouchableOpacity
              style={
                locationIsOn && code
                  ? styles.submitButton
                  : styles.buttonDisabled
              }
              onPress={onSubmitAttendance}
            >
              <Text
                style={
                  locationIsOn && code
                    ? styles.submitButtonText
                    : styles.buttonDisabledText
                }
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* ----------------------------------------------------------- */}

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
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  paddingBottom: {
    paddingBottom: 16,
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
});
