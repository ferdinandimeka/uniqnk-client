import { bigBlueLogo } from "@/common/assets";
import { TEXT_LIGHTER } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
// import formatError from "@/common/utils/format_error";
import AppButton from "@/app/components/AppButton";
import Form, { FormInput, FormSubmit } from "@/app/components/AppForm";
import { FormCheckbox, FormPassword } from "@/app/components/AppFormComponents";
import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import DecoratedTextField from "@/app/components/DecoratedTextField";
// import { useAuth, useLogin, useSignUp } from "@/data/features/auth/authActions";
// import { CLEAR_LOGIN_ERROR } from "@/data/features/auth/authSlice";
// import { DONE_WELCOME } from "@/data/features/ui/uiSlice";
// import { AppDispatch, RootState } from "@/data/store";
// import { AppScreenProps, RootParamList } from "@/navigation/RootRouter";
import { useRouter } from 'expo-router';
import { Lock, Sms } from "iconsax-react-native";
import { useLayoutEffect } from "react";
import {
  Animated,
  Image,
  Pressable,
  useAnimatedValue,
  View,
} from "react-native";
// import { useDispatch, useSelector } from "react-redux";

export default function LoginScreen() {
  // const [loggingIn, setIsLoggingIn] = useState(route.name === "Login");

  // const login = useLogin();
  // const signup = useSignUp();
  // const dispatch = useDispatch<AppDispatch>();
  // const doneWelcome = useSelector((e: RootState) => e.ui.welcome_shown);
  // console.log({ doneWelcome });
  // useEffect(() => {
  //   if (!doneWelcome) dispatch({ type: DONE_WELCOME });
  // }, [doneWelcome, dispatch]);
  // const error = useAuth().loginError;

  // useEffect(() => {
  //   if (error) {
  //     Toast.show({
  //       type: "error",
  //       text1: error.error || formatError(error.detail),
  //       text2: error.error && formatError(error.detail),
  //     });
  //     return () => {
  //       dispatch({ type: CLEAR_LOGIN_ERROR });
  //     };
  //   }
  // }, [error, dispatch]);
  const size = useAnimatedValue(96);
  const navigation = useRouter();

  const handleSubmit = () => {
    navigation.replace("/tabs");
  }

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
          await login(data.email, data.password);
        }}
      >
        <View style={{ width: "100%" }}>
          <FormInput
            as={DecoratedTextField}
            name="email"
            autoComplete="email"
            prefix={<Sms color={TEXT_LIGHTER} size={20} variant="Outline" />}
            placeholder="Email Address"
            outlined
          ></FormInput>

          <FormPassword
            name="password"
            placeholder="Password"
            outlined
            autoComplete={"password"}
            prefix={<Lock color={TEXT_LIGHTER} size={20} variant="Bold" />}
          />

          <View
            style={{
              flexDirection: "row",
              display: "flex",
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
          <FormSubmit onPress={handleSubmit} variant="full" style={[AppStyles.mt, AppStyles.mb]}>Continue</FormSubmit>
          {/* {!loggingIn ? ( */}
            {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <AppText variant="body1Darker">Already have an account? </AppText>
              <Pressable onPress={() => setIsLoggingIn(true)}>
                <AppText variant="body1Link">Sign In</AppText>
              </Pressable>
            </View> */}
          {/* ) : ( */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <AppText variant="body1Darker">Don't have an account? </AppText>
              <Pressable onPress={() => navigation.replace("/auth/register")}>
                <AppText variant="body1Link">Sign Up</AppText>
              </Pressable>
            </View>
          {/* )} */}
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
