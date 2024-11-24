import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChatBubble = ({ role, parts , onSpeech }) => {
    console.log("ChatBubble text:", parts);
    return (
        <View
            style={[
                styles.chatItem,
                role === "user" ? styles.userChatItem : styles.modelChatItem,
            ]}
        >
            <Text style={styles.chatText}>{parts}</Text>
            {role === "model" && (
                <TouchableOpacity onPress={onSpeech} style={styles.speakerIcon}>
                    <Ionicons name="volume-high-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        minWidth: "75%",
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
    },
    userChatItem: {
        backgroundColor: "#007AFF",
        alignSelf: "flex-end",
    },
    modelChatItem: {
        backgroundColor: "#f0f0f0",
    },
    chatText: {
        fontSize: 16,
        color: "#333",
    },
    speakerIcon: {
        marginTop: 5,
        alignSelf: "flex-start",
    },
});

export default ChatBubble;
