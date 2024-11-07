import { ImageBackground, TouchableOpacity } from "react-native";
import { StyleSheet, View, Image, Text } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      // blurRadius={10}
      style={styles.background}
      source={require("../../assets/Background.jpeg")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/AppLogo.png")}
        />
        <Text style={styles.tagline}>GeoAttend</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.padding1} />
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.padding3} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 90,
    height: 90,
  },
  logoContainer: {
    position: "absolute",
    top: 150,
    alignItems: "center",
  },
  tagline: {
    fontSize: 40,
    fontWeight: "600",
    paddingVertical: 20,
    color: "yellow",
  },
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#FF9900",
  },
  secondaryButtonText: {
    color: "white",
  },
  padding1: {
    padding: 10,
  },
  padding3: {
    padding: 30,
  },
});
