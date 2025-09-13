import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface OTPInputProps {
  length?: number; // number of digits, default 4
  value: string;
  onChange: (val: string) => void;
  secureTextEntry?: boolean; // hide digits (like PIN)
  inputProps?: TextInputProps; // pass additional props
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChange,
  secureTextEntry = false,
  inputProps,
}) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const joined = newOtp.join("");
    onChange(joined);

    // auto focus next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, idx) => (
        <TextInput
          key={idx}
          ref={(ref) => {
            inputs.current[idx] = ref; // ✅ fixed: no return value
          }}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          secureTextEntry={secureTextEntry}
          value={digit}
          onChangeText={(text) => handleChange(text, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          {...inputProps}
        />
      ))}
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
  },
});
