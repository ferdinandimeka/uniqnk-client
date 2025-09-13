// GiftModal.tsx
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppText from "./AppText";
import { ModalArgs, useOpenModal } from "./ModalContext";


const ChangeNameBottomSheet: React.FC<ModalArgs> = ({ dismiss, visible }) => {
    const openModal = useOpenModal();
    const [isTemporarilyDisabled, setIsTemporarilyDisabled] = useState(false);
    return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={dismiss}
    >
      {/* Semi-transparent background */}
      <Pressable style={styles.overlay} onPress={dismiss} />

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.border} />
        {/* <AppText variant="body1" style={styles.title}>{}</AppText> */}

        <View style={{ flexDirection: "column", marginBottom: 100 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#555555" }}>Private account</Text>
                    <Text style={{ color: "gray" }}>Make what you share only visible to your followers and people you permit</Text>
                </View>
                <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
            </View>
        </View>
        
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button2} onPress={dismiss}>
                <AppText variant="body1White">Save</AppText>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeNameBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
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
  }
});
