import AppButton from "@/app/components/AppButton";
import Form, { FormInput, FormSubmit } from "@/app/components/AppForm";
import { FormCheckbox, FormPassword } from "@/app/components/AppFormComponents";
import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import DecoratedTextField from "@/app/components/DecoratedTextField";
import { bigBlueLogo } from "@/common/assets";
import { TEXT_LIGHTER } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { Lock, Sms } from "iconsax-react-native";
import { useEffect, useLayoutEffect } from "react";
import {
  Animated,
  Image,
  Pressable,
  Text,
  useAnimatedValue,
  View
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const size = useAnimatedValue(96);
  const navigation = useRouter();

  // ✅ Zustand store
  const {
    isLoggingIn,
    error,
    isAuthenticated,
    login,
    clearError,
  } = useAuthStore();

  const handleSubmit = async (data: { email: string; password: string }) => {
    console.log("Form submitted with", data);
    await login(data.email, data.password);
  };

  // ✅ react to store changes
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("/tabs");
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: error,
      });
      clearError();
    }
  }, [error, clearError]);

  useLayoutEffect(() => {
    Animated.timing(size, {
      toValue: 96,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [size]);

  return (
    <AppScreen scrollable style={{ alignItems: "center", paddingTop: 32 }}>
      <Animated.Image
        source={bigBlueLogo}
        style={{
          width: size,
          height: size,
          marginBottom: size.interpolate({
            inputRange: [48, 96],
            outputRange: [16, 32],
          }),
          borderRadius: size.interpolate({
            inputRange: [48, 96],
            outputRange: [24, 0],
          }),
        }}
      />

      <AppText variant="design2">Welcome to Uniqnk</AppText>
      <AppText variant="bodyLg" style={AppStyles.mb}>
        Your one-stop social marketplace
      </AppText>
      {error && <Text style={{ color: "red", marginVertical: 10 }}>{error}</Text>}
      <Form
        initialValue={{ email: "", password: "" }}
        onValidate={(data) => {
          const errors: Record<string, string> = {};
          if (!data.email) errors["email"] = "This field is required";
          else if (!/.*@.*\..*/.test(data.email))
            errors["email"] = "Enter a valid email";
          if (!data.password) errors["password"] = "Password is required";
          return Object.keys(errors).length > 0 ? { errors } : null;
        }}
        onSubmit={handleSubmit}
      >
        <View style={{ width: "100%" }}>
          <FormInput
            as={DecoratedTextField}
            name="email"
            autoComplete="email"
            prefix={<Sms color={TEXT_LIGHTER} size={20} variant="Outline" />}
            placeholder="Email Address"
            outlined
          />

          <FormPassword
            name="password"
            placeholder="Password"
            outlined
            autoComplete={"password"}
            prefix={<Lock color={TEXT_LIGHTER} size={20} variant="Bold" />}
          />

          <View style={{ flexDirection: "row", display: "flex" }}>
            <FormCheckbox
              name="rememberPassword"
              style={{ marginRight: 4 }}
              label="Remember Password"
            />

            <View style={{ flexGrow: 1 }} />
            <AppButton
              variant="text"
              onPress={() => navigation.replace("/auth/forgotPassword")}
            >
              Forgot Password
            </AppButton>
          </View>

          <FormSubmit
            variant="full"
            style={[AppStyles.mt, AppStyles.mb]}
            loading={isLoggingIn}
          >
            Continue
          </FormSubmit>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <AppText variant="body1Darker">Don&apos;t have an account? </AppText>
            <Pressable onPress={() => navigation.replace("/auth/register")}>
              <AppText variant="body1Link">Sign Up</AppText>
            </Pressable>
          </View>
        </View>
      </Form>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          ...AppStyles.mt,
        }}
      >
        <AppText variant="body1Darker">Or Continue with</AppText>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 32,
          alignItems: "center",
          ...AppStyles.mt,
        }}
      >
        <AppButton
          variant="outlined"
          style={{
            height: 48,
            width: 48,
            flex: 0,
            padding: 0,
            flexGrow: 0,
            borderRadius: 32,
          }}
          onPress={() => {}}
        >
          <Image
            source={require("../../assets/social/google.png")}
            style={{ width: 24, height: 24 }}
          />
        </AppButton>
        <AppButton
          variant="outlined"
          style={{
            height: 48,
            width: 48,
            flex: 0,
            padding: 0,
            flexGrow: 0,
            borderRadius: 32,
          }}
          onPress={() => {}}
        >
          <Image
            source={require("../../assets/social/facebook.png")}
            style={{ width: 24, height: 24 }}
          />
        </AppButton>
      </View>
    </AppScreen>
  );
}
