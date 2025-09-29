// PaymentBottomSheet.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppText from "./AppText";
import { ModalArgs, useOpenModal } from "./ModalContext";
import PinAuth from "./PinAuth";
import PaymentConfirmationModal from "./PaymentConfirmationModal"

const { width } = Dimensions.get("window");
const img = require('@/assets/icons/transfermoney.png');
const img2 = require('@/assets/image/cash.png');
const img3 = require('@/assets/image/failcash.png');
const img4 = require('@/assets/image/emoji.png');

const PaymentBottomSheet: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  const [step, setStep] = useState(0); // 0-based index
  const translateX = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const openModal = useOpenModal();

  const goToStep = (nextStep: number) => {
    Animated.timing(translateX, {
      toValue: -width * nextStep,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setStep(nextStep));
  };

  const continueHandler = () => {
    dismiss()
    router.back()
    openModal(PaymentConfirmationModal, {})
    // goToStep(0)
  }
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={dismiss}>
      {/* Semi-transparent background */}
      <Pressable style={styles.overlay} onPress={dismiss} />

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.border} />

        <Animated.View
          style={[
            styles.slidesWrapper,
            { transform: [{ translateX }] },
          ]}
        >
          {/* STEP 1 - Proceed to Payment */}
          <View style={styles.slide}>
            <View style={{ padding: 10, borderRadius: 100, backgroundColor: "#F1F4FF", marginBottom: 30 }}>
                <Image source={img} />
            </View>
            <Text style={[styles.text, { marginBottom: 20, paddingHorizontal: 40, lineHeight: 24 }]}>
              Select Proceed to confirm that you are about to make a bank transfer of <Text style={{ fontWeight: 600, color: "#000" }}>₦4,000</Text> to the Access Bank account with account name  <Text style={{ fontWeight: 600, color: "#000" }}>Sarah Damian</Text>
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={dismiss}>
                <AppText variant="body1">Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => goToStep(1)}>
                <AppText variant="body1White">Proceed</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* STEP 2 - Enter PIN */}
          <View style={styles.slide}>
            {/* <Text style={styles.title}>Enter Your PIN</Text> */}
            <View style={{ flexDirection: "column", marginTop: 20, backgroundColor: "#f7faffff" }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <PinAuth
                        // mode="enroll"
                        onSuccess={() => {
                            goToStep(2)
                        }}
                    />
                </View>
            </View>
          </View>

          {/* STEP 3 - Payment Success */}
          <View style={styles.slide}>
            <View style={{ padding: 20, borderRadius: 100, backgroundColor: "#F1F4FF", marginBottom: 30 }}>
                <Image source={img2} />
            </View>
            <Text style={[styles.title, { color: "green" }]}>
              Yaay!! 🎉🎉
            </Text>
            <Text style={[styles.text, { marginBottom: 20, paddingHorizontal: 40, lineHeight: 24 }]}>
              You have successfully sent  <Text style={{ fontWeight: 600, color: "#000" }}>₦4,000</Text> to the user  <Text style={{ fontWeight: 600, color: "#000" }}>Sarah Damian</Text> with username  <Text style={{ fontWeight: 600, color: "#000" }}>@SarahDam</Text>
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button2} onPress={continueHandler}>
                <AppText variant="body1White">Continue</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* STEP 4 - Payment Failed */}
          <View style={styles.slide}>
            <View style={{ padding: 20, borderRadius: 100, backgroundColor: "#F1F4FF", marginBottom: 30 }}>
                <Image source={img3} />
            </View>
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                <Text style={[styles.title, { color: "red" }]}>
                    Oops
                </Text>
                <Image source={img4} style={{ marginBottom: 12, }} />
                <Image source={img4} style={{ marginBottom: 12, }} />
            </View>
            <Text style={[styles.text, { marginBottom: 20, paddingHorizontal: 40, lineHeight: 24 }]}>
             You transaction has failed. This could be due to Network issues or a service downtime.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={dismiss}>
                <AppText variant="body1White">Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => goToStep(0)}>
                <AppText variant="body1">Retry Transaction</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PaymentBottomSheet;

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
    Height: "70%",
  },
  border: {
    borderTopWidth: 5,
    borderTopColor: "#D9D9D9",
    marginBottom: 20,
    width: 70,
    alignSelf: "center",
    borderRadius: 25,
  },
  slidesWrapper: {
    flexDirection: "row",
    width: width * 4, // 4 slides
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 35,
    paddingBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "50%",
    fontSize: 24,
    textAlign: "center",
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F4FF",
  },
  button2: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#384CFF",
  },
});
