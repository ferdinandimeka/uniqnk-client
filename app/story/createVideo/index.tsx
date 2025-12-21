import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import { BLACK, LIGHT_GREY, PRIMARY, WHITE } from "@/common/theming/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoryStore } from "@/store/useStoryStore";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft2, Gallery, TickCircle, Video as VideoIcon } from "iconsax-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function CreateVideoStory() {
  const [video, setVideo] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const { createStory } = useStoryStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user?._id;

  // ✅ Pick video from gallery
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri)
    }
  };

  // ✅ Record new video
  const recordVideo = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 30, // limit to 30s if desired
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  // ✅ Upload story
  const handleUpload = async () => {
    if (!video || !userId) return;

    setUploading(true);
    try {
      await createStory({
        user: userId,
        contentType: "video",
        contentUrl: video,
        text: caption || "",
      });

      router.back();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppScreen noPadding noSafeArea>
      <View style={styles.container0}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft2 size={24} color={WHITE} />
          </TouchableOpacity>
          <AppText variant="header2XlWhite">New Video Story</AppText>
          <TouchableOpacity onPress={handleUpload} disabled={!video || uploading}>
            <TickCircle
              size={26}
              color={!video ? LIGHT_GREY : "#40e0d0"}
              style={{ opacity: uploading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {!video ? (
            <View style={styles.selectionContainer}>
              <TouchableOpacity style={styles.option} onPress={pickVideo}>
                <Gallery size={36} color={PRIMARY} />
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={recordVideo}>
                <VideoIcon size={36} color={PRIMARY} />
                <Text style={styles.optionText}>Record a Video</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.previewContainer}>
              {/* Video Preview */}
              <Video
                source={{ uri: video }}
                style={styles.previewVideo}
                useNativeControls
                resizeMode="cover"
              />

              {/* Overlay gradient */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gradientOverlay}
              />

              {/* Caption Input */}
              <TextInput
                value={caption}
                onChangeText={setCaption}
                placeholder="Write something..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.captionOverlay}
                multiline
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    width,
    height,
    paddingTop: 50,
  },
  header: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionContainer: {
    alignItems: "center",
    gap: 30,
  },
  option: {
    alignItems: "center",
  },
  optionText: {
    marginTop: 10,
    color: BLACK,
    fontSize: 16,
    fontWeight: "500",
  },
  previewContainer: {
    width: "100%",
    alignItems: "center",
  },
  previewVideo: {
    width: "90%",
    height: 400,
    borderRadius: 20,
    marginBottom: 20,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  captionOverlay: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    textAlign: "center",
    color: WHITE,
    fontSize: 22,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
