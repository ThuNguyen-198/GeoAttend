// navigation/AppNavigator.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";
import MenuDrawerNavigator from "./MenuDrawerNavigator";
import * as Linking from "expo-linking";

const AppNavigator = () => {
  const { session } = useAuth();
  // useEffect(() => {
  //   console.log("here's the session: ", JSON.stringify(session, null, 2));
  // }, [session]);

  useEffect(() => {
    const handleDeepLink = (event) => {
      const data = Linking.parse(event.url);
      console.log("Deep link data:", data);

      if (data.path === "auth/callback") {
        console.log("User came back from OAuth login");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? <MenuDrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

// // navigation/AppNavigator.js
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { useAuth } from "../context/AuthContext";
// import TabNavigator from "./TabNavigator";
// import AuthNavigator from "./AuthNavigator";
// import MenuDrawerNavigator from "./MenuDrawerNavigator";

// const AppNavigator = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <NavigationContainer>
//       {isAuthenticated ? <MenuDrawerNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
