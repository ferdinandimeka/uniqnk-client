import { ModalProvider } from "@/app/components/ModalProvider";
import { useNotificationSocket } from "@/NotificationProvider";
import { useAuthStore } from "@/store/useAuthStore"; // ✅ Zustand store
import { useChatStore } from "@/store/useChatStore"; // ✅ Zustand store
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const { users } = useAuthStore();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [loaded, error] = useFonts({
    MulishRegular: require('../assets/fonts/Mulish-Regular.ttf'),
    MulishBold: require('../assets/fonts/Mulish-Bold.ttf'),
    MulishSemiBold: require('../assets/fonts/Mulish-SemiBold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const checkFirstTime = async () => {
      const appData = await AsyncStorage.getItem('isFirstTime');
      if (appData === null) {
        setIsFirstTime(true);
        await AsyncStorage.setItem('isFirstTime', 'false');
      } else {
        setIsFirstTime(false);
      }
    };
    checkFirstTime();
    if (error) throw error;
  }, []);

  // useEffect(() => {
  //   const logAsyncStorage = async () => {
  //     const keys = await AsyncStorage.getAllKeys();
  //       const stores = await AsyncStorage.multiGet(keys);
  //       console.log("📦 AsyncStorage contents:");
  //       stores.forEach(([key, value]) => {
  //         console.log(`➡️ ${key}:`, value);
  //       });
  //     await AsyncStorage.removeItem("isFirstTime");
  //   }
  //   logAsyncStorage();
  //   if (error) throw error;
  // }, [error]);

  if (!loaded || isFirstTime === null) return null;

  return (
    // <StreamVideoClient
    //   tokenEndpoint="https://uniqnk.onrender.com/token" // your backend endpoint to fetch Stream token
    //   userId={users?.data.user._id || "guest"}
    //   userName={users?.data.user.name || "Guest"}
    // >
      <ModalProvider>
        <BottomSheetModalProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <MainLayout isFirstTime={isFirstTime} />
            <Toast />
          </GestureHandlerRootView>
        </BottomSheetModalProvider>
      </ModalProvider>
    // </StreamVideoClient>
  );
};

const MainLayout = ({ isFirstTime }: { isFirstTime: boolean }) => {
  const { users } = useAuthStore(); // ✅ Zustand instead of Redux
  const userId = users?.data.user._id;
  useNotificationSocket(userId);

  useEffect(() => {
    useChatStore.getState().connectSocket(userId);
  }, [userId]);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!users && isFirstTime) {
        // router.replace('/tabs'); 
        router.replace("/onboarding");
      } else if (!users && !isFirstTime) {
        router.replace('/auth/login');
      } else {
        router.replace('./tabs');
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [users, isFirstTime, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabs" />
      <Stack.Screen name="live" />
      <Stack.Screen name="post" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="story" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth" />
      {/* <Stack.Screen name="otp" /> */}
      {/* <Stack.Screen name="verify/[otpVerification]" /> */}
    </Stack>
  );
};

export default RootLayout;

