import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageDetails from "../components/student/MessageDetails";
import Messages from "../components/student/Messages";
export default function MessageNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Message">
      <Stack.Screen
        name="Message"
        component={Messages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessageDetails"
        component={MessageDetails}
        options={({ route }) => ({ title: route.params.item.userName })}
      />
    </Stack.Navigator>
  );
}
