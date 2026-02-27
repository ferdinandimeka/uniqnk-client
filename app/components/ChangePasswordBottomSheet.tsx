// GiftModal.tsx
import { FormPassword } from "@/app/components/AppFormComponents";
import { TEXT_LIGHTER } from "@/common/theming/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { Lock } from "iconsax-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Form from "./AppForm";
import AppText from "./AppText";
import BiometricPinAuth from "./BiometricPinAuth";
import { ModalArgs } from "./ModalContext";


interface SheetProps {
    title?: string;
    // changePassword?: string;
    Password?: boolean;
    Pin?: boolean;
}

const ChangePasswordBottomSheet: React.FC<ModalArgs & SheetProps> = ({ dismiss, visible, Password, Pin, title }) => {
  const { changePassword } = useUserStore();
    const { users } = useAuthStore(); // ✅ from Zustand
    const user = users?.data?.user
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [ isLoading, setIsLoading ] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      setIsLoading(false);
      return;
    }

    // validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePassword(user?._id ?? "", currentPassword, newPassword);
      setIsLoading(false);
      // setUser(updated); // ✅ sync back to Zustand
      console.log("result: ", result)
      if (!result) {
        Alert.alert("Error", "Current password is incorrect.");
      } else {
        Alert.alert("Password Updated", "Your password has been successfully updated.");
      }
        // router.back();
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert("Error", err?.message || "Failed to update profile.");
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
        {title && <AppText variant="body1" style={styles.title}>{title}</AppText>}

        {Password && (
            <View style={{ paddingHorizontal: 20 }}>
                <View style={{ flexDirection: "column", marginTop: 20, marginBottom: 50 }}>
                    <Form>
                        <FormPassword
                            name="currentPassword"
                            placeholder="Current password"
                            outlined
                            autoComplete={"password"}
                            onChangeText={setCurrentPassword}
                            prefix={<Lock color={TEXT_LIGHTER} size={20} variant="Bold" />}
                        />

                        <FormPassword
                            name="newPassword"
                            placeholder="New password"
                            outlined
                            autoComplete={"password"}
                            onChangeText={setNewPassword}
                            prefix={<Lock color={TEXT_LIGHTER} size={20} variant="Bold" />}
                        />

                        <FormPassword
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            outlined
                            autoComplete={"password"}
                            onChangeText={setConfirmNewPassword}
                            prefix={<Lock color={TEXT_LIGHTER} size={20} variant="Bold" />}
                        />
                    </Form>
                </View>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button2} onPress={handleSave}>
                        <AppText variant="body1White">{isLoading ? "Saving..." : "Save"}</AppText>
                    </TouchableOpacity>
                </View>
            </View>)}

            {Pin && (
                <View style={{ flexDirection: "column", marginTop: 20, backgroundColor: "#f7faffff" }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <BiometricPinAuth
                        // mode="enroll"
                        onSuccess={() => {
                          dismiss()
                        }}
                      />
                    </View>
                </View>
            )}
      </View>
    </Modal>
  );
};

export default ChangePasswordBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "90%",
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
