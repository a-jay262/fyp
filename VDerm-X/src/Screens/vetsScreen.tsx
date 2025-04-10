/*import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const VetsScreen = ({ navigation }: { navigation: any }) => {
  const [search, setSearch] = useState("");
  const vets = [
    { id: "1", name: "Devesh Ojha", avatar: "https://via.placeholder.com/50" },
    { id: "2", name: "Sanjay Text", avatar: "https://via.placeholder.com/50" },
    { id: "3", name: "Mohit Jaiswal", avatar: "https://via.placeholder.com/50" },
    { id: "4", name: "Suresh Nair", avatar: "https://via.placeholder.com/50" },
    { id: "5", name: "Alex Dame", avatar: "https://via.placeholder.com/50" },
    { id: "6", name: "Stelli Forte", avatar: "https://via.placeholder.com/50" },
    { id: "7", name: "Aman Singh", avatar: "https://via.placeholder.com/50" },
    { id: "8", name: "Mohit Tyagi", avatar: "https://via.placeholder.com/50" },
    { id: "9", name: "Joshep", avatar: "https://via.placeholder.com/50" },
  ];

  const filteredVets = vets.filter((vet) =>
    vet.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderVet = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.vetItem}
    onPress={() => {
      navigation.navigate("UserAppointment");
    }}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.vetName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {}
      <View style={styles.headerContainer}>
        {}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, number..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        </View>

        {}
        <Text style={styles.header}>Vets</Text>
      </View>

      {}
      <FlatList
        data={filteredVets}
        renderItem={renderVet}
        keyExtractor={(item) => item.id}
        style={styles.vetsList}
      />

      {}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#A5A5A5" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Vets")} // Navigate to VetsScreen
        >
          <MaterialIcons name="pets" size={28} color="#259D8A" />
          <Text style={styles.activeNav}>Vets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate("Diagnosis")} // Navigate to VetsScreen
          >
          <MaterialIcons name="camera" size={28} color="#A5A5A5" />
          <Text style={styles.navText}>Diagnosis</Text>
        </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}
                onPress={() => navigation.navigate('RedZone')}
                >
                  <MaterialIcons name="error" size={24} color="#A5A5A5" />
                  <Text style={styles.navText}>Red Zones</Text>
                </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA", // Light gray background for the whole screen
  },
  headerContainer: {
    backgroundColor: "#A3D7D5", // Sea green background
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10, // Space below the sea-green section
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background for the search bar
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: 50,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 5,
  },
  searchIcon: {
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: 10, // Adjust margin for better spacing
  },
  vetsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  vetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background for vet items
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  vetName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
  activeNav:{
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

export default VetsScreen;*/
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "../config";
import { Picker } from '@react-native-picker/picker'; 
import UBottomTabBar from "./UBottomTabBar";

// Define the interface for the vet object
interface Vet {
  _id: string;
  name: string;
  email: string;
  qualification: string;
  certificate: string;
  contact: string;
  area: string;
  availability: string;
  imageUrl: string;
  approveStatus: boolean;
}

const VetsScreen = ({ navigation }: { navigation: any }) => {
  const [search, setSearch] = useState("");
  const [vets, setVets] = useState<Vet[]>([]); // Declare vets state with Vet[] type
  const [loading, setLoading] = useState(false);

  // Fetch vets from the backend
  const fetchVets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/vets/active`);
      setVets(response.data); // Assuming the API returns an array of vets
    } catch (error) {
      console.error("Error fetching vets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, []);

  // Filter vets based on the search input
  const filteredVets = vets.filter((vet) =>
    vet.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderVet = ({ item }: { item: Vet }) => (
    <TouchableOpacity
    style={styles.vetItem}
    onPress={() => {
      navigation.navigate("VetDetail", { vet: item });
    }}>

      <Image source={{ uri:`${BASE_URL}${item.imageUrl}` }} style={styles.avatar} />
      <View style={styles.vetDetails}>
        <Text style={styles.vetName}>{item.name}</Text>
        <Text style={styles.vetQualification}>{item.qualification}</Text>
        <Text style={styles.vetArea}>{item.area}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Sea Green Background Section */}
      <View style={styles.headerContainer}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, number..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        </View>

        {/* Header */}
        <Text style={styles.header}>Vets</Text>
      </View>

      {/* Loader while data is being fetched */}
      {loading ? (
        <ActivityIndicator size="large" color="#259D8A" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredVets}
          renderItem={renderVet}
          keyExtractor={(item) => item._id}
          style={styles.vetsList}
        />
      )}

      {/* Bottom Navigation */}
      <UBottomTabBar />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  headerContainer: {
    backgroundColor: "#A3D7D5",
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: 50,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 5,
  },
  searchIcon: {
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  vetsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  vetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  vetDetails: {
    flex: 1,
  },
  vetName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  vetQualification: {
    fontSize: 14,
    color: "#555",
  },
  vetArea: {
    fontSize: 12,
    color: "#888",
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
  activeNav: {
    fontSize: 12,
    color: "#259D8A",
    marginTop: 5,
  },
});

export default VetsScreen;
