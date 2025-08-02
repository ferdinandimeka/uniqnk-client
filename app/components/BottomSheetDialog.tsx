import { LIGHT_GREY } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { ReactNode, useEffect, useMemo } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    //   ScrollView,
    useAnimatedValue,
    View,
    ViewStyle,
} from "react-native";
import { Dialog } from "./Dialog";
import { ModalArgs } from "./ModalContext";

export function BottomSheetDialog(
  props: ModalArgs & {
    children: ReactNode;
    style?: ViewStyle | null;
    scrollable?: boolean;
    dragToClose?: boolean;
  }
) {
  const translateY = useAnimatedValue(0);
  const dismiss = props.dismiss;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dy: translateY }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gestureState) => {
          if (gestureState.dy > 50) {
            dismiss();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              // overshootClamping: true,
              tension: 1,
              friction: 20,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [dismiss, translateY]
  );

  useEffect(() => {
    translateY.resetAnimation();
  }, [props.visible, translateY]);
  const RootView =
    props.scrollable ?? true ? Animated.ScrollView : Animated.View;
  return (
    <Dialog {...props} isBottomSheet>
      <RootView
        style={[
          AppStyles.card,
          {
            maxHeight: "80%",
            minHeight: Math.min(320, Dimensions.get("screen").height),
            width: "100%",
            flex: 1,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          props.style,
          props.dragToClose
            ? {
                paddingTop: 0,
                transform: [
                  {
                    translateY: translateY.interpolate({
                      inputRange: [0, 10000],
                      outputRange: [0, 10000],
                      extrapolate: "clamp",
                    }),
                  },
                ],
                bottom: 0,
              }
            : null,
        ]}
      >
        {props.dragToClose ? (
          <View
            {...panResponder.panHandlers}
            style={{
              width: "100%",
              paddingTop: 8,
              paddingBottom: 8,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 120,
                height: 6,
                backgroundColor: LIGHT_GREY,
                borderRadius: 8,
              }}
            />
          </View>
        ) : null}
        {props.children}
      </RootView>
    </Dialog>
  );
}
