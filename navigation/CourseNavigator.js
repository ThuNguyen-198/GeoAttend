import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../Components/HomePage";
import CourseDetails from "../Components/CourseDetails";
export default function CourseNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Courses">
      <Stack.Screen
        name="Courses"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetails}
        options={({ route }) => ({ title: route.params.item.courseName })}
      />
    </Stack.Navigator>
  );
}
