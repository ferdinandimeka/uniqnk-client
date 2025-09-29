import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatItemProps {
    userAvatar: React.ReactNode;
    userName: string;
    chat: string;
    chatCount: number;
}

export const ChatItem: React.FC<ChatItemProps> = ({ userAvatar, userName, chat, chatCount }) => {
    const router = useRouter();
    const navigateHandler = () => {
        router.push({
            pathname: "/messages/chat",
            params: {
                username: userName,
            }
        })
    }

    return (
    <TouchableOpacity onPress={navigateHandler} style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {userAvatar}
            <View style={styles.section}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: "#474A55", fontFamily: "Mulish" }}>{userName}</Text>
                <Text numberOfLines={2} style={styles.text}>{chat}</Text>
            </View>
        </View>

        <View style={{ alignSelf: "center" }}>
            {chatCount > 0 ? (
                <View
                style={{
                    backgroundColor: "#00A3FF",
                    width: 20,
                    height: 20,
                    borderRadius: 12, // half of width/height
                    justifyContent: "center",
                    alignItems: "center",
                }}
                >
                    <Text style={{ color: "#fff", fontSize: 12 }}>{chatCount}</Text>
                </View>
            ) : null}
        </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 16,
    },
    section: {
        flexDirection: "column",
        gap: 5
    },
    text: {
        fontSize: 13,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 16,
        width: 250,
        color: "#6B6F80"
    }
})
