import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import AppNavigator from "./navigation/AppNavigator";
import { useEffect } from "react";
import { Linking } from "react-native";
import { supabase } from "./backend/supabase";

export default function App() {
  // useEffect(() => {
  //   const handleUrl = (url) => {
  //     const { path } = Linking.parse(url);
  //     if (path === "auth") {
  //       supabase.auth.getSession().then(({ data }) => {
  //         if (data.session) {
  //           console.log("User is authenticated:", data.session.user);
  //         } else {
  //           console.log("User not authenticated");
  //         }
  //       });
  //     }
  //   };

  //   const linkingSubscription = Linking.addEventListener("url", handleUrl);

  //   return () => {
  //     linkingSubscription.remove();
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <AuthProvider>
        <LocationProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </LocationProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View, SafeAreaView } from "react-native";
// import TabNavigator from "./navigation/TabNavigator";
// import { NavigationContainer } from "@react-navigation/native";
// import AuthNavigator from "./navigation/AuthNavigator";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import AppNavigator from "./navigation/AppNavigator";
// import "./gesture-handler";
// import { LocationProvider } from "./context/LocationContext";

// export default function App() {
//   return (
//     <AuthProvider>
//       <LocationProvider>
//         <AppNavigator />
//       </LocationProvider>
//     </AuthProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
