import { WHITE } from "@/common/theming/colors";
import { Video } from "expo-av";
import { ArrowLeft } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Modal, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface Story {
  _id?: string;
  type: "text" | "image" | "video";
  text?: string;
  backgroundColor?: string;
  mediaUrl?: string; // image or video URL
}

interface StoryViewerProps {
  visible: boolean;
  onClose: () => void;
  stories: Story[];
  username: string;
  userPhoto: string;
}

export default function StoryViewerModal({
  visible,
  onClose,
  stories,
  username,
  userPhoto,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentStory = stories[currentIndex];

  // ✅ Reset to first story every time modal opens
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 < stories.length) {
          return prev + 1;
        } else {
          // Stop incrementing when done
          clearInterval(interval);
            setTimeout(() => {
            onClose(); // ✅ safely close after the last story
          }, 400);
          return prev;
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [visible, stories.length]);

  if (!visible || !currentStory) return null;

  const renderStoryContent = () => {
    switch (currentStory.type) {
      case "text":
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: currentStory.backgroundColor || "#000",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: WHITE,
                fontSize: 28,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {currentStory.text}
            </Text>
          </View>
        );

      case "image":
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: currentStory.mediaUrl }}
            style={{ width, height, resizeMode: "cover" }}
          />

          {/* Caption overlay */}
          {currentStory.text ? (
            <View
              style={{
                position: "absolute",
                bottom: 100,
                left: 20,
                right: 20,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <Text
                style={{
                  color: WHITE,
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "500",
                  textShadowColor: "rgba(0,0,0,0.8)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {currentStory.text}
              </Text>
            </View>
          ) : null}
        </View>
      );


      case "video":
        return (
          <Video
            source={{ uri: currentStory.mediaUrl }}
            style={{ width, height }}
            shouldPlay
            resizeMode="cover"
            isLooping
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {renderStoryContent()}

        {/* Header */}
        <View
          style={{
            position: "absolute",
            top: height * 0.08,
            left: 20,
            right: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft size={24} color={WHITE} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: userPhoto }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginLeft: 10,
              }}
            />
            <Text
              style={{
                color: WHITE,
                fontWeight: "bold",
                marginLeft: 8,
                fontSize: 16,
              }}
            >
              {username}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            position: "absolute",
            top: height * 0.05,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
            paddingHorizontal: 10,
          }}
        >
          {stories.map((_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 3,
                backgroundColor: index <= currentIndex ? WHITE : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}
