// GiftModal.tsx
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Form, { FormInput } from "./AppForm";
import AppText from "./AppText";
import ConfirmChangeBottomSheet from "./ConfirmChangeBottomSheet";
import DecoratedTextField from "./DecoratedTextField";
import { ModalArgs, useOpenModal } from "./ModalContext";

interface SheetProps {
    title: string;
    field: "fullName" | "username" | "phone" | "email";
    placeholder: string;
}

const ChangeNameBottomSheet: React.FC<ModalArgs & SheetProps> = ({ dismiss, visible, title, placeholder, field }) => {
    const openModal = useOpenModal();
    const { users } = useAuthStore(); // ✅ from Zustand
    const { updateUserById } = useUserStore();
    const user = users?.data?.user
    const [isloading, setIsLoading] = useState(false);
    const [value, setValue] = useState(
   user?.[field] ?? ""
    );

    const handleSave = async () => {
      if (!value.trim()) {
        Alert.alert("Validation", "Field cannot be empty");
        return;
      }

      try {
        setIsLoading(true);
        await updateUserById(user._id, {
          [field]: value,
        });
        dismiss();
        Alert.alert("Success", "Profile updated successfully");
      } catch (e) {
        Alert.alert("Error", "Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    };

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
        <AppText variant="body1" style={styles.title}>{title}</AppText>

        <View style={styles.content}>
            <Form>
                <FormInput
                    as={DecoratedTextField}
                    name={field}
                    value={value}
                    onChangeText={setValue}
                    containerStyle={{ flex: 1 }}
                    outlined
                    noMargin
                    placeholder={placeholder}
                />
            </Form>
            <AppText variant="body2">Can not be changed more than once in 15 days</AppText>
        </View>
        
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button2} onPress={async () => { 
              // await handleSave();
              if (value.trim()) {
                openModal(({ dismiss, visible }) => (
                  <ConfirmChangeBottomSheet 
                      title={title} 
                      dismiss={dismiss} 
                      visible={visible}
                      onConfirm={handleSave}
                      id={undefined}
                  />
                ), {})
              }
            }}>
                <AppText variant="body1White">
                  {isloading ? "Saving..." : "Save Changes"}
                </AppText>
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
  content: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 80, // space for fixed button
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
