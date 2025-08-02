// app/auth/login.tsx
import AppButton from "@/app/components/AppButton";
import Form, { FormInput, FormSubmit } from "@/app/components/AppForm";
import { FormCheckbox, FormPassword } from "@/app/components/AppFormComponents";
import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import DecoratedTextField from "@/app/components/DecoratedTextField";
import { smallBlueLogo } from "@/common/assets";
import { LIGHT_GREY, TEXT_LIGHTER } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { useRouter } from 'expo-router';
import { Call, Lock, Sms, User } from "iconsax-react-native";
import { useLayoutEffect } from "react";
import {
  Animated,
  Image,
  Pressable,
  useAnimatedValue,
  View
} from "react-native";

export default function Register() {

  const navigation = useRouter();
  const size = useAnimatedValue(48);

    useLayoutEffect(() => {
        Animated.timing(size, {
        toValue: 48,
        duration: 300,
        useNativeDriver: false,
        }).start();
    }, [size]);
  return (
    <AppScreen scrollable style={{ alignItems: "center", paddingTop: 32 }}>
      <Animated.Image
        source={smallBlueLogo}
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
      <Form
        initialValue={{
          fullName: "",
          email: "",
          businessName: undefined,
          password: "",
        }}
        onValidate={(data) => {
          const errors = {};
          if (!data.email) {
            errors["email"] = "This field is required";
          } else if (!data.email.match(/.*@.*\..*/)) {
            errors["email"] = "Enter a valid email";
          }
          if (Object.keys(errors).length) return { errors };
        }}
        onSubmit={async (data) => {

            await signup(
              data.email,
              data.password,
              data.fullName,
              data.businessName ?? undefined
            );
        }}
      >
        <View style={{ width: "100%" }}>
          {(
            <FormInput
              as={DecoratedTextField}
              name="fullName"
              autoComplete="name"
              prefix={<User color={TEXT_LIGHTER} size={20} variant="Bold" />}
              placeholder="Full name, e.g John Doe"
              outlined
            ></FormInput>
          )}

          {(
            <FormInput
              as={DecoratedTextField}
              name="userName"
              autoComplete={"username-new"}
              prefix={<User color={TEXT_LIGHTER} size={20} variant="Bold" />}
              placeholder="User Name"
              outlined
            ></FormInput>
          )}

          <FormInput
            as={DecoratedTextField}
            name="email"
            autoComplete="email"
            prefix={<Sms color={TEXT_LIGHTER} size={20} variant="Outline" />}
            placeholder="Email Address"
            outlined
          ></FormInput>

          {(
            <FormInput
              as={DecoratedTextField}
              name="phoneNumber"
              autoComplete="tel-national"
              keyboardType="phone-pad"
              prefix={<Call color={TEXT_LIGHTER} size={20} variant="Bold" />}
              placeholder="Phone Number"
              outlined
            ></FormInput>
          )}

          <FormPassword
            name="password"
            placeholder="Password"
            outlined
            autoComplete={"new-password"}
            prefix={<Lock color={TEXT_LIGHTER} size={20} variant="Bold" />}
          />
          {(
            <FormPassword
              name="confirmPasssword"
              autoComplete="new-password"
              prefix={<User color={LIGHT_GREY} size={20} variant="Bold" />}
              placeholder="Confirm Password"
              outlined
            ></FormPassword>
          )}
          <View
            style={{
              flexDirection: "row",
              display: "none",
            }}
          >
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
          <FormSubmit variant="full" style={[AppStyles.mt, AppStyles.mb]}>Continue</FormSubmit>
          {(
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <AppText variant="body1Darker">Already have an account? </AppText>
              <Pressable onPress={() => navigation.replace("/auth/login")}>
                <AppText variant="body1Link">Login</AppText>
              </Pressable>
            </View>
          )}
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
