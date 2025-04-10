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
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetSchedule')}>
                <Ionicons name="calendar-outline" size={24} color="#000" />
                <Text style={styles.navText}>My Schedule</Text>
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
