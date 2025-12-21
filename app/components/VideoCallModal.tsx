// import {
//     Call,
//     Camera,
//     VideoSlash,
//     VolumeHigh,
//     VolumeSlash
// } from "iconsax-react-native";
// import React, { useEffect, useRef } from "react";
// import {
//     Animated,
//     Dimensions,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import AppScreen from "./AppScreen";
// import AvatarImage from "./AvatarImage";
// import { ModalArgs, useOpenModal } from "./ModalContext";
// import Section from "./Section";

// const { width } = Dimensions.get("window");

// const VideoCallModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
//   const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)
//     const openModal = useOpenModal();
//     useEffect(() => {
//         if (visible) {
//         // Slide in
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: true,
//         }).start();
//         } else {
//         // Slide out
//         Animated.timing(slideAnim, {
//             toValue: width,
//             duration: 300,
//             useNativeDriver: true,
//         }).start();
//         }
//     }, [visible, slideAnim]);

//   return (
//     <Animated.View
//       style={[
//         styles.modal,
//         { transform: [{ translateX: slideAnim }] },
//       ]}
//     >
//         <AppScreen noPadding backgroundColor="#0c022eff" style={{ flex: 1 }}>
//             <Section
//                 as={SafeAreaView}
//                 style={{
//                     width: "100%",
//                     backgroundColor: "#0c022eff",
//                     // elevation: 4,
//                     paddingBottom: 16,
//                     // borderWidth: 1,
//                 }}
//             >
//                 {/* header */}
//                 <View style={styles.header}>
//                     <View style={{ flexDirection: "column", gap: 10 }}>
//                         <Text style={styles.headerTitle}>Sarah Damian</Text>
//                         <Text style={styles.headerTime}>02:35</Text>
//                     </View>
                
//                     {/* Dummy spacer to balance the avatar on the right side */}
//                     <TouchableOpacity>
//                         <AvatarImage size={100}  />
//                     </TouchableOpacity>
//                 </View>

                
//             </Section>

//             <View style={{ flexDirection: "column", gap: 40, marginTop: 0 }}>    
//                 <View style={{ justifyContent: "center", alignItems: "center", height: 400, marginBottom: 250 }}>
//                     {/* <AvatarImage size={200} /> */}
//                 </View>

//                 <View style={styles.sheet}>
//                     <View style={styles.border} />

//                     <View style={{ backgroundColor: "#c8c7c7ff", paddingHorizontal: 0, justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 20, marginTop: 10 }}>
//                         <View style={{ flexDirection: "column", gap: 10, alignItems: "center" }}>
//                             <TouchableOpacity style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}>
//                                 <VolumeHigh size={24} variant="Bold" color="#fff" />
//                             </TouchableOpacity>
//                             <Text style={{ color: "#fff", fontWeight: "400", fontSize: 11 }}>Speaker</Text>
//                         </View>

//                         <View style={{ flexDirection: "column", gap: 10, alignItems: "center" }}>
//                             <TouchableOpacity style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}>
//                                 <Camera size={24} variant="Bold" color="#fff" />
//                             </TouchableOpacity>
//                             <Text style={{ color: "#fff", fontWeight: "400", fontSize: 11 }}>Flip</Text>
//                         </View>

//                         <View style={{ flexDirection: "column", gap: 10, alignItems: "center" }}>
//                             <TouchableOpacity style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}>
//                                 <VolumeSlash size={24} variant="Bold" color="#fff" />
//                             </TouchableOpacity>
//                             <Text style={{ color: "#fff", fontWeight: "400", fontSize: 11 }}>Mute</Text>
//                         </View>

//                         <View style={{ flexDirection: "column", gap: 10, alignItems: "center" }}>
//                             <TouchableOpacity style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}>
//                                 <VideoSlash size={24} variant="Bold" color="#fff" />
//                             </TouchableOpacity>
//                             <Text style={{ color: "#fff", fontWeight: "400", fontSize: 11 }}>Video</Text>
//                         </View>

//                         <View style={{ flexDirection: "column", gap: 10, alignItems: "center" }}>
//                             <TouchableOpacity onPress={dismiss} style={{ padding: 12, backgroundColor: "#c12323ff", borderRadius: 100 }}>
//                                 <Call size={24} variant="Bold" color="#fff" />
//                             </TouchableOpacity>
//                             <Text style={{ color: "#fff", fontWeight: "400", fontSize: 11 }}>End</Text>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         </AppScreen>
//     </Animated.View>
//   );
// };

// export default VideoCallModal;

import {
  Call,
  Camera,
  VideoSlash,
  VolumeHigh,
  VolumeSlash
} from "iconsax-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "./AppScreen";
import AvatarImage from "./AvatarImage";
import { ModalArgs } from "./ModalContext";
import Section from "./Section";

// import { useAuthStore } from "@/store/useAuthStore";

const { width } = Dimensions.get("window");

const VideoCallModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  // const { users } = useAuthStore();
  // const LOCAL_USER_ID = users?.data.user._id;

  // --- STREAM HOOKS ---
  // --- STREAM HOOKS ---
  // const call = useCall(); // active call object from context
  // const { useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  // const localParticipant = useLocalParticipant();
  // const remoteParticipants = useRemoteParticipants();
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // if (!call) return null; // wait until call is available

  return (
    <Animated.View
      style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
    >
      <AppScreen noPadding backgroundColor="#0c022eff" style={{ flex: 1 }}>
        <Section
          as={SafeAreaView}
          style={{
            width: "100%",
            backgroundColor: "#0c022eff",
            paddingBottom: 16,
          }}
        >
          <View style={styles.header}>
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text style={styles.headerTitle}>Sarah Damian</Text>
              <Text style={styles.headerTime}>02:35</Text>
            </View>
            <TouchableOpacity>
              <AvatarImage size={100} />
            </TouchableOpacity>
          </View>
        </Section>

        <View style={{ flexDirection: "column", gap: 40 }}>
          <View style={{ justifyContent: "center", alignItems: "center", height: 400 }}>
          <View style={{ justifyContent: "center", alignItems: "center", height: 400 }}>
            {/* Remote participants video */}
            {/* {remoteParticipants.map((p) => (
              <View
                key={p.id}
                style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
              />
            ))}

            {/* Local participant preview */}
            {/* {localParticipant && (
              <View
                style={{
                  width: 120,
                  height: 180,
                  position: "absolute",
                  bottom: 30,
                  right: 20,
                  borderRadius: 10,
                  backgroundColor: "#222",
                }}
              /> */}
            {/* )} */}
          </View>
          <View style={styles.sheet}>
            <View style={styles.border} />
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 20 }}>
              <TouchableOpacity
                style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}
                // onPress={}
              >
                <VolumeHigh size={24} variant="Bold" color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}
                // onPress={() => (call as any)?.localVideoTrack?.switchCamera?.()}
              >
                <Camera size={24} variant="Bold" color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}
                // onPress={}
              >
                <VolumeSlash size={24} variant="Bold" color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 12, backgroundColor: "#FFFFFF99", borderRadius: 100 }}
                // onPress={() => (call as any)?.localVideoTrack?.toggleEnabled?.()}
              >
                <VideoSlash size={24} variant="Bold" color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={() => call?.leave()}
                style={{ padding: 12, backgroundColor: "#c12323ff", borderRadius: 100 }}
              >
                <Call size={24} variant="Bold" color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>
      </AppScreen>
    </Animated.View>
  );
};

export default VideoCallModal;

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#3230544c",
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Mulish",
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  headerTime: {
    fontSize: 12,
    lineHeight: 22,
    fontFamily: "Mulish",
    fontWeight: "600",
    color: "#fff",
  },
  sheet: {
    backgroundColor: "#c8c7c7ff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  border: {
    borderTopWidth: 5,
    borderTopColor: "#D9D9D9",
    marginBottom: 20,
    width: 70,
    alignSelf: "center",
    borderRadius: 25,
  },
});


