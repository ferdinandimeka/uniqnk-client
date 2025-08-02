import { smallBlueLogo } from "@/common/assets";
import { Image } from "react-native";

export default function AppIcon({ size = 36 }: { size?: number }) {
  return (
    <Image
      source={smallBlueLogo}
      style={{
        width: size,
        height: size === 180 ? 56 : size,
        marginBottom: size === 180 ? 8 : undefined,
        resizeMode: "contain",
      }}
    />
  );
}
