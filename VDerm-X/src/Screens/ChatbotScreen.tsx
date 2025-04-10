import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const RASA_SERVER_URL = "https://adab-35-203-132-100.ngrok-free.app/webhooks/rest/webhook"; // Update this with your actual Rasa server URL

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  // Function to send message to Rasa
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(RASA_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: input }),
      });

      const data = await response.json();
      if (data && data.length > 0) {
        setMessages((prevMessages) => [...prevMessages, userMessage, { sender: "bot", text: data[1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ]?.text || "No response" }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <View style={styles.container}>
      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={msg.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer}>
            <Text style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Field & Send Button */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 10 },
  chatContainer: { flex: 1, marginBottom: 10 },
  userMessageContainer: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 8, borderRadius: 8, marginVertical: 2, maxWidth: "75%" },
  botMessageContainer: { alignSelf: "flex-start", backgroundColor: "#E5E5EA", padding: 8, borderRadius: 8, marginVertical: 2, maxWidth: "75%" },
  userMessage: { color: "#000" },
  botMessage: { color: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 5 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, backgroundColor: "#FFF" },
  sendButton: { marginLeft: 10, backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 },
  sendButtonText: { color: "#FFF", fontWeight: "bold" },
});
