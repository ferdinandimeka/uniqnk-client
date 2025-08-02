import { ReactNode } from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { ModalArgs } from "./ModalContext";

export function Dialog(
  props: ModalArgs & { children: ReactNode; isBottomSheet?: boolean }
) {
  return (
    <Modal
      transparent
      onRequestClose={props.dismiss}
      visible={props.visible}
      animationType={props.isBottomSheet ? "slide" : "fade"}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: props.isBottomSheet ? "flex-end" : "center",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback onPress={props.dismiss}>
          <View
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              position: "absolute",
              backgroundColor: "#0007",
            }}
          />
        </TouchableWithoutFeedback>
        {props.children}
      </View>
    </Modal>
  );
}
