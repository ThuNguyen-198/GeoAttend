import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../Components/WelcomScreen";
import LoginScreen from "../Components/LoginScreen";
import RegisterScreen from "../Components/RegisterScreen";

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
