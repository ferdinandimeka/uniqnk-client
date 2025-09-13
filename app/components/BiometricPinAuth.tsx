import * as Crypto from "expo-crypto";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { FingerScan } from "iconsax-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

//
// Config
//
const STORAGE_KEYS = {
  PIN_HASH: "PIN_HASH",
  PIN_SALT: "PIN_SALT",
  BIOMETRIC_ENABLED: "BIOMETRIC_ENABLED",
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 2 * 60 * 1000; // 2 minutes

//
// Helpers
//
async function genSalt(): Promise<string> {
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

async function hashPin(pin: string, salt: string) {
  const value = salt + pin;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value
  );
}

async function saveSecure(key: string, value: string) {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
}
async function getSecure(key: string) {
  return await SecureStore.getItemAsync(key);
}
async function deleteSecure(key: string) {
  return await SecureStore.deleteItemAsync(key);
}

//
// PIN keypad
//
const PinPad = ({
  length = 4,
  value,
  onChange,
  onSubmit,
  onBiometricPress,
  disabled,
}: {
  length?: number;
  value: string;
  onChange: (s: string) => void;
  onSubmit?: () => void;
  onBiometricPress?: () => void;
  disabled?: boolean;
}) => {
  const pushDigit = (d: string) => {
    if (disabled) return;
    if (value.length >= length) return;
    onChange(value + d);
    if (value.length + 1 === length && onSubmit) {
      setTimeout(onSubmit, 150);
    }
  };

  const deleteDigit = () => !disabled && onChange(value.slice(0, -1));

  const renderKey = (d: string) => (
    <TouchableOpacity
      key={d}
      style={styles.key}
      onPress={() => pushDigit(d)}
      disabled={disabled}
    >
      <Text style={styles.keyText}>{d}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.dotsRow}>
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, value.length > i ? styles.dotFilled : null]}
          />
        ))}
      </View>

      <View style={styles.pad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(renderKey)}
        <TouchableOpacity
          style={styles.key}
          onPress={onBiometricPress}
          disabled={!onBiometricPress || disabled}
        >
          <FingerScan size={30} color="#555" variant="Linear" />
        </TouchableOpacity>
        {renderKey("0")}
        <TouchableOpacity style={styles.key} onPress={deleteDigit} disabled={disabled}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//
// Main Component
//
export default function BiometricPinAuth({
  pinLength = 4,
  onSuccess,
  showDevButtons = false, // optional prop to show quick dev controls
}: {
  pinLength?: number;
  onSuccess: () => void;
  showDevButtons?: boolean;
}) {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [step, setStep] = useState<"enterCurrent" | "enterNew" | "confirmNew">(
    "enterCurrent"
  );
  const [newPin, setNewPin] = useState<string | null>(null);
  const [message, setMessage] = useState("Enter Current PIN");
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null); // null = loading

  // On mount: check enrolled PIN and biometric capability
  useEffect(() => {
    (async () => {
      const hash = await getSecure(STORAGE_KEYS.PIN_HASH);
      setIsEnrolled(Boolean(hash));
      if (!hash) {
        // no PIN yet -> start set-new flow
        setStep("enterNew");
        setMessage("No PIN set — enter new PIN");
      } else {
        setStep("enterCurrent");
        setMessage("Enter Current PIN");
      }

      const hw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hw && enrolled);
    })();
  }, []);

  // Auto unlock after lockout (countdown updates message)
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockedUntil) {
        setLockedUntil(null);
        setAttempts(0);
        setMessage(isEnrolled ? "Enter Current PIN" : "Enter New PIN");
        clearInterval(interval);
      } else {
        const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
        setMessage(`Locked for ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil, isEnrolled]);

  const locked = useMemo(
    () => lockedUntil !== null && Date.now() < lockedUntil,
    [lockedUntil]
  );

  // Verify current pin (returns boolean)
  async function verifyPin(entered: string) {
    const salt = await getSecure(STORAGE_KEYS.PIN_SALT);
    const hash = await getSecure(STORAGE_KEYS.PIN_HASH);
    if (!salt || !hash) return false;
    const computed = await hashPin(entered, salt);
    return computed === hash;
  }

  async function saveNewPinToStore(pinToSave: string) {
    const salt = await genSalt();
    const hash = await hashPin(pinToSave, salt);
    await saveSecure(STORAGE_KEYS.PIN_HASH, hash);
    await saveSecure(STORAGE_KEYS.PIN_SALT, salt);
    setIsEnrolled(true);
  }

  // Submit handler (handles enterCurrent -> enterNew -> confirmNew)
  async function handleSubmitPin() {
    if (locked) return;

    // If we're at enterCurrent but no PIN is enrolled, switch to enterNew
    if (step === "enterCurrent" && !isEnrolled) {
      setStep("enterNew");
      setMessage("No PIN set — enter new PIN");
      setPin("");
      return;
    }

    if (step === "enterCurrent") {
      const ok = await verifyPin(pin);
      if (ok) {
        setAttempts(0);
        setStep("enterNew");
        setMessage("Enter New PIN");
      } else {
        const tries = attempts + 1;
        setAttempts(tries);
        if (tries >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setMessage(`Locked for ${Math.floor(LOCKOUT_MS / 1000)}s`);
        } else {
          setMessage(`Wrong PIN (${tries}/${MAX_ATTEMPTS})`);
        }
      }
      setPin("");
      return;
    }

    if (step === "enterNew") {
      setNewPin(pin);
      setStep("confirmNew");
      setMessage("Confirm New PIN");
      setPin("");
      return;
    }

    if (step === "confirmNew") {
      if (newPin === pin) {
        await saveNewPinToStore(pin);
        setMessage("PIN set successfully");
        Vibration.vibrate(50);
        // after a small delay, reset to enterCurrent (or call onSuccess)
        setTimeout(() => {
          setStep("enterCurrent");
          setMessage("Enter Current PIN");
          setPin("");
          setNewPin(null);
          onSuccess();
        }, 600);
      } else {
        setMessage("PINs do not match. Try again.");
        Vibration.vibrate(200);
        // go back to entering new PIN
        setStep("enterNew");
        setNewPin(null);
        setPin("");
      }
      return;
    }
  }

  // Biometric attempt (if available)
  async function tryBiometric() {
    if (!biometricAvailable) {
      setMessage("Biometrics not available");
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock with biometrics",
      });
      if (result.success) {
        Vibration.vibrate(50);
        // biometric success considered equivalent to "current PIN verified"
        setAttempts(0);
        setStep("enterNew");
        setMessage("Enter New PIN");
      } else {
        setMessage("Biometric failed or canceled");
      }
    } catch (err) {
      console.warn("biometric err", err);
      setMessage("Biometric error");
    }
  }

  // ---- Dev helpers (optional) ----
  async function resetStoredPin() {
    await deleteSecure(STORAGE_KEYS.PIN_HASH);
    await deleteSecure(STORAGE_KEYS.PIN_SALT);
    setIsEnrolled(false);
    setStep("enterNew");
    setMessage("PIN reset — enter new PIN");
  }

  async function setTestPin1234() {
    await saveNewPinToStore("1234");
    setStep("enterCurrent");
    setMessage("Test PIN set to 1234 (use to log in)");
    Alert.alert("Test PIN set", "You can use 1234 as the PIN for testing.");
  }

  // ---- UI ----
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>

      <PinPad
        length={pinLength}
        value={pin}
        onChange={setPin}
        onSubmit={handleSubmitPin}
        onBiometricPress={tryBiometric}
        disabled={locked}
      />

      {/* Optional dev controls — pass showDevButtons=true to enable */}
      {showDevButtons ? (
        <View style={styles.controls}>
          <TouchableOpacity onPress={resetStoredPin} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Reset PIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={setTestPin1234} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Set Test PIN (1234)</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  message: { color: "#666", marginBottom: 8 },
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
  controls: { flexDirection: "row", marginTop: 10 },
  secondaryButton: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  secondaryText: { color: "#333" },
});
