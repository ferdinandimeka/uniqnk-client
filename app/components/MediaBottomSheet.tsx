// GiftModal.tsx
import AppButton from "@/app/components/AppButton";
import AppStyles from "@/common/theming/styles";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Locations from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { Camera, CloseCircle, DocumentText1, EmojiHappy, Gallery, Headphone, Location, Microphone, Send, Video } from "iconsax-react-native";
import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Form, { FormInput } from "./AppForm";
import DecoratedTextField from "./DecoratedTextField";
import IconButton2 from "./IconButton2";
import { ModalArgs, useOpenModal } from "./ModalContext";

// MediaBottomSheet.tsx
type MediaBottomSheetProps = ModalArgs & {
  onSendMessage: (text: string) => void; // 👈 callback from Chat
};

const MediaBottomSheet: React.FC<MediaBottomSheetProps> = ({ dismiss, visible, onSendMessage }) => {
  // const router = useRouter();
  const { username } = useLocalSearchParams();
  const [text, setText] = useState("");
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const openModal = useOpenModal();

    // 📄 Document
const handlePickDocument = async () => {
  const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
  if (!result.canceled) {
    console.log("Picked document:", result);
    onSendMessage(`📄 Sent document: ${result.assets[0].name}`);
    dismiss();
  }
};

// 🖼️ Gallery
const handlePickGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });
  if (!result.canceled) {
    console.log("Picked from gallery:", result);
    onSendMessage(`🖼️ Sent image from gallery`);
    dismiss();
  }
};

// 📷 Camera
const handlePickCamera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });
  if (!result.canceled) {
    console.log("Captured with camera:", result);
    onSendMessage(`📷 Sent camera capture`);
    dismiss();
  }
};

// 🎧 Audio (basic recorder start/stop)
const [recording, setRecording] = useState<Audio.Recording | null>(null);

const handleStartRecording = async () => {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    await rec.startAsync();
    setRecording(rec);
  } catch (err) {
    console.error("Recording failed", err);
  }
};

const handleStopRecording = async () => {
  if (!recording) return;
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  console.log("Recorded audio at", uri);
  onSendMessage(`🎧 Sent audio recording`);
  setRecording(null);
  dismiss();
};

// 🎥 Video → (use gallery/camera but filter to video)
const handlePickVideo = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    quality: 1,
  });
  if (!result.canceled) {
    console.log("Picked video:", result);
    onSendMessage(`🎥 Sent video`);
    dismiss();
  }
};

// 📍 Location
const handlePickLocation = async () => {
  let { status } = await Locations.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission denied");
    return;
  }
  let loc = await Locations.getCurrentPositionAsync({});
  console.log("Location:", loc);
  onSendMessage(`📍 Location: (${loc.coords.latitude}, ${loc.coords.longitude})`);
  dismiss();
};


    const handleSend = () => {
      if (!text.trim()) return;
      onSendMessage(text.trim()); // 👈 call parent’s sendMessage
      setText(""); // reset input
      dismiss(); // optionally close sheet
    };

    return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={dismiss}
    >
      <Pressable style={styles.overlay} onPress={dismiss} />
      <View style={styles.sheet}>
        <View style={styles.border} />

        <View style={{ backgroundColor: "#fff" }}>
          <View style={{ paddingHorizontal: 60, justifyContent: "center", alignItems: "center", paddingVertical: 20, gap: 20, flexDirection: "row", flexWrap: "wrap" }}>
            <TouchableOpacity style={{ flexDirection: "column", gap: 3 }} onPress={handlePickDocument}>
              <View style={{ backgroundColor: "#D6FFE6", padding: 12, borderRadius: 100 }}>
                <DocumentText1 size={24} color="#101D55" variant="Bold" />
              </View>

              <Text style={{ color: "#101D55", fontSize: 11, fontWeight: 500, alignSelf: "center" }}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "column", gap: 3 }} onPress={handlePickGallery}>
              <View style={{ backgroundColor: "#FFDBD6", padding: 12, borderRadius: 100 }}>
                <Gallery size={24} color="#101D55" variant="Bold" />
              </View>

              <Text style={{ color: "#101D55", fontSize: 11, fontWeight: 500, alignSelf: "center" }}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "column", gap: 3 }} onPress={handlePickCamera}>
              <View style={{ backgroundColor: "#FFFDD6", padding: 12, borderRadius: 100 }}>
                <Camera size={24} color="#101D55" variant="Bold" />
              </View>

              <Text style={{ color: "#101D55", fontSize: 11, fontWeight: 500, alignSelf: "center" }}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "column", gap: 3 }} 
              onPress={recording ? handleStopRecording : handleStartRecording}>
              <View style={{ backgroundColor: "#FCD6FF", padding: 12, borderRadius: 100 }}>
                <Headphone size={24} color="#101D55" variant="Bold" />
              </View>
              <Text style={styles.label}>{recording ? "Stop Audio" : "Audio"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "column", gap: 3 }}  onPress={handlePickVideo}>
              <View style={{ backgroundColor: "#D6D7FF", padding: 12, borderRadius: 100 }}>
                <Video size={24} color="#101D55" variant="Bold" />
              </View>

              <Text style={{ color: "#101D55", fontSize: 11, fontWeight: 500, alignSelf: "center" }}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "column", gap: 3 }}  onPress={handlePickLocation}>
              <View style={{ backgroundColor: "#FFD6E2", padding: 12, borderRadius: 100 }}>
                <Location size={24} color="#101D55" variant="Bold" />
              </View>

              <Text style={{ color: "#101D55", fontSize: 11, fontWeight: 500, alignSelf: "center" }}>Location</Text>
            </TouchableOpacity>
          </View>

          <Form>
            <View style={[AppStyles.row, { alignItems: "center", gap: 8, padding: 0 }]}>
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
                suffix={
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <TouchableOpacity onPress={dismiss} style={{ marginLeft: -30 }}>
                      <CloseCircle size={24} color="#999" />
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
                onPress={handleSend}
              />
            </View>
          </Form>
        </View>
      </View>
    </Modal>
  );
};

export default MediaBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "60%",
  },
  border: {
    borderTopWidth: 5,
    borderTopColor: "#D9D9D9",
    marginBottom: 20,
    width: 70,
    alignSelf: "center",
    borderRadius: 25,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
    color: "#474A55",
    fontFamily: "Mulish",
  },
  content: {
    flexDirection: "column",
    gap: 4,
    width: "70%"
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Mulish",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#384CFF",
  },
   buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    backgroundColor: "#F1F4FF",
  },
  button2: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    backgroundColor: "#384CFF",
  },
  label: {
    color: "#101D55",
    fontSize: 11,
    fontWeight: "500",
    alignSelf: "center",
  },

});
