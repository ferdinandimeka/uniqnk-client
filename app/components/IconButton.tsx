import { PRIMARY, TEXT_DARKER } from "@/common/theming/colors";
import { SearchNormal } from "iconsax-react-native";
import { ReactNode, useState } from "react";
import { ButtonProps, ViewProps } from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";

export default function IconButton({
  icon: Icon = SearchNormal,
  color = TEXT_DARKER,
  activeColor = PRIMARY,
  size = 20,
  active = false,
  children = undefined as ReactNode,
  style = undefined as ViewProps["style"],
  onPress = undefined as ButtonProps["onPress"],
}) {
  const [focused, setFocused] = useState(false);
  return (
    <AppButton
      style={{
        width: "auto",
        borderRadius: 48,
        gap: 4,
        paddingHorizontal: 8,
        ...((style as object) ?? null),
      }}
      color="transparent"
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
      onPress={onPress}
    >
      <Icon
        color={focused || active ? activeColor : color}
        size={size}
        variant={active ? "Bold" : "Linear"}
      />
      {children ? (
        <AppText
          variant={"buttonTextDark"}
          style={{
            // @ts-expect-error No color for AppText
            color: focused ? activeColor : undefined,
          }}
        >
          {children}
        </AppText>
      ) : null}
    </AppButton>
  );
}
