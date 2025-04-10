import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Image,
  Alert,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker'; 
import { BASE_URL } from "../config";
import { Ionicons } from "@expo/vector-icons";

const VetFormScreen = ({ navigation }: any) => {
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [area, setarea] = useState("");
  const [qualification, setQualification] = useState("");
  const [availability, setAvailability] = useState("");
  const [imageurl, setProfileImage] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(formTranslateY, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const pickImage = async (setter: React.Dispatch<React.SetStateAction<any>>) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.assets[0]);
    }
  };

  const handleVetFormSubmit = async () => {
    if (!username || !email || !password || !phoneNumber || !area || !qualification) {
      Alert.alert("Error", "All fields are required except availability.");
      return;
    }
  
    setLoading(true); // Start loading
    console.log("Submitting form..."); // Debugging log
  
    const formData = new FormData();
  
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("contact", phoneNumber);
    formData.append("qualification", qualification);
    formData.append("area", area);
  
    if (availability) {
      formData.append("availability", availability);
    }
  
   if (certificate) {
  formData.append("certificate", {
    uri: certificate.uri,
    type: "image/jpeg",
    name: "certificate.jpg",
  }as any);
}


if (imageurl) {
  formData.append("imageUrl", {
    uri: imageurl.uri,
    type: "image/jpeg",
    name: "profile.jpg",
  }as any);
}

  
    try {
      console.log("Sending form data to:", `${BASE_URL}/vets/createvets`);
      const response = await fetch(`${BASE_URL}/vets/createvets`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Form submitted successfully:", data);
        Alert.alert("Success", "Vet registration completed successfully. Wait for our email to successfully registering as Vet.");
        navigation.navigate("Home");
      } else {
        console.error("Error response from server:", data);
        Alert.alert("Error", data.message || "Failed to register vet.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
      console.log("Loading state reset");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require("../Assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Veterinarian Registration</Text>

        <TextInput style={styles.input} placeholder="Username" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Area" />
        <TextInput style={styles.input} placeholder="Availability (e.g., 9:00 AM - 5:00 PM)" />

       
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={qualification}
            onValueChange={(itemValue) => setQualification(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Qualification" value="" />
            <Picker.Item label="DVM (Doctor of Veterinary Medicine)" value="DVM" />
            <Picker.Item label="B.V.Sc (Bachelor of Veterinary Science)" value="BVSc" />
            <Picker.Item label="MVSc (Master of Veterinary Science)" value="MVSc" />
            <Picker.Item label="PhD in Veterinary Medicine" value="PhD" />
          </Picker>
        </View>

       
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setProfileImage)}>
          <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload Profile Image</Text>
        </TouchableOpacity>
        {imageurl && <Text style={styles.uploadText}>Profile Image Uploaded</Text>}

        <TouchableOpacity style={styles.uploadButton}  onPress={() => pickImage(setCertificate)}>
          <Ionicons name="document-attach-outline" size={20} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload Certificate</Text>
        </TouchableOpacity>
        {certificate && <Text style={styles.uploadText}>Certificate Uploaded</Text>}

       
        <TouchableOpacity
            style={[styles.submitButton, loading && { backgroundColor: "#b5e3d9" }]}
            onPress={loading ? undefined : handleVetFormSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#F7F8FA" },
  logo: { width: 120, height: 120, marginTop: 40, marginBottom: 20, resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "700", color: "#333", textAlign: "center", marginBottom: 20 },
  input: { height: 50, backgroundColor: "#F2F2F2", borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, width: "100%" },
  pickerContainer: { width: "100%", backgroundColor: "#F2F2F2", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  uploadButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#259D8A", paddingVertical: 12, borderRadius: 8, width: "100%", marginBottom: 10 },
  uploadButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  uploadText: { marginTop: 5, color: "#259D8A", fontSize: 14, fontWeight: "500" },
  submitButton: { backgroundColor: "#259D8A", paddingVertical: 15, borderRadius: 8, alignItems: "center", width: "100%" },
  submitButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },   passwordContainer: { position: "relative" },
  eyeIcon: { position: "absolute", right: 15, top: 15 },
});

export default VetFormScreen;