import AppStyles from "@/common/theming/styles";
import { ReactNode } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import AppTextField, { AppTextFieldProps } from "./AppTextField";

export default function DecoratedTextField({
  prefix,
  suffix,
  noMargin,
  marginBottom = noMargin ? 0 : AppStyles.input.marginBottom,
  containerStyle,
  ...props
}: AppTextFieldProps & {
  prefix?: ReactNode;
  containerStyle?: ViewStyle;
  marginBottom?: number;
  suffix?: ReactNode;
}) {
  return (
    <View
      style={[
        {
          position: "relative",
          flexDirection: "column",
        },
        containerStyle,
      ]}
    >
      <AppTextField
        {...props}
        style={[
          {
            paddingLeft: prefix ? 40 : undefined,
            paddingRight: suffix ? 40 : undefined,
          } as StyleProp<TextStyle>,
        ].concat(props.style ?? [])}
        noMargin={noMargin}
      />
      {prefix ? (
        <View
          style={{
            top: 0,
            bottom: marginBottom,
            borderRadius: 32,
            position: "absolute",
            left: 0,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {prefix}
        </View>
      ) : null}
      {suffix ? (
        <View
          style={{
            top: 0,
            bottom: marginBottom,
            borderRadius: 32,
            position: "absolute",
            right: 0,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {suffix}
        </View>
      ) : null}
    </View>
  );
}
