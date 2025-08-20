import AppButton from "@/app/components/AppButton";
import AppStyles from "@/common/theming/styles";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ArrowRight2, Gift, Heart, People, Send, Smileys, UserAdd } from "iconsax-react-native";
import { nanoid } from "nanoid/non-secure";
import React, { useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Form, { FormInput } from "./AppForm";
import AvatarImage from "./AvatarImage";
import DecoratedTextField from "./DecoratedTextField";
import GiftBottomSheet from "./GiftBottomSheet";
import IconButton2 from "./IconButton2";
import { useOpenModal } from "./ModalContext";

// ✅ Reaction buttons (icon + label)
const REACTIONS = [
  { key: "like", icon: Heart, label: "Like" },
  { key: "gift", icon: Gift, label: "Gift" },
  { key: "arrow", icon: ArrowRight2, label: "Share" },
  { key: "people", icon: People, label: "Viewers" },
  { key: "account", icon: UserAdd, label: "Follow" },
];

// ✅ Floating emojis mapped to labels
const REACTION_EMOJIS: Record<string, string> = {
  Like: "❤️",
  Share: "➡️",
  Viewers: "👥",
  Follow: "➕",
};

type User = { id: string; name: string; };
type ChatMessage = { id: string; user: User; text: string; };
type LiveStreamChatProps = { currentUser: User; };

export default function LiveStreamChat({ currentUser }: LiveStreamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [floatingReactions, setFloatingReactions] = useState<
    { id: string; emoji: string; anim: Animated.Value }[]
  >([]);
  const openModal = useOpenModal()

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: nanoid(),
      user: currentUser,
      text: text.trim(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const triggerReaction = (label: string) => {
    if (label === "Gift") {
      openModal(GiftBottomSheet, {}) // 🎁 open bottom sheet
      return;
    }

    const emoji = REACTION_EMOJIS[label];
    if (!emoji) return;

    const id = nanoid();
    const anim = new Animated.Value(0);
    setFloatingReactions((prev) => [...prev, { id, emoji, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    });
  };

  return (
    <BottomSheetModalProvider>
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Floating Emoji Reactions */}
          {floatingReactions.map((r) => (
            <Animated.Text
              key={r.id}
              style={{
                position: "absolute",
                bottom: 100,
                right: 40,
                fontSize: 28,
                transform: [
                  {
                    translateY: r.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -200],
                    }),
                  },
                  {
                    translateX: r.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 60 - 30],
                    }),
                  },
                  {
                    scale: r.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.8],
                    }),
                  },
                ],
                opacity: r.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              }}
            >
              {r.emoji}
            </Animated.Text>
          ))}

          {/* Chat Messages */}
          <FlatList
            data={messages.slice(-5)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", marginVertical: 6, gap: 6 }}>
                <AvatarImage bordered image={null} size={30} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontWeight: "bold", color: "#8F94AA", fontSize: 11 }}>
                    {item.user.name}
                  </Text>
                  <Text style={{ color: "#F7F7FF", fontSize: 11 }}>{item.text}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingBottom: 60,
              marginTop: 400,
            }}
          />

          {/* Reaction Buttons */}
          <View style={styles.reactionBar}>
            {REACTIONS.map((reaction) => {
              const Icon = reaction.icon;
              return (
                <TouchableOpacity
                  key={reaction.key}
                  onPress={() => triggerReaction(reaction.label)}
                  style={styles.reactionBtn}
                >
                  <Icon size={20} color="white" variant="Bold" />
                  <Text style={styles.reactionLabel}>{reaction.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Input Bar */}
          <Form>
            <View
              style={[
                AppStyles.row,
                { paddingBottom: 10, alignItems: "center", gap: 8, marginBottom: 20, margin: 10 },
              ]}
            >
              <FormInput
                as={DecoratedTextField}
                name="comment"
                prefix={<IconButton2 icon={Smileys} size={24} />}
                containerStyle={{ flex: 1 }}
                onChangeText={setText}
                outlined
                noMargin
                placeholder="Write a comment"
                value={text}
              />
              <AppButton
                prefixIcon={Send}
                style={{ width: 48, height: 48 }}
                fontSize={24}
                onPress={sendMessage}
              />
            </View>
          </Form>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  reactionBar: {
    position: "absolute",
    right: 10,
    bottom: 130,
    alignItems: "center",
  },
  reactionBtn: {
    alignItems: "center",
    marginVertical: 6,
  },
  reactionLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  sheetContent: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  giftRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  giftItem: {
    alignItems: "center",
  },
});
