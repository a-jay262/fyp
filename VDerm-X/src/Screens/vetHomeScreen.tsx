import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("Chats");
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState([
    { type: "user", text: "What food is best for my dog?" },
    { type: "bot", text: "It depends on your dog's breed, age, and health. A balanced diet with proteins, fats, and carbs is essential. " },
    { type: "user", text: "How often should I take my cat to the vet?" },
    { type: "bot", text: "A routine check-up every 6-12 months is ideal. If your cat shows signs of illness, visit the vet sooner. " }
  ]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Home">>();

  // Ref for ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle user input and bot response
  const handleSend = () => {
    if (userQuery.trim() === "") return;

    // You can replace the botResponse with an API call or more complex logic
    const botResponse = "This is a dynamic response based on your query! ";

    // Add user's message and bot's response to the chat history
    setMessages(prevMessages => [
      ...prevMessages,
      { type: "user", text: userQuery },
      { type: "bot", text: botResponse }
    ]);
    setUserQuery(""); // Clear input field after sending
  };

  // Scroll to bottom whenever a new message is added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Depend on messages so it triggers after each update

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitial}>J</Text>
        </View>
        <Image
          source={require("../Assets/logo.png")} // Replace with your logo path
          style={styles.logo}
        />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Chats" && styles.activeTab]}
          onPress={() => setActiveTab("Chats")}
        >
          <Text
            style={[styles.tabText, activeTab === "Chats" && styles.activeTabText]}
          >
            ChatBot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Appointments" && styles.activeTab]}
          onPress={() => {
            setActiveTab("Appointments");
            navigation.navigate("VetAppointment");
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Appointments" && styles.activeTabText,
            ]}
          >
            Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Instructions Text */}
        <Text style={styles.instructions}>
          {userQuery.trim() === "" ? "Ask anything about your pet " : ""}
        </Text>


        {/* Chat Messages */}
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg, index) => (
            <View key={index} style={msg.type === "user" ? styles.userMessage : styles.botMessage}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={userQuery}
            onChangeText={setUserQuery}
            placeholder="Type your question..."
            placeholderTextColor="#A3D7D5"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("UserChat")}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#A5A5A5" />
          <Text style={styles.activeNav}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Vets")}
        >
          <MaterialIcons name="pets" size={28} color="#A5A5A5" />
          <Text style={styles.navTextInactive}>Vets</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("RedZone")}
        >
          <Ionicons name="alert-circle-outline" size={24} color="#000" />
          <Text style={styles.navText}>Red Zones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
  },
  profileIcon: {
    width: 40,
    height: 40,
    marginTop: 40,
    backgroundColor: "#259D8A",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  logo: {
    width: 100,
    marginTop: 40,
    marginRight: 120,
    height: 40,
    resizeMode: "contain",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    marginTop: 10,
    elevation: 2,
  },
  tab: {
    paddingVertical: 12,
    width: "50%",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#259D8A",
  },
  tabText: {
    fontSize: 16,
    color: "#A5A5A5",
  },
  activeTabText: {
    color: "#259D8A",
    fontWeight: "600",
  },
  activeNav: {
    fontSize: 12,
    color: "#A5A5A5",
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#A3D7D5",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#259D8A",
    padding: 10,
    borderRadius: 25,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#A5A5A5",
    marginTop: 5,
  },
  navTextInactive: {
    fontSize: 12,
    color: "#A5A5A5",
    marginTop: 5,
  },

  chatContainer: {
    width: "100%",
    marginBottom: 20,
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "75%",
  },

  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "75%",
  },

  messageText: {
    fontSize: 16,
    color: "#333",
  },
});
export default HomeScreen