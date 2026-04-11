// import { useAuthStore } from "@/store/useAuthStore";
// import { Notification, useNotificationStore } from "@/store/useNotificationStore";
// import { ArrowSquareLeft, More } from "iconsax-react-native";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     Animated,
//     Dimensions,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View
// } from "react-native";
// import AppScreen from "./AppScreen";
// import AppText from "./AppText";
// import AvatarImage from "./AvatarImage";
// import { ModalArgs, useOpenModal } from "./ModalContext";
// import Section from "./Section";

// const { width } = Dimensions.get("window");

// const NotificationModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
//   const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)
//     const openModal = useOpenModal();

//     // const [notifications, setNotifications] = useState<Notification | []>([])

//     const { getUserNotifications, notifications } = useNotificationStore();
//     const { users } = useAuthStore();
//     const userId = users?.data.user._id
//     const iconRefs = useRef<Record<string, View | null>>({});

//     // const [visibles, setVisible] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState<string | undefined>(undefined);
//     const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
   
//     const handleClose = () => setActiveDropdown(null);

//     useEffect(() => {
//         if (!userId) return
//         getUserNotifications(userId)
//     }, [userId])

//     console.log("userId: ", userId)
//     console.log("notifications: ", notifications)

//     // group Notifications
//     const groupNotifications = (items: Notification[]) => {
//         const groups: Record<string, Notification[]> = {}

//         const today = new Date().toDateString()
//         const yesterday = new Date(Date.now() - 86400000).toDateString()

//         items.forEach((n) => {
//         const date = new Date(n.createdAt).toDateString()

//         let label = date

//         if (date === today) label = "Today"
//         else if (date === yesterday) label = "Yesterday"

//         if (!groups[label]) groups[label] = []

//         groups[label].push(n)
//         })

//         return groups
//     }

//     const groupedNotifications = groupNotifications(notifications)

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

//     const handleOpenDropdown = (id: string) => {
//         const ref = iconRefs.current[id];

//         ref?.measureInWindow((x, y, width, height) => {
//             setDropdownPosition({
//                 x,
//                 y: y + height,
//             });

//             setActiveDropdown(id);
//         });
//     };

//     // if (isLoading) {
//     //     return (
//     //         <AppScreen>
//     //             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     //                 <ActivityIndicator size="large" color={PRIMARY} />
//     //             </View>
//     //         </AppScreen>
//     //     );
//     // }

//   return (
//     <Animated.View
//       style={[
//         styles.modal,
//         { transform: [{ translateX: slideAnim }] },
//       ]}
//     >
//         <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
//         <Section
//             as={SafeAreaView}
//             style={{
//                 width: "100%",
//                 backgroundColor: "#fff",
//                 // elevation: 4,
//                 paddingBottom: 16,
//                 // borderWidth: 1,
//             }}
//         >
//             {/* header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={dismiss}>
//                     <ArrowSquareLeft size={24} color="#000" />
//                 </TouchableOpacity>

//                 <Text style={styles.headerTitle}>Notification</Text>
//                 {/* Dummy spacer to balance the avatar on the right side */}
//                 <View style={{ width: 40 }}>
//                     <Text style={{ fontSize: 14, color: "#2956f8ff" }}>Filter</Text>
//                 </View>
//             </View>
//         </Section>
//             {notifications.length > 0 ? (<View style={{ padding: 16, gap: 20 }}>
//                 {Object.entries(groupedNotifications).map(([date, items]) => (
//                     <View key={date} style={{ gap: 20 }}>
//                     <AppText
//                         variant="body2"
//                         style={{ color: "#14151aff", fontWeight: "bold" }}
//                     >
//                         {date}
//                     </AppText>

//                     {items.map((item) => {
//                         const actor = item.actors?.flat?.()[0]
//                         console.log("actor: ", actor)

//                         return (
//                         <TouchableOpacity
//                             key={item._id}
//                             style={{
//                             flexDirection: "row",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             }}
//                         >
//                             <View
//                             style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 gap: 10,
//                             }}
//                             >
//                             <AvatarImage
//                                 size={40}
//                                 image={actor?.profilePicture}
//                             />

//                             <View
//                                 style={{
//                                 flexDirection: "column",
//                                 gap: 4,
//                                 maxWidth: width - 140,
//                                 }}
//                             >
//                                 <AppText
//                                 variant="body1Bold"
//                                 style={{ color: "#000" }}
//                                 >
//                                 {actor?.username}
//                                 {item.count > 1 && ` and ${item.count - 1} others`}
//                                 </AppText>

//                                 <AppText
//                                 variant="body2"
//                                 style={{ color: "#4e5055ff" }}
//                                 >
//                                 {item.content}
//                                 </AppText>
//                             </View>
//                             </View>

//                             <View ref={(ref) => (iconRefs.current[item._id] = ref)}>
//                                 <More onPress={() => {
//                                     // setVisible(true);
//                                     handleOpenDropdown(item._id);
//                                 }}
//                                  size="20" color="#000000" />
                                
//                                 {/* Dropdown modal */}
//                                 {/* <Modal
//                                     transparent
//                                     visible={activeDropdown === item._id}
//                                     animationType="fade"
//                                     onRequestClose={handleClose}
//                                 > */}
//                                 {activeDropdown &&
//                                     <TouchableWithoutFeedback onPress={handleClose}>
//                                         <View style={styles.backdrop}>
//                                             <TouchableWithoutFeedback>
//                                                 <View style={[styles.dropdown, {
//                                                     position: "absolute",
//                                                     top: dropdownPosition.y,
//                                                     left: dropdownPosition.x - 120,
//                                                 }]}>
//                                                     <TouchableOpacity
//                                                         style={styles.item}
//                                                         // onPress={ }
//                                                     >
//                                                         <Text style={styles.label}>Mark as read</Text>
//                                                     </TouchableOpacity>
                
//                                                     <TouchableOpacity
//                                                         style={styles.item}
//                                                         // onPress={}
//                                                     >
//                                                         <Text style={styles.label}>Unmark as read</Text>
//                                                     </TouchableOpacity>
//                                                 </View>
//                                             </TouchableWithoutFeedback>
//                                         </View>
//                                     </TouchableWithoutFeedback>}
//                                 {/* </Modal> */}
//                             </View>
//                         </TouchableOpacity>
//                         )
//                     })}
//                     </View>
//                 ))}
//             </View>) : (
//                 <View style={{ position: "relative", alignItems: "center" }}>
//                     <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: 250 }}>
//                         <AppText variant="headerXlDark">No notification yet</AppText>
//                     </View>
//                 </View>
//             )}
//         </AppScreen>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//     modal: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: "#fff",
//         // padding: 10,
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingVertical: 12,
//     },
//     headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
//     closeText: { fontSize: 20, color: "#fff" },
//     content: { flex: 1, alignItems: "center", justifyContent: "center" },
//     headerTitle: {
//         fontSize: 18,
//         lineHeight: 24,
//         letterSpacing: 0,
//         fontFamily: "Mulish",
//         fontWeight: "bold",
//         textAlign: "center",
//         color: "#474A55",
//         flex: 1, // take remaining space to center properly
//     },
//     form: {
//         flexDirection: "column",
//         gap: 5,
//         // paddingHorizontal: 20,
//         paddingVertical: 10,
//     },
//     backdrop: {
//         // flex: 1,
//         // backgroundColor: "transparent", // keep it clear but still dismiss on tap
//         // justifyContent: "flex-start",
//         // alignItems: "flex-end",
//         // paddingTop: 70, // adjust depending on header
//         // paddingRight: 12,
//         ...StyleSheet.absoluteFillObject,
//     },
//     dropdown: {
//         backgroundColor: "#fff",
//         // position: "absolute",
//         // right: 0,
//         // top: 30,
//         borderRadius: 8,
//         elevation: 4,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowOffset: { width: 0, height: 2 },
//         shadowRadius: 4,
//         minWidth: 150,
//     },
//     item: {
//         padding: 12,
//     },
//     label: {
//         fontSize: 16,
//         color: "#333",
//     },
// });

// export default NotificationModal;


import { useAuthStore } from "@/store/useAuthStore";
import { Notification, useNotificationStore } from "@/store/useNotificationStore";
import { ArrowSquareLeft, More } from "iconsax-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppScreen from "./AppScreen";
import AppText from "./AppText";
import AvatarImage from "./AvatarImage";
import { ModalArgs } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

const NotificationModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;

  const { getUserNotifications, notifications, markAsRead } = useNotificationStore();
  const { users } = useAuthStore();
  const userId = users?.data.user._id;

  const iconRefs = useRef<Record<string, View | null>>({});

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!userId) return;
    getUserNotifications(userId);
  }, [userId]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleOpenDropdown = (id: string) => {
    const ref = iconRefs.current[id];

    if (!ref) return;

    setTimeout(() => {
      ref.measureInWindow((x, y, w, h) => {
        setDropdownPosition({
          x,
          y: y + h,
        });

        setActiveDropdown(id);
      });
    }, 50);
  };

  const handleClose = () => setActiveDropdown(null);

  const groupNotifications = (items: Notification[]) => {
    const groups: Record<string, Notification[]> = {};

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    items.forEach((n) => {
      const date = new Date(n.createdAt).toDateString();

      let label = date;

      if (date === today) label = "Today";
      else if (date === yesterday) label = "Yesterday";

      if (!groups[label]) groups[label] = [];

      groups[label].push(n);
    });

    return groups;
  };

  const groupedNotifications = groupNotifications(notifications);

    const markAsReadHandler = async (notificationId: string) => {
        try {
            await markAsRead(notificationId, userId);
            await getUserNotifications(userId);
            handleClose();
        } catch (error) {
            console.log("Error:", error);
        }
    };

  return (
    <Animated.View
      style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
    >
      <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
        <Section
          as={SafeAreaView}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            paddingBottom: 16,
          }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={dismiss}>
              <ArrowSquareLeft size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Notification</Text>

            <View style={{ width: 40 }}>
              <Text style={{ fontSize: 14, color: "#2956f8ff" }}>Filter</Text>
            </View>
          </View>
        </Section>

        {notifications.length > 0 ? (
          <View style={{ padding: 16, gap: 20 }}>
            {Object.entries(groupedNotifications).map(([date, items]) => (
              <View key={date} style={{ gap: 20 }}>
                <AppText
                  variant="body2"
                  style={{ color: "#14151a", fontWeight: "bold" }}
                >
                  {date}
                </AppText>

                {items.map((item) => {
                  const actor = item.actors?.flat?.()[0];

                  return (
                    <TouchableOpacity
                      key={item._id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                        <View
                            style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            }}
                        >
                            <AvatarImage
                            size={40}
                            image={actor?.profilePicture}
                            />

                            <View
                                style={{
                                    flexDirection: "column",
                                    gap: 4,
                                    maxWidth: width - 140,
                                }}
                                >
                                <AppText variant="body1Bold" style={{ color: "#000" }}>
                                    {actor?.username}
                                    {item.count > 1 &&
                                    ` and ${item.count - 1} others`}
                                </AppText>

                                <AppText
                                    variant="body2"
                                    style={{ color: "#4e5055" }}
                                >
                                    {item.content}
                                </AppText>
                             
                            </View>

                            {!item.isRead && (
                                <View>
                                    <View style={{
                                        backgroundColor: "blue",
                                        borderRadius: 100,
                                        width: 6,
                                        height: 6,
                                    }} />
                                </View>
                            )}
                        </View>

                        <View
                            ref={(ref) => (iconRefs.current[item._id] = ref)}
                        >
                            <More
                            size={20}
                            color="#000"
                            onPress={() => handleOpenDropdown(item._id)}
                            />
                        </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <AppText variant="headerXlDark">No notification yet</AppText>
          </View>
        )}

        {/* Floating Dropdown */}
        {activeDropdown && (
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.backdrop}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.dropdown,
                    {
                      position: "absolute",
                      top: dropdownPosition.y,
                      left: dropdownPosition.x - 130,
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => markAsReadHandler(activeDropdown)} style={styles.item}>
                    <Text style={styles.label}>Mark as read</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleClose} style={styles.item}>
                    <Text style={styles.label}>cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </AppScreen>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#474A55",
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    minWidth: 160,
  },

  item: {
    padding: 12,
  },

  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default NotificationModal;