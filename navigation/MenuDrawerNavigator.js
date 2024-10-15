// navigation/MenuDrawerNavigator.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator"; // Import TabNavigator
import Menu from "../Components/Menu";

const Drawer = createDrawerNavigator();

export default function MenuDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        gestureEnabled: true,
        headerShown: false,
      }}
      drawerContent={() => <Menu />}
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
    </Drawer.Navigator>
  );
}
