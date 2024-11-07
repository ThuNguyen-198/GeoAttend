import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GroupsScreen from "../components/student/GroupsScreen";
import GroupDetails from "../components/student/GroupDetails";
export default function GroupNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Group">
      <Stack.Screen
        name="Group"
        component={GroupsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupDetails"
        component={GroupDetails}
        options={({ route }) => ({ title: route.params.item.groupName })}
      />
    </Stack.Navigator>
  );
}
