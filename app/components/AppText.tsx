import { Text, TextProps, TextStyle } from "react-native";
import TextStyles, { variants } from "../../common/theming/text";

export default function AppText({
  variant,
  style = null,
  trim = false,
  ...props
}: {
  variant: keyof typeof variants;
  trim?: boolean;
  style?:
    | Omit<
        TextStyle,
        | "color"
        | "fontSize"
        | "lineHeight"
        | "fontFamily"
        | "fontWeight"
        | "fontStyle"
      >
    | Omit<
        TextStyle,
        | "color"
        | "fontSize"
        | "lineHeight"
        | "fontFamily"
        | "fontWeight"
        | "fontStyle"
      >[];
} & Omit<TextProps, "style">) {
  return (
    <Text
      style={[
        variants[variant],
        trim
          ? {
              lineHeight:
                variants[variant]?.["fontSize"] ?? TextStyles.normal.fontSize,
            }
          : null,
        style,
      ]}
      {...props}
    ></Text>
  );
}
