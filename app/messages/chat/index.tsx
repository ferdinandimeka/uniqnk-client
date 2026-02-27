import AppButton from "@/app/components/AppButton";
import MediaBottomSheet from "@/app/components/MediaBottomSheet";
import { useOpenModal } from "@/app/components/ModalContext";
import VideoCallModal from "@/app/components/VideoCallModal";
import sendSound from "@/assets/sounds/send.wav";
import AppStyles from "@/common/theming/styles";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Add, ArrowSquareLeft, Call, CloseCircle, EmojiHappy, Microphone, MoneyRecive, Send, Video } from "iconsax-react-native";
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
import Form, { FormInput } from "../../components/AppForm";
import AppScreen from "../../components/AppScreen";
import AudioCallModal from "../../components/AudioCallModal";
import AvatarImage from "../../components/AvatarImage";
import DecoratedTextField from "../../components/DecoratedTextField";
import IconButton2 from "../../components/IconButton2";
import Section from "../../components/Section";

const Chat = () => {
  const router = useRouter();
  const { senderId, chatId } = useLocalSearchParams();
  console.log("chatId: ", chatId);
  const scrollViewRef = useRef<ScrollView>(null);
  const [text, setText] = useState("");
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sender, setSender] = useState<any>(null);
  const openModal = useOpenModal();

  const navigation = useRouter();

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const handleRoute = (route: string) => {
      handleClose();
      navigation.navigate(route as never); // 👈 adjust your route type
  };

  const { 
    messages: storeMessages,
    fetchMessages,
    sendMessage,
    createChat,
    loading,
  } = useChatStore();
  const { users } = useAuthStore();
  const { getUserById } = useUserStore();

  useEffect(() => {
    if (!senderId) return;

    const fetchUser = async () => {
      const data = await getUserById(senderId as string);
      setSender(data);
      console.log("Fetched sender data:", data);
    };

    fetchUser();
  }, [senderId]);

    
  const { connectSocket, disconnectSocket, socket, setTyping, selectedChatId } = useChatStore();
  // const currentUserId = useAuthStore.getState().users?.data.user._id;
  const currentUserId = users?.data.user._id;
  const username = sender?.username ?? "Unknown User"
  const profilePicture = sender?.profilePicture || "";

  useEffect(() => {
    if (!currentUserId) return;
    connectSocket(currentUserId);
    return () => disconnectSocket();
  }, [currentUserId]);

  // Get messages for the current chat
  const messages = storeMessages[chatId as string] || [];
  console.log("messages: ", messages);

  const playSound = async (file: any) => {
    const { sound } = await Audio.Sound.createAsync(file);
    await sound.playAsync();
  };

  const formatTime = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const toggleMedia = () => {
    if (isMediaOpen) {
      setIsMediaOpen(false);
    } else {
      openModal(MediaBottomSheet, {
        onDismiss: () => setIsMediaOpen(false),
        onSendMessage: (msgText: string) => sendMessages(msgText),
      });
      setIsMediaOpen(true);
    }
  };

  const sendMessages = async (msgText?: string) => {
    const finalText = (msgText ?? text).trim();
    if (!finalText  || !currentUserId || !senderId) return;

    try {
      let activeChatId = chatId as string | undefined;
      console.log("activeChatId before creation: ", activeChatId);

      if (!activeChatId) {
        const newChat = await createChat([currentUserId, senderId as string]);
        console.log("New chat created:", newChat);
      
        if (!newChat) {
          console.error("Failed to create chat");
          return;
        }

        activeChatId = newChat.data.id;

        // Update route so future messages use existing chat
        // router.setParams({ chatId: activeChatId });
      }
      console.log("activeChatId before sending message: ", activeChatId);
      await sendMessage(
        activeChatId as string,
        currentUserId as string, // ✅ sender
        senderId as string,      // ✅ receiver
        finalText,
        []
      );

      // console.log("Send message response:", response.data || response);
      playSound(sendSound);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (text: string) => {
    if (!selectedChatId || !socket) return;

    // Emit typing state
    socket.emit("typing", {
      chatId: selectedChatId,
      senderId: currentUserId,
      isTyping: text.length > 0,
    });

    // Optionally, update local state
    setTyping(selectedChatId, text.length > 0);
  };

  // Fetch messages when chat opens
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId as string);
    }
  }, [chatId]);

  // Scroll to bottom whenever new messages come in
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
        <Section as={SafeAreaView} style={{ backgroundColor: "#fff", paddingBottom: 16 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowSquareLeft size={24} color="#000" />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                <AvatarImage image={{ uri: profilePicture ?? "" }} size={30} />
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
          {loading && <Text style={{ textAlign: "center", color: "#999" }}>Loading messages...</Text>}

          {selectedChatId && useChatStore.getState().typing[selectedChatId] && (
            <Text style={{ fontStyle: "italic", color: "#555" }}>
              Typing...
            </Text>
          )}


          {messages.map((msg) => {
            const isMe = msg.sender === currentUserId;
            return (
              <View key={msg.id}>
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.myMessage : styles.theirMessage,
                  ]}
                >
                  {!isMe && (
                    <Text style={styles.sender}>
                      {Array.isArray(username) ? username[0] : username}
                    </Text>
                  )}
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
                <Text
                  style={[
                    styles.timestamp,
                    isMe ? { textAlign: "right" } : { textAlign: "left" },
                  ]}
                >
                  {formatTime(msg.createdAt || msg.updatedAt)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={{ backgroundColor: "#fff" }}>
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
                onChangeText={(text) => {
                  setText(text);
                  handleTyping(text);
                }}
                outlined
                noMargin
                placeholder="Type something here..."
                value={text}
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
                onPress={() => sendMessages()}
                loading={false}
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
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    marginBottom: 3,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#EAEEFF",
    borderBottomStartRadius: 12,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F1FBFF",
    borderBottomEndRadius: 12,
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
