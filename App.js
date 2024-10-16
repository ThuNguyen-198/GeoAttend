import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import TabNavigator from "./navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import "./gesture-handler";
import { LocationProvider } from "./context/LocationContext";

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppNavigator />
      </LocationProvider>
    </AuthProvider>
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
