import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../config";

const VetDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { vet } = route.params; // Get vet details from navigation params
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleBookEvent = async () => {
    if (!name || !email ) {
      Alert.alert("Error", "Please enter both name and email, and select an event.");
      return;
    }


    const message = `User ${name} (${email}) has booked the Appointment: }`;

    try {
      const response = await fetch(`${BASE_URL}/vets/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Your event has been booked!");
        setModalVisible(false);
        setName("");
        setEmail("");
      } else {
        Alert.alert("Error", data.message || "Failed to book event.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
    }
  };
  const handleConfirm = () => {
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    setModalVisible(false);
    Alert.alert("Appointment Pending", "Wait for Vet's Approval You will get the confirmational email");
  };
  return (
    <View style={styles.container}>
      {/* Vet Image */}
      <Image source={{ uri:`${BASE_URL}${vet.imageUrl}` }} style={styles.vetImage} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.vetName}>{vet.name}</Text>
        <Text style={styles.vetQualification}>{vet.qualification}</Text>
        <Text style={styles.vetArea}>📍 {vet.area}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>📧 Email:</Text>
          <Text style={styles.infoText}>{vet.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>📞 Contact:</Text>
          <Text style={styles.infoText}>{vet.contact}</Text>
        </View>


        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>⏳ Availability:</Text>
          <Text style={styles.infoText}>{vet.availability}</Text>
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <TouchableOpacity style={styles.bookButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your Email to Confirm</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
             <Text style={styles.modalTitle}>Enter your Name to Confirm</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  vetImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginTop:40
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 50,
  },
  detailsContainer: {
    padding: 20,
  },
  vetName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  vetQualification: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  vetArea: {
    fontSize: 16,
    color: "#777",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
  },
  bookButton: {
    backgroundColor: "#259D8A",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  bookButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#259D8A",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
});

export default VetDetailScreen;
