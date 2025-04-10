import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

const UBottomTabBar = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Home">>();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#A5A5A5" />
        <Text style={styles.activeNav}>Chats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Vets")}>
        <MaterialIcons name="pets" size={28} color="#A5A5A5" />
        <Text style={styles.navTextInactive}>Vets</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Diagnosis")}>
        <MaterialIcons name="camera" size={28} color="#A5A5A5" />
        <Text style={styles.navText}>Diagnosis</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("RedZone")}>
        <Ionicons name="alert-circle-outline" size={24} color="#000" />
        <Text style={styles.navText}>RedZone</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  activeNav: {
    color: "#000",
    fontWeight: "bold",
  },
  navText: {
    color: "#A5A5A5",
  },
  navTextInactive: {
    color: "#A5A5A5",
  },
});

export default UBottomTabBar;
