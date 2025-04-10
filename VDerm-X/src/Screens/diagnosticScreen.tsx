import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import { BASE_URL } from "../config";
import * as Location from 'expo-location'; // To get user location, if needed.
import UBottomTabBar from "./UBottomTabBar";


const DiagnosticScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Diagnosis">>();

  const handleImagePick = async (type: "camera" | "gallery") => {
    try {
      // Request permissions if not already granted
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== "granted" || libraryPermission.status !== "granted") {
        Alert.alert("Permission Denied", "We need permission to access your camera and gallery.");
        return;
      }

      let result;
      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using the valid `MediaTypeOptions.Images`
          quality: 0.8, // Sets the image quality
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8, // Sets the image quality
        });
      }

      if (!result.canceled) {
        // Normalize the URI for consistency
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while selecting the image.");
      console.error(error);
    }
  };

  const uploadImageToAPI = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "image.jpg", // Modify if necessary
      type: "image/jpeg",
    } as any);

    setLoading(true); // Set loading to true when upload starts

    try {
      const response = await fetch(`${BASE_URL}/images/predicts`, {
        method: 'POST',
        body: formData, // Don't stringify FormData
      });

      const data = await response.json();
      console.log('Full Response:', data); // Log the data here
      //Alert.alert(data);
      if (response.ok) {
        // Extract the classification from the response
        const classification = data.prediction?.classification; // Access classification correctly
        Alert.alert(classification)
        // Show the classification result first
        if (classification === "Lumpy Skin") {
          Alert.alert(
            classification, // Shows "Lumpy Skin"
            "Image is detected as lumpy skin Now Do you want to mark this location as a Red Zone?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Proceed",
                onPress: async () => {
                  // After clicking Proceed, ask for location access
                  let { status } = await Location.requestForegroundPermissionsAsync();
                  if (status !== 'granted') {
                    Alert.alert("Permission Denied", "Location access is required to mark the Red Zone.");
                    return;
                  }
  
                  const location = await Location.getCurrentPositionAsync({});
                  const { latitude, longitude } = location.coords;
  
                  // Navigate to RedZone screen with location
                  navigation.navigate("RedZone");
                },
              },
            ]
          );
        } else if (classification === "Not Lumpy Skin") {
          Alert.alert("Image Prediction", "The image is not classified as Lumpy Skin.");
        }
      } else {
        Alert.alert("Error", data.message || "An error occurred.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload the image.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when the upload completes
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitial}>J</Text>
        </View>
        <Text style={styles.headerTitle}>Diagnosis</Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.instructions}>
          Diagnose your pet's condition by uploading an image
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleImagePick("camera")}
        >
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleImagePick("gallery")}
        >
          <Ionicons name="image" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#259D8A" />
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={uploadImageToAPI}
          >
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Navigation */}
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginRight: 120,
    marginTop: 40,
    color: "#259D8A",
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
    marginTop: 10,

  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#259D8A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: "#259D8A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
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
    color: "#259D8A",
    marginTop: 5,
  },
  navTextInactive: {
    fontSize: 12,
    color: "#A5A5A5",
    marginTop: 5,
  },
});

export default DiagnosticScreen;
