import AppText from "@/app/components/AppText";
import { PRIMARY, WHITE } from "@/common/theming/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoryStore } from "@/store/useStoryStore";
import { useRouter } from "expo-router";
import { ArrowLeft2, TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const BACKGROUND_COLORS = [
  "#004C99",
  "#FF5F6D",
  "#FFC371",
  "#43C6AC",
  "#191654",
  "#833ab4",
  "#fcb045",
  "#000000",
  "#FFFFFF",
];

export default function CreateTextStoryScreen() {
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState(BACKGROUND_COLORS[0]);
  const [textColor, setTextColor] = useState(WHITE);
  const [alignment, setAlignment] = useState<"center" | "left" | "right">(
    "center"
  );
  const router = useRouter();
  const { createStory } = useStoryStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user._id;

  const handleShareStory = async() => {
    if (!text.trim()) return;
    // handle story upload logic here
    console.log("Story created:", { text, bgColor, textColor, alignment });
    const story = {
      user: userId,
      contentType: "text",
      text: text,
      backgroundColor: bgColor
    }
    console.log("story: ", story)
    await createStory(story);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft2 size={26} color={WHITE} />
        </TouchableOpacity>
        <AppText variant="body1White" style={styles.headerText}>
          Create Text Story
        </AppText>
        <TouchableOpacity onPress={handleShareStory}>
          <TickCircle size={26} color={WHITE} />
        </TouchableOpacity>
      </View>

      {/* Text Input */}
      <View style={[styles.textArea, { justifyContent: alignment }]}>
        <TextInput
          placeholder="Start typing..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          multiline
          textAlign={alignment}
          style={[styles.textInput, { color: textColor }]}
          value={text}
          onChangeText={setText}
        />
      </View>

      {/* Alignment Options */}
      <View style={styles.alignmentRow}>
        {["left", "center", "right"].map((align) => (
          <TouchableOpacity
            key={align}
            onPress={() => setAlignment(align as any)}
            style={[
              styles.alignButton,
              alignment === align && { backgroundColor: "rgba(255,255,255,0.3)" },
            ]}
          >
            <AppText
              variant="body1White"
              style={{ textTransform: "capitalize" }}
            >
              {align}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Background Color Selector */}
      <View style={styles.colorSelector}>
        <FlatList
          data={BACKGROUND_COLORS}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.colorCircle,
                { backgroundColor: item },
                item === bgColor && styles.selectedColor,
              ]}
              onPress={() => {
                setBgColor(item);
                setTextColor(item === "#FFFFFF" ? "#000" : WHITE);
              }}
            />
          )}
        />
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: WHITE }]}
        onPress={handleShareStory}
      >
        <AppText variant="body1" style={{ color: PRIMARY }}>
          Share to Story
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  textArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "500",
    width: "90%",
  },
  alignmentRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  alignButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: WHITE,
  },
  colorSelector: {
    marginBottom: 30,
    height: 50,
  },
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: WHITE,
  },
  shareButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
});
