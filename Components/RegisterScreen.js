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
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = name && email && password;

  const handleRegister = () => {
    if (isFormValid) {
      Alert.alert("Registration Successful", `Welcome, ${name}`);
    } else {
      Alert.alert("Error", "Please fill out all fields");
    }
  };

  return (
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

        <TouchableOpacity
          style={[styles.button, isFormValid ? null : styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Register</Text>
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
