import { ModalProvider } from "@/app/components/ModalProvider";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor, RootState } from '../redux/store';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [loaded, error] = useFonts({
    MulishRegular: require('../assets/fonts/Mulish-Regular.ttf'),
    MulishBold: require('../assets/fonts/Mulish-Bold.ttf'),
    MulishSemiBold: require('../assets/fonts/Mulish-SemiBold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

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
  }, []);

  if (!loaded || isFirstTime === null) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalProvider>
          <BottomSheetModalProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <MainLayout isFirstTime={isFirstTime} />
            </GestureHandlerRootView>
          </BottomSheetModalProvider>
        </ModalProvider>
      </PersistGate>
    </Provider>
  );
};

const MainLayout = ({ isFirstTime }: { isFirstTime: boolean }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!userInfo && isFirstTime) {
        router.replace('/tabs');
        // router.replace("/onboarding");
      } else if (!userInfo && !isFirstTime) {
        router.replace('/auth/login');
      } else {
        router.replace('/tabs');
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [userInfo, isFirstTime, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabs" />
      <Stack.Screen name="live" />
      <Stack.Screen name="post" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="verify/[otpVerification]" />
    </Stack>
  );
};

export default RootLayout;
