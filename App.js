import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import TabNavigator from "./navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigation/AuthNavigator";

export default function App() {
  console.log("hello");

  return (
    <NavigationContainer>
      <AuthNavigator />
      {/* <TabNavigator /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
