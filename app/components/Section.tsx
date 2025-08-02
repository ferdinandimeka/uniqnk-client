import { ReactNode } from "react";
// import { useAppPadding } from "../data/features/ui/uiActions";
import { View } from "react-native";

export default function Section<T extends (...args: any) => ReactNode>({
  as: As = View,
  spaceBefore,
  spaceAfter,
  ...props
}: { as?: T; spaceBefore?: boolean; spaceAfter?: boolean } & Parameters<T>[0]) {
  const padding = 16;
  return (
    <As
      {...props}
      style={[
        { paddingHorizontal: padding },

        spaceAfter
          ? {
              marginBottom: 8,
            }
          : null,
        spaceBefore
          ? {
              marginTop: 48,
            }
          : null,
        props.style,
      ]}
    />
  );
}
