import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const VetScheduleScreen = ({ navigation }: { navigation: any }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [editingSlot, setEditingSlot] = useState<any>(null);  // State to track the slot being edited
  const [availableSlots, setAvailableSlots] = useState([
    { id: '1', day: 'Thursday', time: '5:00 PM - 9:00 PM' },
    { id: '2', day: 'Monday', time: '5:00 PM - 9:00 PM' },
  ]);

  const renderSlot = ({ item }: { item: { id: string; day: string; time: string } }) => (
    <View style={styles.slotCard}>
      <Text style={styles.slotText}>{item.day}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingSlot(item);  // Set the slot to be edited
            setModalVisible(true);
            setFromTime(new Date(`1970-01-01T${item.time.split(' - ')[0]}:00`)); // Add ":00" to make it a valid time
setToTime(new Date(`1970-01-01T${item.time.split(' - ')[1]}:00`)); // Add ":00" to make it a valid time

            setSelectedDay(item.day); // Set the day
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setAvailableSlots(availableSlots.filter(slot => slot.id !== item.id))}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddSlot = () => setModalVisible(true);

  const handleCancel = () => {
    setModalVisible(false);
    setShowFromPicker(false);
    setShowToPicker(false);
  };

  const handleDone = () => {
    setModalVisible(false);

    const newSlot = {
      id: editingSlot ? editingSlot.id : Math.random().toString(),
      day: selectedDay,
      time: `${fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
    };

    if (editingSlot) {
      // Update the slot if we're editing an existing one
      setAvailableSlots(availableSlots.map(slot => slot.id === editingSlot.id ? newSlot : slot));
    } else {
      // Add new slot
      setAvailableSlots([...availableSlots, newSlot]);
    }

    setEditingSlot(null); // Reset the editing state
  };

  const handleTimeChange = (event: any, selectedDate: Date | undefined, isFrom: boolean) => {
    if (selectedDate) {
      isFrom ? setFromTime(selectedDate) : setToTime(selectedDate);
    }
    isFrom ? setShowFromPicker(false) : setShowToPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" style={styles.arrow} />
        </TouchableOpacity>
        <Image source={require("../Assets/logo.png")} style={styles.logo} />
      </View>

      <Text style={styles.sectionTitle}>Available Slots</Text>
      <FlatList
        data={availableSlots}
        renderItem={renderSlot}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.slotList}
      />

      {/* Add Slot Button */}
      <TouchableOpacity style={styles.addSlotButton} onPress={handleAddSlot}>
        <Text style={styles.addSlotText}>Add New Slot</Text>
      </TouchableOpacity>

      {/* Modal for Time Selection */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <Text style={styles.modalTitle}>Select Day & Time Slot</Text>

            <Text style={styles.modalText}>Day:</Text>
            <Picker selectedValue={selectedDay} onValueChange={setSelectedDay}>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>

            {/* Time Selection */}
            <View style={styles.timeRow}>
              <Text style={styles.modalText}>From:</Text>
              <TouchableOpacity onPress={() => setShowFromPicker(true)}>
                <Text style={styles.timeText}>{fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.modalText}>To:</Text>
              <TouchableOpacity onPress={() => setShowToPicker(true)}>
                <Text style={styles.timeText}>{toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
              </TouchableOpacity>
            </View>

            {showFromPicker && (
              <DateTimePicker value={fromTime} mode="time" onChange={(event, date) => handleTimeChange(event, date, true)} />
            )}
            {showToPicker && (
              <DateTimePicker value={toTime} mode="time" onChange={(event, date) => handleTimeChange(event, date, false)} />
            )}

            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetHome')}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetSchedule')}>
          <Ionicons name="calendar-outline" size={24} color="#000" />
          <Text style={styles.navText}>My Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('RedZone')}>
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
    backgroundColor: '#E8F6F6',
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
  logo: {
    width: 100,
    marginTop: 40,
    marginRight: 120,
    height: 40,
    resizeMode: "contain",
  },
  arrow: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 10,
    color: '#259D8A',
  },
  slotList: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  slotCard: {
    backgroundColor: '#92d6d8',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 10,
    alignItems: 'flex-start',
    position: 'relative',
  },
  slotText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#f39c12',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
  addSlotButton: {
    backgroundColor: '#259D8A',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  addSlotText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  timeRow: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 10, 
  },
  timeText: {
    fontSize: 16,
    color: "#259D8A", // Match your theme color
    marginLeft: 10, // Creates spacing between label and time
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  
  cancelButton: {
    backgroundColor: "#ccc", // Gray for cancel
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  
  doneButton: {
    backgroundColor: "#259D8A", // Match theme
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1, // Ensures it's above other content
  },
});

export default VetScheduleScreen;