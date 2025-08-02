import AppButton from "@/app/components/AppButton";
import AvatarImage from "@/app/components/AvatarImage";
import { useOpenModal } from "@/app/components/ModalContext";
import SuccessModal from "@/app/components/SuccessModal";
import {
  DISABLED_ON_WHITE,
  PRIMARY,
  PRIMARY_HOVER,
} from "@/common/theming/colors";
import TextStyles from "@/common/theming/text";
import { Tabs } from "expo-router";
import {
  Add,
  Home,
  SearchStatus,
  Wallet2,
} from "iconsax-react-native";
import React, { useCallback } from "react";
import { Dimensions, Text } from "react-native";

const { width } = Dimensions.get("window");

export default function TabsLayout() {
  const openModal = useOpenModal();

  const tabItemCallback = useCallback(
    (Icon: any | null, label: string) => ({
      tabBarIcon: ({ color }) =>
        Icon !== null ? (
          Icon === AvatarImage ? (
            <AvatarImage size={28} bordered />
          ) : (
            <Icon color={color} variant="Linear" />
          )
        ) : (
          <AppButton
            onPress={null}
            prefixIcon={Add}
            fontSize={32}
            style={{
              width: 60,
              height: 60,
              borderColor: "#f5f5f5",
              borderWidth: 2,
              position: "relative",
              bottom: 24,
              borderRadius: 32,
            }}
          >
            {null}
          </AppButton>
        ),

      tabBarLabel: ({ color }) => (
        <Text style={{ color, ...TextStyles.xs }} children={label} />
      ),
    }),
    []
  );

  return (
    <Tabs
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: DISABLED_ON_WHITE,
        tabBarPressColor: PRIMARY_HOVER,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 8,
          right: 8,
          height: 72,
          borderRadius: 36,
          backgroundColor: "#eeeef7e5",
          elevation: 0,
          borderWidth: 1,
          borderColor: "#cecee7",
        },
        tabBarItemStyle: {
          height: 72,
          paddingTop: 16,
          overflow: "visible",
        },
        tabBarContentContainerStyle: {
          paddingTop: 24,
          borderRadius: 32,
        },
        tabBarIconStyle: {
          height: 28,
          justifyContent: "center",
          alignItems: "center",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          ...tabItemCallback(Home, "Home"),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          ...tabItemCallback(SearchStatus, "Explore"),
        }}
      />
      <Tabs.Screen
        name="Post"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            openModal(SuccessModal, { message: "In Progress" });
          },
        }}
        options={{
          ...tabItemCallback(null, "Post"),
        }}
      />
      <Tabs.Screen
        name="Wallet"
        options={{
          ...tabItemCallback(Wallet2, "Wallet"),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          ...tabItemCallback(AvatarImage, "Profile"),
        }}
      />
    </Tabs>
  );
}
