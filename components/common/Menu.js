import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Image, Button, Text, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Menu() {
  const { userRole, professorMode, setProfessorMode, logout } = useAuth();
  const handleSwitchBetweenProfAndStudentMode = () => {
    setProfessorMode(!professorMode);
    Alert.alert(
      `You have switched to ${professorMode ? "student" : "professor"} mode`
    );
  };
  return (
    <DrawerContentScrollView style={styles.container}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={require("../../assets/profilePicture.png")}
        />
        <Text style={styles.nameText}>Thu Nguyen</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons
          style={styles.menuIcon}
          name="account-outline"
        />
        <Text style={styles.menuItemText}>Profile</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons style={styles.menuIcon} name="cog-outline" />
        <Text style={styles.menuItemText}>Setting</Text>
      </View>
      {userRole === "professor" && (
        <TouchableOpacity
          style={styles.row}
          onPress={handleSwitchBetweenProfAndStudentMode}
        >
          <MaterialCommunityIcons
            style={styles.menuIcon}
            name="account-switch-outline"
          />

          {professorMode ? (
            <Text style={styles.menuItemText}>Student Mode</Text>
          ) : (
            <Text style={styles.menuItemText}>Professor Mode</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.row} onPress={logout}>
        <MaterialCommunityIcons style={styles.menuIcon} name="logout" />
        <Text style={styles.menuItemText}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    gap: 10,
    paddingVertical: 14,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 35,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuIcon: {
    fontSize: 30,
    color: "#424242",
  },
  menuItemText: {
    fontSize: 18,
    color: "#424242",
  },
});
