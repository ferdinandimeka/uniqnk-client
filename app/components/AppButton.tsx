import Feather from "@expo/vector-icons/Feather";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import { Icon as IconsaxIcon } from "iconsax-react-native";
import { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { DISABLED_ON_BG, PRIMARY, WHITE } from "../../common/theming/colors";
import AppStyles from "../../common/theming/styles";
import AppText from "./AppText";
// import { LinearGradient } from "expo-linear-gradient";

export default function AppButton<Iconset extends Icon<any, any>>({
  children,
  onPress,
  loading = false,
  // color = PRIMARY,
  IconSet = Feather as Iconset,
  variant = "full",
  disabledColor = DISABLED_ON_BG,
  textColor = variant === "full" ? WHITE : PRIMARY,
  fontSize = 16,
  prefixIcon: Prefix,
  suffixIcon: Suffix,
  style,
  disabled,
  ...props
}: {
  children: string | ReactNode;
  IconSet?: Iconset;
  onPress: (event: GestureResponderEvent) => void | Promise<any>;
  loading?: boolean;
  color?: ColorValue;
  prefixIcon?: IconsaxIcon | (Iconset extends Icon<infer T, any> ? T : never);
  suffixIcon?: IconsaxIcon | (Iconset extends Icon<infer T, any> ? T : never);
  textColor?: ColorValue;
  disabledColor?: ColorValue;
  fontSize?: number;
  variant?: "full" | "outlined" | "text";
  style?: StyleProp<ViewStyle>;
} & TouchableOpacityProps) {
  const [isLoading, setLoading] = useState(false);
  const renderContent = loading || isLoading ? (
  <ActivityIndicator color={textColor} />
) : typeof children === "object" ? (
  children
) : (
  <AppText
    variant="buttonText"
    // @ts-expect-error - Keep this overrides for legacy reasons
    style={{ color: textColor, fontSize: fontSize }}
  >
    {children}
  </AppText>
);

const renderWithIcons = (Prefix || Suffix) ? (
  <>
    {Prefix ? (
      typeof Prefix === "string" ? (
        // @ts-expect-error Type inference
        <IconSet
          name={Prefix}
          fontSize={fontSize}
          color={textColor as string}
        />
      ) : (
        // @ts-expect-error Type inference
        <Prefix
          size={fontSize}
          fontSize={fontSize}
          color={textColor as string}
        />
      )
    ) : null}
    {renderContent}
    {Suffix ? (
      // @ts-expect-error Type inference
      <Suffix
        size={fontSize}
        fontSize={fontSize}
        color={textColor as string}
      />
    ) : null}
  </>
) : (
  renderContent
);
return (
  <TouchableOpacity
    onPress={
      onPress &&
      (async (e) => {
        console.log("Button click");
        if (isLoading) return;
        try {
          setLoading(true);
          await onPress(e);
        } finally {
          setLoading(false);
        }
      })
    }
    style={[
      variant === "text"
        ? { flexDirection: "row", gap: 2, alignItems: "center" }
        : AppStyles.button,
      variant === "full"
        ? {
            backgroundColor: disabled ? disabledColor : PRIMARY,
          }
        : variant === "outlined"
        ? { ...AppStyles.outlinedButton2, width: "auto", minWidth: 56 }
        : {},
      (style as object) ?? {},
    ].flat()}
    disabled={disabled}
    {...props}
  >
    {renderWithIcons}
  </TouchableOpacity>
);
}
