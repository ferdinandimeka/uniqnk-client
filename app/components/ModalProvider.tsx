// components/ModalProvider.tsx
import React, { ReactNode, useCallback, useState } from "react";
import { ModalArgs, ModalContext } from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [ModalComponent, setModalComponent] = useState<React.FC<ModalArgs> | null>(null);
  const [modalProps, setModalProps] = useState<any>({});
  const [visible, setVisible] = useState(false);

  const openModal = useCallback(
    <T extends React.FC<ModalArgs>>(
      Modal: T,
      args: Omit<Parameters<T>[0], "dismiss" | "visible"> & { onDismiss?: () => void }
    ) => {
      setModalComponent(() => Modal);
      setModalProps(args);
      setVisible(true);
    },
    []
  );

  const dismiss = useCallback(() => {
    setVisible(false);
    modalProps?.onDismiss?.();
  }, [modalProps]);

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      {ModalComponent && (
        <ModalComponent
          {...modalProps}
          visible={visible}
          dismiss={dismiss}
        />
      )}
    </ModalContext.Provider>
  );
};

// import React, { ReactNode, useCallback, useState } from "react";
// import {
//   Animated,
//   Easing,
//   Modal,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { ModalArgs, ModalContext } from "./ModalContext";

// export const ModalProvider = ({ children }: { children: ReactNode }) => {
//   const [ModalComponent, setModalComponent] = useState<React.FC<ModalArgs> | null>(null);
//   const [modalProps, setModalProps] = useState<any>({});
//   const [visible, setVisible] = useState(false);
//   const [fadeAnim] = useState(new Animated.Value(0));

//   // Add optional prop to control layout
//   const isFullScreen = modalProps?.fullScreen === true;

//   const openModal = useCallback(
//     <T extends React.FC<ModalArgs>>(
//       Modal: T,
//       args: Omit<Parameters<T>[0], "dismiss" | "visible"> & {
//         onDismiss?: () => void;
//         fullScreen?: boolean;
//       }
//     ) => {
//       setModalComponent(() => Modal);
//       setModalProps(args);
//       setVisible(true);

//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 200,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }).start();
//     },
//     [fadeAnim]
//   );

//   const dismiss = useCallback(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 150,
//       easing: Easing.in(Easing.ease),
//       useNativeDriver: true,
//     }).start(() => {
//       setVisible(false);
//       setModalComponent(null);
//       modalProps?.onDismiss?.();
//     });
//   }, [fadeAnim, modalProps]);

//   return (
//     <ModalContext.Provider value={{ openModal }}>
//       {children}

//       {ModalComponent && (
//         <Modal transparent visible={visible} animationType="none" onRequestClose={dismiss}>
//           <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
//             <TouchableWithoutFeedback onPress={!isFullScreen ? dismiss : undefined}>
//               <View style={[styles.container, isFullScreen && styles.fullScreen]}>
//                 <ModalComponent {...modalProps} visible={visible} dismiss={dismiss} />
//               </View>
//             </TouchableWithoutFeedback>
//           </Animated.View>
//         </Modal>
//       )}
//     </ModalContext.Provider>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     width: "90%",
//     maxHeight: "85%",
//   },
//   fullScreen: {
//     backgroundColor: "transparent",
//     width: "100%",
//     height: "100%",
//     borderRadius: 0,
//     padding: 0,
//   },
// });
