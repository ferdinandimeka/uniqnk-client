import { PRIMARY, WHITE } from "@/common/theming/colors";
import { Camera, Edit2, Image as ImageIcon } from "iconsax-react-native";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "./AppText";

interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
  userImage: string;
  onSelectOption?: (option: "text" | "photo" | "video") => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  visible,
  onClose,
  userImage,
  onSelectOption,
}) => {
  const options = [
    {
      title: "Create a text story",
      subtitle: "Share a thought, quote, or feeling",
      icon: <Edit2 size={24} color={PRIMARY} />,
      value: "text",
    },
    {
      title: "Create a photo story",
      subtitle: "Upload from gallery",
      icon: <ImageIcon size={24} color={PRIMARY} />,
      value: "photo",
    },
    {
      title: "Create a video story",
      subtitle: "Capture a moment",
      icon: <Camera size={24} color={PRIMARY} />,
      value: "video",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dim background */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Modal content */}
      <View style={styles.modal}>
        {/* Top drag indicator */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: userImage ? userImage : "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
            style={styles.avatar}
          />
          <AppText variant="body1Bold" style={styles.headerText}>
            Create Story
          </AppText>
        </View>

        {/* Options */}
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => {
              onSelectOption?.(option.value as any);
              onClose();
            }}
          >
            <View style={styles.iconBox}>{option.icon}</View>
            <View style={{ flex: 1 }}>
              <AppText variant="body1Bold" style={styles.optionTitle}>
                {option.title}
              </AppText>
              <AppText variant="body2" style={styles.optionSubtitle}>
                {option.subtitle}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export default CreateStoryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  headerText: {
    fontSize: 17,
    alignItems: "center",
    fontWeight: "bold",
    color: "#111",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F3F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: "#111",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
});
