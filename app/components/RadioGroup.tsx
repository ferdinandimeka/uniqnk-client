import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Option = { header: string; label: string; value: string };

interface RadioGroupProps {
  options: Option[];
  value: Option["value"]; // enforce string from your options
  onChange: (val: Option["value"]) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange }) => {
  return (
    <View style={{ marginVertical: 10, gap: 10 }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={styles.row}
            onPress={() => onChange(opt.value)} // ✅ only send string
          >
            <View style={styles.content}>
              <Text style={styles.header}>{opt.header}</Text>
              <Text style={styles.label}>{opt.label}</Text>
            </View>

            <View style={[styles.circle, selected && styles.circleSelected]}>
              {selected && <View style={styles.dot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioGroup;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
    // width: "65%",
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    color: "grey",
  },
  label: {
    color: "gray",
    fontSize: 14,
    width: "75%"
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: {
    borderColor: "#384CFF",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#384CFF",
  },
});
