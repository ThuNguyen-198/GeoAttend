import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GroupsScreen from "../Components/GroupsScreen";
import GroupDetails from "../Components/GroupDetails";
export default function GroupNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Groups">
      <Stack.Screen
        name="Groups"
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
