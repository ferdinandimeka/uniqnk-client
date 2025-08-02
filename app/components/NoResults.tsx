import TextStyles from "@/common/theming/text";
import { Text, View } from "react-native";

export default function NoResults({ text = "No Results" }) {
  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        minHeight: 120,
      }}
    >
      <Text style={TextStyles.sm}>{text}</Text>
    </View>
  );
}
