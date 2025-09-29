import AppButton from "@/app/components/AppButton";
import MediaBottomSheet from "@/app/components/MediaBottomSheet";
import { ModalArgs, useOpenModal } from "@/app/components/ModalContext";
import receiveSound from "@/assets/sounds/receive.wav";
import sendSound from "@/assets/sounds/send.wav";
import AppStyles from "@/common/theming/styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Add, ArrowSquareLeft, Call, CloseCircle, EmojiHappy, Microphone, MoneyRecive, Send, Video } from "iconsax-react-native";
import { nanoid } from "nanoid/non-secure";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
// import { Portal } from 'react-native-portalize';
import VideoCallModal from "@/app/components/VideoCallModal";
import Form, { FormInput } from "../../components/AppForm";
import AppScreen from "../../components/AppScreen";
import AudioCallModal from "../../components/AudioCallModal";
import AvatarImage from "../../components/AvatarImage";
import DecoratedTextField from "../../components/DecoratedTextField";
import IconButton2 from "../../components/IconButton2";
import Section from "../../components/Section";

// const { width } = Dimensions.get("window");
type MediaBottomSheetProps = ModalArgs & {
  onSendMessage?: (text: string) => void; // 👈 optional
};


type User = { id: string; name: string };
type ChatMessage = { id: string; user: User; text: string, timestamp: string; };

const Chat = () => {
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const openModal = useOpenModal();

    const [visible, setVisible] = useState(false);
    const navigation = useRouter();

    const handleOpen = () => setVisible(true);
    const handleClose = () => setVisible(false);

    const handleRoute = (route: string) => {
        handleClose();
        navigation.navigate(route as never); // 👈 adjust your route type
    };


    const toggleMedia = () => {
        if (isMediaOpen) {
            setIsMediaOpen(false);
        } else {
            openModal<MediaBottomSheetProps>(MediaBottomSheet, {
            onDismiss: () => setIsMediaOpen(false),
            onSendMessage: (msgText: string) => {  // 👈 pass callback
                sendMessage(msgText);
            },
            });
            setIsMediaOpen(true);
        }
    };

    const playSound = async (file: any) => {
        const { sound } = await Audio.Sound.createAsync(file);
        await sound.playAsync();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    const currentUser: User = {
        id: "me",
        name: "Me",
    };

    const sendMessage = (messageText?: string) => {
        const finalText = (messageText ?? text).trim();
        if (!finalText) return;

        const msg: ChatMessage = {
            id: nanoid(),
            user: currentUser,
            text: finalText,
            timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, msg]);
        setText("");

        playSound(sendSound);

        setTimeout(() => {
            const reply: ChatMessage = {
            id: nanoid(),
            user: {
                id: "other",
                name: Array.isArray(username) ? username[0] : (username as string),
            },
            text: "Got your message: " + msg.text,
            timestamp: formatTime(new Date()),
            };
            setMessages((prev) => [...prev, reply]);
            playSound(receiveSound);
        }, 1500);
    };

    useEffect(() => {
        return () => {
            Audio.Sound.createAsync(sendSound).then(({ sound }) => sound.unloadAsync());
            Audio.Sound.createAsync(receiveSound).then(({ sound }) => sound.unloadAsync());
        };
    }, []);


    // Auto scroll to bottom when new message is added
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
                {/* Header */}
                <Section
                    as={SafeAreaView}
                    style={{
                        width: "100%",
                        backgroundColor: "#fff",
                        paddingBottom: 16,
                    }}
                >
                    <View style={styles.header}>
                        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <ArrowSquareLeft size={24} color="#000" />
                            </TouchableOpacity>

                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                <AvatarImage size={25} />
                                <Text style={styles.headerTitle}>
                                    {Array.isArray(username) ? username[0] : username}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => openModal(VideoCallModal, {})}>
                                <Video size={20} color="#6B6F80" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openModal(AudioCallModal, {})}>
                                <Call size={20} color="#6B6F80" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRoute("/payment")}>
                                <MoneyRecive size={20} color="#6B6F80" />
                            </TouchableOpacity>

                            <View>
                                {/* Trigger icon */}
                                <MaterialCommunityIcons
                                    onPress={handleOpen}
                                    name="dots-vertical"
                                    size={20}
                                    color="#6B6F80"
                                />

                                {/* Dropdown modal */}
                                <Modal
                                    transparent
                                    visible={visible}
                                    animationType="fade"
                                    onRequestClose={handleClose}
                                >
                                    <TouchableWithoutFeedback onPress={handleClose}>

                                    <View style={styles.backdrop}>
                                        <TouchableWithoutFeedback>
                                            <View style={styles.dropdown}>
                                                <TouchableOpacity
                                                    style={styles.item}
                                                    onPress={() => handleRoute("Profile")}
                                                >
                                                    <Text style={styles.label}>View profile</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.item}
                                                    onPress={() => handleRoute("Settings")}
                                                >
                                                    <Text style={styles.label}>Search</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.item}
                                                    onPress={() => handleRoute("Settings")}
                                                >
                                                    <Text style={styles.label}>Mute notifications</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.item}
                                                    onPress={() => handleRoute("Settings")}
                                                >
                                                    <Text style={styles.label}>Report</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.item}
                                                    onPress={() => handleRoute("Logout")}
                                                >
                                                    <Text style={styles.label}>Block</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    </TouchableWithoutFeedback>
                                </Modal>
                            </View>
                            {/* <TouchableOpacity>
                                <MaterialCommunityIcons name="dots-vertical" size={20} color="#6B6F80" />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </Section>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1, backgroundColor: "#F1F4FF" }}
                    contentContainerStyle={{ padding: 10 }}
                >
                    {messages.map((msg) => {
                        const isMe = msg.user.id === currentUser.id;
                        return (
                            <View
                                key={msg.id}
                            >
                                <View
                                    style={[
                                        styles.messageBubble,
                                        isMe ? styles.myMessage : styles.theirMessage,
                                    ]}
                                >
                                    {!isMe && <Text style={styles.sender}>{msg.user.name}</Text>}
                                    <Text style={styles.messageText}>{msg.text}</Text>
                                </View>

                                <Text style={[styles.timestamp, isMe ? { textAlign: "right" } : { textAlign: "left" }]}>
                                    {msg.timestamp}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Input Bar */}
                <View style={{ backgroundColor: "#fff"}}>
                    <Form>
                        <View
                            style={[
                                AppStyles.row,
                                { alignItems: "center", gap: 8, padding: 10 },
                            ]}
                        >
                            <FormInput
                                as={DecoratedTextField}
                                name="comment"
                                prefix={<IconButton2 icon={EmojiHappy} size={24} color="#999" />}
                                containerStyle={{ flex: 1 }}
                                onChangeText={setText}
                                outlined
                                noMargin
                                placeholder="Type something here..."
                                value={text}
                                // ✅ suffix icons (Plus/Close + Mic)
                                suffix={
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <TouchableOpacity onPress={toggleMedia} style={{ marginLeft: -30 }}>
                                        {isMediaOpen ? (
                                            <CloseCircle size={24} color="#999" />
                                        ) : (
                                            <Add size={24} color="#999" />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => console.log("🎤 Start recording")}>
                                        <Microphone size={24} color="#999" />
                                    </TouchableOpacity>
                                </View>
                                }
                            />
                            <AppButton
                                prefixIcon={Send}
                                style={{ width: 48, height: 48 }}
                                fontSize={24}
                                onPress={() => sendMessage()}
                            />
                        </View>
                    </Form>
                </View>
            </AppScreen>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Mulish",
        color: "#474A55",
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 12,
        marginBottom: 3,
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#EAEEFF",
    },
    theirMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#F1FBFF",
    },
    sender: {
        fontSize: 12,
        color: "gray",
        marginBottom: 2,
    },
    messageText: {
        fontSize: 14,
        color: "#555",
    },
    timestamp: {
        fontSize: 10,
        color: "#999",
        marginTop: 2,
        marginBottom: 10,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "transparent", // keep it clear but still dismiss on tap
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingTop: 70, // adjust depending on header
        paddingRight: 12,
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        minWidth: 150,
    },
    item: {
        padding: 12,
    },
    label: {
        fontSize: 16,
        color: "#333",
    },
});

export default Chat;
