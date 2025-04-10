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
import UBottomTabBar from "./UBottomTabBar";
import axios from "axios";
require('dotenv').config();

const OPENAI_API_KEY = process.env.API_KEY;
const OPENAI_DEPLOYMENT_URL = "https://vderm-x.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2025-01-01-preview";

const openAIRequest = async (prompt: string) => {
  try {
    const requestData = {
      messages: [
        { role: "system", content: "You are a helpful assistant that answers questions about pet diseases." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await axios.post(OPENAI_DEPLOYMENT_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": OPENAI_API_KEY,
      },
    });

    const reply = response.data.choices?.[0]?.message?.content;
    return reply || "I didn't quite catch that. Can you rephrase?";
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("🛑 OpenAI Error:", err.response?.data || err.message);
    } else {
      console.error("🛑 Unknown Error:", err);
    }
    return "Sorry, something went wrong with the AI.";
  }
};

const RASA_SERVER_URL = "https://adab-35-203-132-100.ngrok-free.app/webhooks/rest/webhook"; // Update this with your actual Rasa server URL

const HomeScreen = ({ route }: { route: any }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Home">>();

  // Function to send message to Rasa
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      const botReply = await openAIRequest(input);
  
      const botMessage = { sender: "bot", text: botReply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, I couldn’t get a response." },
      ]);
    }
  
    setInput("");
  };  

  return (


    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitial}>J</Text>
        </View>
        <Image
          source={require("../Assets/logo.png")}
          style={styles.logo}
        />
      </View>
      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer}>
        <Text style={styles.instructions}>
          {"Ask anything about your pet 🐾"}
        </Text>
        {messages.map((msg, index) => (
          <View key={index} style={msg.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer}>
            <Text style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Field & Send Button 
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message..." />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>*/}

      {/* Chat Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type your question..."
          placeholderTextColor="#000"
        />
        <TouchableOpacity style={styles.searchButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar (Kept as it is) */}
      <UBottomTabBar />
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
    marginTop: 20,
    marginBottom: 20,

  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#A3D7D5",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10
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
  activeNav: {
    fontSize: 12,
    color: "#A5A5A5",
    marginTop: 5,
  },
  userMessageContainer: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 8, borderRadius: 8, marginVertical: 2, maxWidth: "75%" },
  botMessageContainer: { alignSelf: "flex-start", backgroundColor: "#E5E5EA", padding: 8, borderRadius: 8, marginVertical: 2, maxWidth: "75%" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 5 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, backgroundColor: "#FFF" },
  sendButton: { marginLeft: 10, backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 },
  sendButtonText: { color: "#FFF", fontWeight: "bold" },
});

export default HomeScreen;
