

import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { BASE_URL } from '../config';
interface Vet {
  _id: string;
  name: string;
  qualification: string;
  certificate: string;
  imageUrl: string;
  status: number;
  email: string;
  contact: number;
  area: string;
  availability: string
}
const VetListPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [vets, setVets] = useState<Vet[]>([]);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/vets/nonactive`);
        const data = await response.data;

        if (Array.isArray(data)) {
          setVets(data);
        } else {
          console.error('Received data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching vets:', error);
      }
    };

    fetchVets();
  }, []);



  const handleApprove = async (id: string) => {
    try {
      // Step 1: Approve the vet via PUT request
      const response = await axios.put(`${BASE_URL}/vets/${id}/approve`);
  
      if (response.status === 200) {
        // Step 2: Update vet status in the frontend
        const updatedVets = vets.map((vet) =>
          vet._id === id ? { ...vet, status: 1 } : vet
        );
        setVets(updatedVets);
  
        // Step 3: Get vet info for sending the email
        const approvedVet = updatedVets.find((vet) => vet._id === id);
  
        // Step 4: Send notification email to the approved vet
        if (approvedVet) {
          await axios.post(`${BASE_URL}/vets/send-notification`, {
            email: approvedVet.email,
            name: approvedVet.name,
            message: `Hello ${approvedVet.name}, your vet account has been approved successfully. You can now access all features of the app.`,
          });
        }
  
        alert('Vet approved and notification email sent.');
      } else {
        console.error('Failed to approve vet');
      }
    } catch (error) {
      console.error('Error during approval or sending notification:', error);
      alert('Something went wrong while approving the vet.');
    }
  };
  
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vet List</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {vets && vets.length > 0 ? (
          vets.map((vet) => (
            <View key={vet._id} style={styles.card}>
              <Text style={styles.name}>{vet.name}</Text>
              <Text style={styles.details}>Qualification: {vet.qualification}</Text>
              <Text style={styles.details}>Availability: {vet.availability}</Text>
              <Text style={styles.details}>Email: {vet.email}</Text>
              <Text style={styles.details}>Contact: {vet.contact}</Text>
              <Text style={styles.details}>Area: {vet.area}</Text>

              <TouchableOpacity onPress={() => handleImagePress(`${BASE_URL}${vet.imageUrl}`)}>
                <Image source={{ uri: `${BASE_URL}${vet.imageUrl}` }} style={styles.avatar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleImagePress(`${BASE_URL}${vet.certificate}`)}>
                <Image source={{ uri: `${BASE_URL}${vet.certificate}` }} style={styles.avatar} />
              </TouchableOpacity>

              <View style={styles.buttons}>
                <Button
                  title="Approve"
                  onPress={() => handleApprove(vet._id)}
                  disabled={vet.status === 1}  // Disable button if already approved
                  color="#259D8A"
                />
              </View>
            </View>
          ))
        ) : (
          <Text>No vets available</Text>
        )}
      </ScrollView>

      {/* Modal to display zoomed-in image */}
      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
            <Image source={{ uri: selectedImage }} style={styles.zoomedImage} />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  avatar: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    marginTop:40
  },
  header: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  details: {
    fontSize: 15,
    color: '#000',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain', // Fit the image within the modal
  },
});

export default VetListPage;
