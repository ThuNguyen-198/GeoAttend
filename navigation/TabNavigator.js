import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../Components/HomePage";
import Attendance from "../Components/Attendance";
import GroupsScreen from "../Components/GroupsScreen";
import Messages from "../Components/Messages";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CourseNavigator from "./CourseNavigator";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import MarkAttendanceButton from "./MarkAttendanceButton";
import { useLocation } from "../context/LocationContext";
import MessageNavigator from "./MessageNavigator";
import GroupNavigator from "./GroupNavigator";

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();
  const { locationIsOn } = useLocation();
  const handleLocation = () => {
    Alert.alert("handle location here!");
  };
  const AppHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>GeoAttend</Text>
        <View style={styles.pair}>
          <MaterialCommunityIcons
            name={
              locationIsOn
                ? "map-marker-check-outline"
                : "map-marker-off-outline"
            }
            size={30}
            color="white"
            onPress={handleLocation}
          />
          <MaterialCommunityIcons
            name="menu"
            size={30}
            color="white"
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => <AppHeader />,
        headerStyle: { backgroundColor: "#013976" },
        headerTitleAlign: "space-between",
      }}
    >
      <Tab.Screen
        name="Home"
        component={CourseNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="check-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MarkAttendance"
        component={HomePage}
        options={{
          tabBarButton: (props) => (
            <MarkAttendanceButton {...props}></MarkAttendanceButton>
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="message-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EFAB00",
  },
  addButton: {
    borderRadius: 50,
    backgroundColor: "#0055a5",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "white",
  },
  pair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
