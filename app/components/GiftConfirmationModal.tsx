import { BlurView } from "expo-blur";
import React from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import { ModalArgs } from "./ModalContext";

const GiftConfirmationModal: React.FC<ModalArgs> = ({
  visible,
  dismiss
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={dismiss}
    >
      <View style={styles.overlay} onTouchEnd={dismiss}>
        <BlurView intensity={50} tint="dark" style={styles.modalContainer}>
          {/* <Text style={styles.title}>🎁 Gift Sent!</Text>
          <Text style={styles.subtitle}>
            You successfully sent 100 coins 💰
          </Text>
          <TouchableOpacity style={styles.button} onPress={dismiss}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity> */}
          <Image 
              source={require('../../assets/icons/GiftBox.png')}
              style={{ width: 49, height: 49 }}
          />
          <Text style={{ lineHeight: 20, letterSpacing: 0, color: "#fff", width: 191, fontFamily: "Satoshi", fontWeight: "500", fontSize: 14 }}>Yay!! Marvin McKinney just gifted you 100💰</Text>
        </BlurView>
      </View>
    </Modal>
  );
};

export default GiftConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-start", // 👈 aligns modal to top
    alignItems: "center",
    paddingTop: 80, // distance from top
  },
  modalContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 313,
    height: 72,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 20,
    backgroundColor: "rgba(56,58,66,0.5)", // #383A42 at 50%
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 }, // X:0, Y:8
    shadowOpacity: 0.15, // 15%
    shadowRadius: 12, // Blur: 12
    elevation: 6, // Spread (Android)
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#ddd",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#7690FF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
