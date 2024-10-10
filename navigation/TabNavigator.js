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
        headerShown: true,
        headerTitle: () => <CustomHeader />,
        headerStyle: { backgroundColor: "#013976" },
        headerTitleAlign: "left",
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
});
