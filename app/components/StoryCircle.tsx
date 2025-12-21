import { PRIMARY, WHITE } from "@/common/theming/colors";
import { LinearGradient } from "expo-linear-gradient";
import { AddCircle } from "iconsax-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface StoryCircleProps {
  image: string;
  username: string;
  isUser?: boolean;
  onPress?: () => void;
}

export default function StoryCircle({ image, username, isUser, onPress }: StoryCircleProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: "center", width: 70 }}>
      <LinearGradient
        colors={isUser ? [WHITE, PRIMARY] : [ PRIMARY, "#080707ff", "#40e0d0"]}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: WHITE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {<Image
            source={{ uri: image ? image : "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
          />}
          {isUser && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: PRIMARY,
                borderRadius: 10,
                padding: 2,
              }}
            >
              <AddCircle size={14} color={"#40e0d0"} />
            </View>
          )}
        </View>
      </LinearGradient>
      <Text style={{ fontSize: 12, marginTop: 4, textAlign: "center" }} numberOfLines={1}>
        {isUser ? "Your Story" : username}
      </Text>
    </TouchableOpacity>
  );
}
