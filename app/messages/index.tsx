import AppText from "@/app/components/AppText";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { ArrowSquareLeft, Search } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Form, { FormInput } from "../components/AppForm";
import AppScreen from "../components/AppScreen";
import AvatarImage from "../components/AvatarImage";
import { ChatItem } from "../components/ChatItem";
import DecoratedTextField from "../components/DecoratedTextField";
import IconButton2 from "../components/IconButton2";
import Section from "../components/Section";

// const { width } = Dimensions.get("window");

// const chats = [
//     {id: "1", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "2", name: "Nkiru Onuehi", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "3", name: "Chidera Thomas", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "4", name: "Kunle Badmus", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "5", name: "Evans Kuka", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "6", name: "Eghosa Daupreye", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "7", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "8", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "9", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
//     {id: "10", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."}
// ]
type LastMessage = { text?: string };
    interface Chat {
        id: string;
        participants?: string[];
        lastMessage?: LastMessage[];
        [key: string]: any;
    }


const Messages = () => {
    const router = useRouter();
    const { chats, fetchUserChats, messages, fetchMessages } = useChatStore();
    const { users } = useAuthStore();
    const { getUserById } = useUserStore();
    const userId = users?.data.user._id;

    const [usersMap, setUsersMap] = useState<Record<string, any>>({});

    useEffect(() => {
        if (!userId) return; // wait until userId exists
        fetchUserChats(userId);
    }, [userId]);

    // console.log("userId before effect: ", userId);
    // console.log("chats before effect: ", chats);


   useEffect(() => {
  if (!userId || !chats?.length) return;

  const fetchUsers = async () => {
    const newUsers: Record<string, any> = {};

    await Promise.all(
      chats.map(async (chat) => {
        const otherId = chat.participants?.find(
          (id: string) => id !== userId
        );

        if (otherId && !usersMap[otherId]) {
          const userData = await getUserById(otherId);
          newUsers[otherId] = userData;
        }
      })
    );

    setUsersMap((prev) => ({ ...prev, ...newUsers }));
  };

  fetchUsers();
}, [chats, userId]);


    useEffect(() => {
        const fetchMessage = async () => {
            await fetchMessages(chats[0]?.id);
        }
        fetchMessage();
    }, [chats[0]?.id]);

    // console.log("messages: ", messages);

    const chatMessages = messages[chats[0]?.id] || [];
    // get messages by receiver
    const chatMessageByReceiver = chatMessages.filter((msg: any) => msg.receiver === userId);
    // Count unread messages (guard messages as an array before filtering)
    const unreadCount = (chatMessageByReceiver ?? []).filter((msg: any) => !msg.isRead).length || 0;
    const jsonChats = JSON.parse(JSON.stringify(chats, null, 2));
    console.log("jsonChats: ", jsonChats);
    // console.log("chatMessageByReceiver: ", chatMessageByReceiver);

  return (
    <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
        <Section
            as={SafeAreaView}
            style={{
                width: "100%",
                backgroundColor: "#fff",
                // elevation: 4,
                paddingBottom: 16,
                
                // borderWidth: 1,
            }}
        >
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowSquareLeft size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Direct Messages</Text>
                {/* Dummy spacer to balance the avatar on the right side */}
                <View style={{ width: 40 }}>
                    <Text style={{ fontSize: 14, color: "#2956f8ff" }}>Filter</Text>
                </View>
            </View>
        </Section>

        <Form>
            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: 10
                }}
            >
                <FormInput
                    as={DecoratedTextField}
                    name="search"
                    prefix={<IconButton2 icon={Search} size={15} />}
                    containerStyle={{ flex: 1 }}
                    outlined
                    noMargin
                    placeholder="Search"
                />
            </View>
        </Form>
        
        {/* <ScrollView>
            <View style={{  paddingHorizontal: 10, paddingTop: 10  }}>
                {(jsonChats as Chat[]).map((chat: Chat) => (
                    <ChatItem
                        key={chat.id}
                        id={chat.id}
                        senderId={chat.participants?.[1] || ""}
                        userAvatar={<AvatarImage image={{ uri: user?.profilePicture || "" }} />}
                        userName={user?.username || "Unknown"}
                        chat={chat.lastMessage?.[0]?.text || ""}
                        chatCount={unreadCount}
                    />
                ))}
            </View>
        </ScrollView> */}
        <ScrollView>
            { jsonChats.length > 0 ? (
                <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                {(jsonChats as Chat[]).map((chat: Chat) => {
                    const otherParticipantId =
                        chat.participants?.find((id: string) => id !== userId) || "";

                    const chatMessages = messages[chat.id] || [];

                    const lastReceivedMessage = chatMessages
                        .filter((msg: any) => msg.receiver === userId)
                        .sort(
                        (a: any, b: any) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )[0];

                    const unreadCount = chatMessages.filter(
                        (msg: any) => msg.receiver === userId && !msg.isRead
                    ).length;

                    const chatUser = usersMap[otherParticipantId];

                    return (
                        <ChatItem
                        key={chat.id}
                        id={chat.id}
                        senderId={otherParticipantId}
                        userAvatar={
                            <AvatarImage image={{ uri: chatUser?.profilePicture || "" }} />
                        }
                        userName={chatUser?.username || "Unknown"}
                        chat={lastReceivedMessage?.text || ""}
                        chatCount={unreadCount}
                        />
                    );
                })}
            </View>) : (
                <View style={{ position: "relative", alignItems: "center" }}>
                    <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: 250 }}>
                        <AppText variant="headerXlDark">No messages yet</AppText>
                    </View>
                </View>
            )}
        </ScrollView>

    </AppScreen>
    );
};

const styles = StyleSheet.create({
    modal: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#fff",
        padding: 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
    closeText: { fontSize: 20, color: "#fff" },
    content: { flex: 1, alignItems: "center", justifyContent: "center" },
    headerTitle: {
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
        fontFamily: "Mulish",
        fontWeight: "bold",
        textAlign: "center",
        color: "#474A55",
        flex: 1, // take remaining space to center properly
    }
});

export default Messages;
