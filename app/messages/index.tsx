import { useRouter } from "expo-router";
import { ArrowSquareLeft, Search } from "iconsax-react-native";
import React from "react";
import {
    Dimensions,
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

const { width } = Dimensions.get("window");

const chats = [
    {id: "1", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "2", name: "Nkiru Onuehi", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "3", name: "Chidera Thomas", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "4", name: "Kunle Badmus", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "5", name: "Evans Kuka", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "6", name: "Eghosa Daupreye", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "7", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "8", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "9", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."},
    {id: "10", name: "Sarah Damian", message: "Lorem ipsum dolor sit amet consectetur. Viverra diam iaculis nunc pretium elit vitae. Sed commodo."}
]

const Messages = () => {
    const router = useRouter();
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
        
        <ScrollView>
            <View style={{  paddingHorizontal: 10, paddingTop: 10  }}>
                {chats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        userAvatar={<AvatarImage />}
                        userName={chat.name}
                        chat={chat.message}
                        chatCount={Math.floor(Math.random() * 10)}
                    />
                ))}
            </View>
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
