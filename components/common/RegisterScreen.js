import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { supabase } from "../../backend/supabase";
import { CheckBox } from "react-native-elements";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProfessor, setIsProfessor] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = name && email && password;

  async function signUpWithEmail() {
    setLoading(true);
    const role = isProfessor ? "professor" : "student";
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { full_name: name, role: role },
      },
    });
    if (error) {
      Alert.alert(error.message);
    } else {
      navigation.navigate("Login");
      setEmail("");
      setPassword("");
    }
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  // const handleRegister = async () => {
  //   if (!isFormValid) {
  //     Alert.alert("Error", "Please fill out all fields");
  //     return;
  //   }

  //   try {
  //     // Query Supabase to check if the email already exists
  //     const { data: users, error } = await supabase
  //       .from("auth.users") // Use the auth.users table to query for existing users
  //       .select("email")
  //       .eq("email", email);

  //     if (error) throw error;

  //     if (users.length > 0) {
  //       // Email already exists
  //       Alert.alert(
  //         "Error",
  //         "This email is already registered. Please use another one."
  //       );
  //       return;
  //     }

  //     // Proceed with registration if email doesn't exist
  //     const { data, error: signUpError } = await supabase.auth.signUp({
  //       email: email,
  //       password: password,
  //       options: {
  //         data: { full_name: name },
  //       },
  //     });

  //     if (signUpError) {
  //       Alert.alert("Registration Error", signUpError.message);
  //     } else if (data.user) {
  //       Alert.alert("Registration Successful", `Welcome, ${name}`);
  //       navigation.navigate("Login");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert(
  //       "Error",
  //       "There was an issue checking your email. Please try again."
  //     );
  //   }
  // };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.title}>GeoAttend</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
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

          <CheckBox
            title="I am a professor"
            checked={isProfessor}
            onPress={() => setIsProfessor(!isProfessor)}
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
          />

          <TouchableOpacity
            style={[styles.button, isFormValid ? null : styles.buttonDisabled]}
            onPress={signUpWithEmail}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text>Already have an account?</Text>
            <Text
              style={styles.loginText}
              onPress={() => navigation.navigate("Login")}
            >
              Log in
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
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
  loginContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
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
  loginText: {
    color: "#EFAB00",
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default RegisterScreen;