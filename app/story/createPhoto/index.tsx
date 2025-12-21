import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import { BLACK, LIGHT_GREY, PRIMARY, WHITE } from "@/common/theming/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoryStore } from "@/store/useStoryStore";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft2, Camera, Gallery, TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function CreatePhotoStory() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const { createStory } = useStoryStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user?._id;

  // ✅ Pick from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Take photo with camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Upload story
  const handleUpload = async () => {
    if (!image || !userId) return;

    setUploading(true);
    try {
      await createStory({
        user: userId,
        contentType: "image",
        contentUrl: image,
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
          <AppText variant="header2XlWhite">New Photo Story</AppText>
          <TouchableOpacity onPress={handleUpload} disabled={!image || uploading}>
            <TickCircle
              size={26}
              color={!image ? LIGHT_GREY : "#40e0d0"}
              style={{ opacity: uploading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {!image ? (
              <View style={styles.selectionContainer}>
                <TouchableOpacity style={styles.option} onPress={pickImage}>
                  <Gallery size={36} color={PRIMARY} />
                  <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={takePhoto}>
                  <Camera size={36} color={PRIMARY} />
                  <Text style={styles.optionText}>Take a Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.previewContainer}>
                {/* Image preview */}
                <Image source={{ uri: image }} style={styles.previewImage} />

                {/* Overlay gradient */}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={styles.gradientOverlay}
                />

                {/* Caption input */}
                <TextInput
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="Write a caption..."
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.captionOverlay}
                  multiline
                />
              </View>
            )}
          </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionContainer: {
    alignItems: "center",
    gap: 30,
    marginTop: 80,
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
  previewImage: {
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
