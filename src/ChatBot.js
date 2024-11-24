import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import ChatBubble from './ChatBubble.js';
import { speak, isSpeakingAsync, stop } from 'expo-speech';

const ChatBot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = "AIzaSyDLokc8wgg6FqMhGT6n-lmmC4IL2xo-QmQ";

    const handleUserInput = async () => {
        // Add user input to chat
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            }
        ];

        setLoading(true);

        try{
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    contents: updatedChat,
                }
            );
            console.log("Gemini Pro API Response:", response.data);
            const modelResponse = 
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "" ;
            
            if(modelResponse){
                //add model response
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ];

                setChat(updatedChatWithModel);
                setUserInput("");
            }
            } 
            catch (error) {
                console.error("Gemini Pro API Error:", error);
                console.error("Gemini Pro API Error Response:", error.response);
                setError("Sorry, something went wrong. Please try again later.");
            }
            finally {
                setLoading(false);
            }
    };
    const handleSpeech = async (text) => {
        if(isSpeaking){
            //if already speaking, stop
            stop();
            setIsSpeaking(false);
        }
        else{
            //if not speaking, start
            if(!await isSpeakingAsync()){
                speak(text);
                setIsSpeaking(true);
            }
        };
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble 
            role={item.role}
            parts={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chamod AI ChatBot</Text>

            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#aaa"
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleUserInput}
                >
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator style={styles.loading} color="#333"/>}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        minWidth: "95%",
        flex: 1,
        backgroundColor: "#f8f8f8",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        marginTop: 40,
        textAlign: "center",
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 25,
        padding: 8,
        color: "#333",
        backgroundColor: "#fff",
    },
    button: {
        padding: 10,
        backgroundColor: "#007AFF",
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
    },
    loading: {
        marginTop: 10,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
});

export default ChatBot;