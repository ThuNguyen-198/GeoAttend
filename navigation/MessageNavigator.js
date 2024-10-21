import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageDetails from "../Components/MessageDetails";
import Messages from "../Components/Messages";
export default function MessageNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Messages"
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
