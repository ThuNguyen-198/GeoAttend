import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../components/common/WelcomScreen";
import LoginScreen from "../components/common/LoginScreen";
import RegisterScreen from "../components/common/RegisterScreen";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
