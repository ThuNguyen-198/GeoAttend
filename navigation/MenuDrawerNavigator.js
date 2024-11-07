// navigation/MenuDrawerNavigator.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator"; // Import TabNavigator
import Menu from "../components/common/Menu";
import { useAuth } from "../context/AuthContext";
import ProfTabNavigator from "./ProfTabNavigator";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Drawer = createDrawerNavigator();

export default function MenuDrawerNavigator() {
  const { session, userRole, professorMode, isSignoutLoading } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      {isSignoutLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: "right",
          gestureEnabled: true,
          headerShown: false,
        }}
        drawerContent={() => <Menu />}
      >
        {userRole === "professor" && professorMode ? (
          <Drawer.Screen name="ProfTabNavigator" component={ProfTabNavigator} />
        ) : (
          <Drawer.Screen name="TabNavigator" component={TabNavigator} />
        )}
      </Drawer.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent white
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensure it appears above other elements
  },
});
