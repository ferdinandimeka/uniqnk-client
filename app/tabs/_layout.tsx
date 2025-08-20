import AddCircle from "@/app/components/AddCircle";
import AppButton from "@/app/components/AppButton";
import AvatarImage from "@/app/components/AvatarImage";
import {
  DISABLED_ON_WHITE,
  PRIMARY,
  PRIMARY_HOVER,
} from "@/common/theming/colors";
import TextStyles from "@/common/theming/text";
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import {
  Add,
  AddSquare,
  Airdrop,
  Home,
  SearchStatus,
  Story,
  VideoPlay,
  Wallet2,
} from "iconsax-react-native";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TabsLayout() {
  const [showPostOverlay, setShowPostOverlay] = useState(false);
  const router = useRouter()

  const blurAnim = useRef(new Animated.Value(0)).current; // blur intensity
  const tabBarAnim = useRef(new Animated.Value(0)).current; // slide tab bar
  const overlaySlide = useRef(new Animated.Value(height)).current; // slide overlay up

  const animateBlurIn = () => {
    setShowPostOverlay(true);
    Animated.parallel([
      Animated.timing(blurAnim, {
        toValue: 50,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(tabBarAnim, {
        toValue: 100,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlaySlide, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateBlurOut = () => {
    Animated.parallel([
      Animated.timing(blurAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(tabBarAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlaySlide, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setShowPostOverlay(false));
  };

  const tabItemCallback = useCallback(
    (Icon: any | null, label: string) => ({
      tabBarIcon: ({ color }: { color: string }) =>
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
          />
        ),
      tabBarLabel: ({ color }: { color: string }) => (
        <Text style={{ color, ...TextStyles.xs }}>{label}</Text>
      ),
    }),
    []
  );

  return (
    <>
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
            transform: [
              {
                translateY: tabBarAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 120], // slide down
                }),
              },
            ],
          },
          tabBarItemStyle: {
            height: 72,
            paddingTop: 16,
            overflow: "visible",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen name="Home" options={tabItemCallback(Home, "Home")} />
        <Tabs.Screen
          name="Explore"
          options={tabItemCallback(SearchStatus, "Explore")}
        />
        <Tabs.Screen
          name="Post"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              animateBlurIn();
            },
          }}
          options={tabItemCallback(null, "Post")}
        />
        <Tabs.Screen
          name="Wallet"
          options={tabItemCallback(Wallet2, "Wallet")}
        />
        <Tabs.Screen
          name="Profile"
          options={tabItemCallback(AvatarImage, "Profile")}
        />
      </Tabs>

      {showPostOverlay && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateY: overlaySlide }] },
          ]}
        >
          {/* Background blur */}
          <AnimatedBlurView
            intensity={blurAnim}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* Semi-transparent tint */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "#1C78FF4D" },
            ]}
          />

          {/* Menu */}
          <View style={styles.overlayContent}>
            <View style={styles.menuRow1}>
              <MenuButton
                label="Reels"
                icon={<VideoPlay size="20" color="#ffffff" variant="Outline" />}
                onPress={() => {}}
              />
              <MenuButton
                label="Stories"
                icon={<Story size="20" color="#ffffff" variant="Outline" />}
                onPress={() => {}}
              />
            </View>
            <View style={styles.menuRow2}>
              <MenuButton
                label="Post"
                icon={<AddSquare size="20" color="#ffffff" variant="Outline" />}
                onPress={() => {
                  animateBlurOut();
                  setTimeout(() => {
                    return router.push("/post/createPost");
                  }, 0); // match animation duration
                }}
              />
              <MenuButton
                label="Live"
                icon={<Airdrop size="20" color="#ffffff" variant="Outline" />}
                onPress={() => {
                  animateBlurOut();
                  setTimeout(() => {
                    return router.push("/live");
                  }, 100); // match animation duration
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
              }}
              onPress={animateBlurOut}
            >
              <View style={styles.iconShadow}>
                <AddCircle />
              </View>
              <Text
                style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
}

function MenuButton({ label, icon, onPress }: { label: string; icon: ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View>{icon}</View>
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -500,
  },
  menuRow1: {
    flexDirection: "row",
    marginBottom: 40,
  },
  menuRow2: {
    flexDirection: "row",
    gap: 100,
    marginBottom: 0,
  },
  menuButton: {
    backgroundColor: "#2B2C33",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#04E2D5",
    marginHorizontal: 15,
    alignItems: "center",
  },
  menuText: {
    color: "#fff",
    fontSize: 14,
  },
  iconShadow: {
    shadowColor: "#1C78FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    ...Platform.select({
      android: {
        elevation: 12,
      },
    }),
  },
});
