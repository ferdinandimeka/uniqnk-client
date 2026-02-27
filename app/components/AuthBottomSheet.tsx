import RadioGroup, { Option } from "@/app/components/RadioGroup";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AppText from "./AppText";
import { ModalArgs, useOpenModal } from "./ModalContext";
import OTPInput from "./Otp";
// import { useRouter } from "expo-router";

interface SheetProps {
  title?: string;
  auth_method?: boolean;
  confirm?: boolean;
}

const AuthBottomSheet: React.FC<ModalArgs & SheetProps> = ({
  dismiss,
  visible,
  auth_method,
  confirm,
  title,
}) => {
    const [selectedMethod, setSelectedMethod] = useState<Option["value"]>("authenticator_app");
    const [code, setCode] = useState("");
    const openModal = useOpenModal();
    // const router = useRouter();

  const authOptions: Option[] = [
    {
      id: "authenticator_app",
      header: "Authenticator App",
      label: "Use an authenticator app to generate login codes",
      value: "authenticator_app",
    },
    {
      id: "sms",
      header: "SMS",
      label: "Receive login codes via SMS to your phone number",
      value: "sms",
    },
    {
      id: "email",
      header: "Email",
      label: "Receive login codes via email to your registered email address",
      value: "email",
    },
  ];

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
        {title && (
          <AppText variant="body1" style={styles.title}>
            {title}
          </AppText>
        )}

        {auth_method && (
          <View style={{ paddingHorizontal: 20 }}>
            <RadioGroup
              options={authOptions}
              value={selectedMethod}
              onChange={setSelectedMethod}
            />

            <Pressable style={styles.nextButton} onPress={() => openModal(({ dismiss, visible }) => (
                <AuthBottomSheet
                    confirm
                    title="Enter Confirmation Code"
                    dismiss={dismiss} 
                    visible={visible} 
                    id={undefined}
                />
            ), {})}>
              <AppText variant="body1" style={styles.nextButtonText}>
                Next
              </AppText>
            </Pressable>
          </View>
        )}

        {confirm && (
            <View style={{ paddingHorizontal: 20 }}>
                <AppText variant="body1" style={styles.title2}>
                    Please enter the One-Time Password(OTP) sent to your phone
                </AppText>

                <OTPInput
                    length={6}
                    value={code}
                    onChange={setCode}
                    secureTextEntry={false} // set true if PIN
                />

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ alignSelf: "center" }}>Didn&apos;t get code? </Text>
                    <Text style={{ alignSelf: "center", color: "#384CFF" }}> Resend code. 28s </Text>
                </View>

                <Pressable style={styles.nextButton}>
                    <AppText variant="body1" style={styles.nextButtonText}>
                        Next
                    </AppText>
                </Pressable>

                <Pressable style={styles.codeButton}>
                    <AppText variant="body2" style={styles.nextButtonText2}>
                        Get code via SMS
                    </AppText>
                </Pressable>
            </View>
        )}
      </View>
    </Modal>
  );
};

export default AuthBottomSheet;

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
    maxHeight: "65%",
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
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
    color: "#474A55",
  },
  title2: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 20,
    textAlign: "center",
    color: "#474A55",
  },
    nextButton: {
    backgroundColor: "#384CFF",
    borderRadius: 25,
    paddingVertical: 12,
    // paddingHorizontal: 20,
    // alignSelf: "center",
    marginTop: 40,
  },
    nextButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    alignSelf: "center",
  },
   nextButtonText2: {
    fontSize: 16,
    fontWeight: "700",
    color: "gray",
    alignSelf: "center",
  },
  codeButton: {
    backgroundColor: "#fff",
    borderColor: "#384CFF",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    // paddingHorizontal: 20,
    // alignSelf: "center",
    marginTop: 5,
  }
});
