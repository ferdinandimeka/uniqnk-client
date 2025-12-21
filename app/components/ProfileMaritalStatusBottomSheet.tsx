import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "./AppText";
import { ModalArgs } from "./ModalContext";

interface MaritalStatusModalProps extends ModalArgs {
  onSelect: (val: string) => void;
  initialValue?: string;
}

const ProfileMaritalStatusBottomSheet: React.FC<MaritalStatusModalProps> = ({
  dismiss,
  visible,
  onSelect,
  initialValue,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    initialValue || null
  );

  const statuses = ["Single", "Married", "Complicated", "Prefer not to say"];

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
        <AppText variant="body1" style={styles.title}>
          Marital Status
        </AppText>

        {statuses.map((status) => {
          const selected = selectedStatus === status;
          return (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={styles.option}
            >
              <AppText variant="body1Light" style={styles.optionText}>
                {status}
              </AppText>
              <View
                style={[
                  styles.radioOuter,
                  { borderColor: selected ? "#384CFF" : "#999" },
                ]}
              >
                {selected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={dismiss}>
            <AppText variant="body1">Cancel</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              if (selectedStatus) {
                onSelect(selectedStatus);
              }
              dismiss();
            }}
          >
            <AppText variant="body1White">Save</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileMaritalStatusBottomSheet;

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
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F4FF",
  },
  button2: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#384CFF",
  },
});
