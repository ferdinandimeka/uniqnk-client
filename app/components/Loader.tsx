import { DISABLED_ON_BG, PRIMARY } from "@/common/theming/colors";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";

const sizes = {
  home: 48,
  fullscreen: 40,
  tab_screen: 48,
};

export default function Loader({
  variant = "fullscreen" as keyof typeof sizes,
  size = sizes[variant],
}) {
  return variant === "home" ? (
    <ActivityIndicator
      color={PRIMARY}
      size={size}
      style={{ width: "100%", paddingVertical: size }}
    />
  ) : variant === "tab_screen" ? (
    <View
      style={{
        paddingTop: Dimensions.get("screen").height * 0.25 + 80,
        paddingBottom: Dimensions.get("screen").height * 0.25 - 80,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 16,
      }}
    >
      <ActivityIndicator color={PRIMARY} size={size} />
      <Text style={{ color: DISABLED_ON_BG }}>Please wait...</Text>
    </View>
  ) : (
    <ActivityIndicator
      color={PRIMARY}
      size={40}
      style={{ flex: 1, minWidth: "100%" }}
    />
  );
}
