import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const VetPendingScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Image source={require("../Assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Registration Pending</Text>
      <Text style={styles.subtitle}>
        Thank you for registering as a veterinarian. Your details have been submitted and are currently under review. You will be notified via email once your profile is approved.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#259D8A",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Poppins",
  },
  button: {
    backgroundColor: "#259D8A",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
});

export default VetPendingScreen;