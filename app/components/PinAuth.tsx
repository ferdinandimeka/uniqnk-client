import * as LocalAuthentication from "expo-local-authentication";
import { FingerScan } from "iconsax-react-native";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from "react-native";

//
// PinPad component
//
const PinPad = ({
  length = 4,
  value,
  onChange,
  onSubmit,
  onBiometricPress,
}: {
  length?: number;
  value: string;
  onChange: (s: string) => void;
  onSubmit?: (finalPin: string) => void;
  onBiometricPress?: () => void;
}) => {
 const pushDigit = (d: string) => {
    if (value.length >= length) return;
        const newVal = value + d;
        onChange(newVal);
        if (newVal.length === length && onSubmit) {
        setTimeout(() => onSubmit(newVal), 150); // ✅ send newVal
        }
    };

  const deleteDigit = () => onChange(value.slice(0, -1));

  const renderKey = (d: string) => (
    <TouchableOpacity key={d} style={styles.key} onPress={() => pushDigit(d)}>
      <Text style={styles.keyText}>{d}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, value.length > i ? styles.dotFilled : null]}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={styles.pad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(renderKey)}

        <TouchableOpacity style={styles.key} onPress={onBiometricPress}>
          <FingerScan size={30} color="#555" variant="Linear" />
        </TouchableOpacity>

        {renderKey("0")}

        <TouchableOpacity style={styles.key} onPress={deleteDigit}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//
// Main component
//
export default function ConfirmPinScreen({
  pinLength = 4,
  onSuccess,
}: {
  pinLength?: number;
  onSuccess: () => void;
}) {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("Enter PIN to Confirm");

  const VALID_PIN = "1234"; // fixed or fetch from API/session

 const handleSubmitPin = (enteredPin: string) => {
  if (enteredPin === VALID_PIN) {
    Vibration.vibrate(50);
    setMessage("PIN confirmed ✅");
    onSuccess();
  } else {
    Vibration.vibrate(200);
    setMessage("Invalid PIN ❌");
    setPin(""); // reset
  }
};

  const tryBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm with Biometrics",
      });
      if (result.success) {
        Vibration.vibrate(50);
        setMessage("Biometric confirmed ✅");
        onSuccess();
      } else {
        setMessage("Biometric failed ❌");
      }
    } catch (err) {
      setMessage("Biometric error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>

      <PinPad
        length={pinLength}
        value={pin}
        onChange={setPin}
        onSubmit={handleSubmitPin}
        onBiometricPress={tryBiometric}
      />
    </View>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  dotsRow: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
    marginHorizontal: 8,
  },
  dotFilled: { backgroundColor: "#000" },
  pad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  key: {
    width: 80,
    height: 60,
    margin: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: { fontSize: 20, fontWeight: "600" },
});
