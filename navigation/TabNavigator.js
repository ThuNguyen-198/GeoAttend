import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../Components/HomePage";
import Attendance from "../Components/Attendance";
import Groups from "../Components/Groups";
import Messages from "../Components/Messages";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CourseNavigator from "./CourseNavigator";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();

  // Custom header component
  const CustomHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>GeoAttend</Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#013976",
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
          headerShown: true,
          headerTitle: () => <CustomHeader />,
          headerStyle: { backgroundColor: "#003366" },
          headerTitleAlign: "left",
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
        name="Groups"
        component={Groups}
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
        component={Messages}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#003366", // Header background color
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EFAB00", // Header text color
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
    color: "white", // Add button text color
  },
});
