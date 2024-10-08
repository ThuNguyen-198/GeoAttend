import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import Attendance from "./Attendance";
import Groups from "./Groups";
import Messages from "./Messages";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#013976",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
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
