import { PRIMARY, TEXT_DARKER } from "@/common/theming/colors";
import { SearchNormal } from "iconsax-react-native";
import React, { ReactNode, useState } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import AppText from "./AppText";

type IconButtonProps = {
  icon?: any;
  color?: string;
  activeColor?: string;
  size?: number;
  active?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
};

export default function IconButton({
  icon: Icon = SearchNormal,
  color = TEXT_DARKER,
  activeColor = PRIMARY,
  size = 20,
  active = false,
  children,
  style,
  onPress,
}: IconButtonProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.button, style]}
      android_ripple={undefined} // Disable default ripple
    >
      <Icon
        color={focused || active ? activeColor : color}
        size={size}
        variant={active ? "Bold" : "Linear"}
      />
      {children ? (
        <AppText
          variant="buttonTextDark"
          style={{
            color: focused ? activeColor : undefined,
            marginLeft: 4,
          }}
        >
          {children}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
});
