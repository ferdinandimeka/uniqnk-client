import {
    DISABLED_ON_BG,
    PRIMARY,
    PRIMARY_HOVER,
} from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { variants } from "@/common/theming/text";
import { TouchableHighlight, View } from "react-native";
import AppText from "./AppText";

export default function Chip({
  rounded = false,
  label,
  radio = false,
  onPress = null,
  size = "medium" as "small" | "medium",
  active = false,
  textVariant = "body1" as keyof typeof variants,
}) {
  return (
    <TouchableHighlight
      underlayColor={PRIMARY_HOVER}
      disabled={!onPress}
      onPress={onPress}
      style={[
        AppStyles.outlined,
        rounded ? { borderRadius: 32 } : null,
        size === "small" ? { paddingVertical: 4, paddingHorizontal: 12 } : null,
        active ? AppStyles.outlinedActive : null,
        { minWidth: size === "small" ? 56 : 80 },
        { alignItems: "center" },
      ]}
    >
      {radio ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: rounded ? "center" : "space-between",
          }}
        >
          <Radio active={active} />
          <AppText variant={active ? "body1Black" : textVariant}>
            {label}
          </AppText>
        </View>
      ) : (
        <AppText variant={active ? "body1Black" : textVariant}>{label}</AppText>
      )}
    </TouchableHighlight>
  );
}

export function Radio({ active = false }) {
  return (
    <View
      style={{
        height: 22,
        width: 22,
        borderRadius: 16,
        borderWidth: 2,
        marginRight: 12,
        borderColor: active ? PRIMARY : DISABLED_ON_BG,
        padding: 4,
      }}
    >
      <View
        style={{
          height: "100%",
          opacity: active ? 1 : 0,
          width: "100%",
          borderRadius: 16,
          backgroundColor: active ? PRIMARY : DISABLED_ON_BG,
        }}
      ></View>
    </View>
  );
}
