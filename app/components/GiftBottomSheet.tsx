// GiftModal.tsx
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import GiftCard from "./GiftCard";
import GiftConfirmationModal from "./GiftConfirmationModal";
import { ModalArgs, useOpenModal } from "./ModalContext";

const GiftBottomSheet: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  // Define different coin/amount values
  const giftOptions = [
    { coins: "500", amount: "₦4,000.00", image: false },
    { coins: "1", amount: "₦100.00", image: true },
    { coins: "4", amount: "₦150.00", image: true },
    { coins: "10", amount: "₦250.00", image: true },
    { coins: "20", amount: "₦500.00", image: true },
    { coins: "30", amount: "₦600.00", image: true },
    { coins: "40", amount: "₦750.00", image: true },
    { coins: "100", amount: "₦1,000.00", image: true },
  ];
  const openModal = useOpenModal();
  const successHandler = () => {
    openModal(GiftConfirmationModal, {}) // 🎁 open top sheet
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
        <Text style={styles.title}>🎁 Purchase Gift Coins</Text>

        <View style={{ flex: 1, backgroundColor: "#fff", padding: 10, borderRadius: 10 }}>
          <View style={{ flexDirection: "column", marginBottom: 10, alignItems: "flex-start" }}>
            <Text style={{ color: "#474A55", fontSize: 16, fontWeight: "700", lineHeight: 20, fontFamily: "Mulish" }}>
              Select coin amount
            </Text>
            <Text style={{ color: "#A1A1A1", fontSize: 11, fontWeight: "400", lineHeight: 13, fontFamily: "Mulish" }}>
              Recharge coins to gift in live
            </Text>
          </View>

          <View style={styles.grid}>
            {giftOptions.map((gift, index) => (
              <View key={index} style={styles.cell}>
                <GiftCard coins={gift.coins} amount={gift.amount} image={gift.image} />
              </View>
            ))}
          </View>
        </View>

        <Pressable style={{ marginTop: 25, marginBottom: 10, flexDirection: "row", alignSelf: "center", justifyContent: "center", padding: 12, width: "90%", backgroundColor: "#384CFF", borderRadius: 32 }} onPress={successHandler}>
          <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Mulish", fontWeight: "600", fontSize: 14 }}>Purchase 500 coins (₦4,000.00)</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default GiftBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#F1F4FF",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "25%", // 4 columns
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
