// GiftModal.tsx
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
// import GiftCard from "./GiftCard";
// import GiftConfirmationModal from "./GiftConfirmationModal";
import { ModalArgs } from "./ModalContext";
import { useRouter } from "expo-router"

const PostBottomSheet: React.FC<ModalArgs> = ({ dismiss, visible }) => {
    
    const router = useRouter();
    const successHandler = () => {
        dismiss();
        router.push("/tabs")
    } 
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

        <View style={{ flex: 1, backgroundColor: "#fff", padding: 10, borderRadius: 10 }}>
         
            <Image 
                source={require('../../assets/icons/Success.png')}
                style={{ alignSelf: "center" }}
            />

            <Text style={{ color: "#474a55", fontSize: 14, fontWeight: "500", alignSelf: "center" }}>Your Post has been uploaded</Text>

            <Pressable style={{ marginTop: 25, marginBottom: 10, flexDirection: "row", alignSelf: "center", justifyContent: "center" }} onPress={successHandler}>
                <Text style={{ color: "#213BAA", textAlign: "center", fontFamily: "Mulish", fontWeight: "500", fontSize: 18, textDecorationLine: "underline" }}>View Post</Text>
            </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default PostBottomSheet;

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
});
