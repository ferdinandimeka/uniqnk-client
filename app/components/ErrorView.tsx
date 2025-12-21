import { useErrorBoundary } from "react-error-boundary";
import { Text, View } from "react-native";
import TextStyles from "../../common/theming/text";
import AppButton from "./AppButton";

export default function ErrorView() {
  const error = useErrorBoundary();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BG,
        padding: 32,
        width: "100%",
      }}
    >
      <Text
        style={[
          TextStyles._3xlBold,
          { textAlign: "center", marginBottom: 32, color: "red" },
        ]}
      >
        Something went wrong !!!
      </Text>
      <AppButton onPress={() => error?.resetBoundary()} color="red">
        Retry
      </AppButton>

      {/* <AppButton
      loading={loggingIn}
      onPress={() => jumpTo(navigation, "Home")}
      color={Colors.SECONDARY}
    >
      SKIP
    </AppButton> */}
    </View>
  );
}
