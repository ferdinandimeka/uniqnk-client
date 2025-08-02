import { Animated, Text, View, useAnimatedValue } from "react-native";

import { TickCircle } from "iconsax-react-native";
import { useEffect } from "react";
import { SECONDARY } from "../../common/theming/colors";
import AppStyles from "../../common/theming/styles";
import TextStyles from "../../common/theming/text";
import AppButton from "./AppButton";
import { Dialog } from "./Dialog";
import { ModalArgs } from "./ModalContext";

export default function SuccessModal({
  message,
  subMessage,
  ...props
}: {
  message: string;
  subMessage?: string;
} & ModalArgs) {
  const bounce = useAnimatedValue(0);
  useEffect(() => {
    bounce.setValue(0);
    Animated.spring(bounce, {
      toValue: 100,
      bounciness: 25,
      useNativeDriver: true,
    }).start();
  }, [bounce, props.visible]);
  return (
    <Dialog {...props}>
      <View
        style={[
          AppStyles.card,
          {
            marginHorizontal: 8,
            alignItems: "center",
            minWidth: 240,
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: bounce.interpolate({
                  inputRange: [0, 100, 120],
                  outputRange: [0.75, 1, 1.2],
                }),
              },
            ],
          }}
        >
          <TickCircle
            color={SECONDARY}
            size={56}
            style={{ marginVertical: 16 }}
          />
        </Animated.View>
        <Text style={[TextStyles.xlBold]}>{message}</Text>
        <Text style={[TextStyles.sm]}>{subMessage}</Text>
        <AppButton style={{ width: 200 }} onPress={props.dismiss}>
          Dismiss
        </AppButton>
      </View>
    </Dialog>
  );
}
