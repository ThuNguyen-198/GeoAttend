import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../backend/supabase";
import { Session } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { BlurView } from "@react-native-community/blur";
import { loginUser } from "../../backend/supabase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, login, signInWithGoogle } = useAuth();

  const isFormValid = email && password;
  const handleLogin = () => {
    Alert.alert("Error", "Please enter both email and password");
  };

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    else {
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  }
  const handleMicrosoftLogin = () => {
    Alert.alert("Login with Microsoft", "Microsoft login functionality");
  };

  const handleGoogleLogin = async () => {
    await performOAuth();
  };
  WebBrowser.maybeCompleteAuthSession(); // required for web only
  const redirectTo = makeRedirectUri();

  // adddition from sashank 
  // const handleLogin = async () => {
  //   try {
  //       const user = await loginUser({ email, password });
  //       console.log("User logged in:", user);
  //   } catch (error) {
  //       Alert.alert("Login failed", error.message);
  //   }
  // };

  const createSessionFromUrl = async (url) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    console.log("session data: ", data);
    return data.session;
  };

  const performOAuth = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo
    );

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
    }
  };

  // const sendMagicLink = async () => {
  //   const { error } = await supabase.auth.signInWithOtp({
  //     email: "example@email.com",
  //     options: {
  //       emailRedirectTo: redirectTo,
  //     },
  //   });

  //   if (error) throw error;
  //   // Email sent.
  // };
  const url = Linking.useURL();
  console.log(url);
  if (url) createSessionFromUrl(url);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {/* Show loading indicator */}
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <Text style={styles.title}>GeoAttend</Text>

        <TextInput
          style={styles.input}
          placeholder="Email@address.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, isFormValid ? null : styles.buttonDisabled]}
          onPress={signInWithEmail}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        {/* Line separator with "OR" */}
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Microsoft login button */}
        <TouchableOpacity
          style={styles.microsoftButton}
          onPress={handleMicrosoftLogin}
        >
          <Text style={styles.microsoftButtonText}>Log in with Microsoft</Text>
        </TouchableOpacity>

        {/* Google login button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleButtonText}>Log in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text>Don't have an account?</Text>
          <Text
            style={styles.signupText}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#fff",
  },
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
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 66,
    textAlign: "center",
    color: "#013976",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#0066FF",
    opacity: 0.5,
  },
  // Line separator styles
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#666",
  },

  microsoftButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  microsoftButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  googleButton: {
    backgroundColor: "#DB4437",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: "center",
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#0066FF",
    textAlign: "center",
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#EFAB00",
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default LoginScreen;
