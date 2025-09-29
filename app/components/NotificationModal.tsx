import { ArrowSquareLeft, More } from "iconsax-react-native";
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
import AppText from "./AppText";
import AvatarImage from "./AvatarImage";
import { ModalArgs, useOpenModal } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

const NotificationModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)
    const openModal = useOpenModal();
    useEffect(() => {
        if (visible) {
        // Slide in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        } else {
        // Slide out
        Animated.timing(slideAnim, {
            toValue: width,
            duration: 300,
            useNativeDriver: true,
        }).start();
        }
    }, [visible, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.modal,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
        <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
        <Section
            as={SafeAreaView}
            style={{
                width: "100%",
                backgroundColor: "#fff",
                // elevation: 4,
                paddingBottom: 16,
                // borderWidth: 1,
            }}
        >
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={dismiss}>
                    <ArrowSquareLeft size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Notification</Text>
                {/* Dummy spacer to balance the avatar on the right side */}
                <View style={{ width: 40 }}>
                    <Text style={{ fontSize: 14, color: "#2956f8ff" }}>Filter</Text>
                </View>
            </View>
        </Section>

        <View style={{ padding: 16, gap: 20 }}>
            <AppText variant="body2" style={{ color: "#14151aff", fontWeight: "bold" }}>Today</AppText>
            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>
        </View>

         <View style={{ padding: 16, gap: 20 }}>
            <AppText variant="body2" style={{ color: "#14151aff", fontWeight: "bold" }}>Yesterday</AppText>
            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>
        </View>

         <View style={{ padding: 16, gap: 20 }}>
            <AppText variant="body2" style={{ color: "#14151aff", fontWeight: "bold" }}>Saturday, 26 August</AppText>
            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={{ 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AvatarImage 
                        size={40}
                    />

                    <View style={{ flexDirection: "column", gap: 4, maxWidth: width - 140 }}>
                        <AppText variant="body1Bold" style={{ color: "#000" }}>John Doe</AppText>
                        <AppText variant="body2" style={{ color: "#4e5055ff" }}>Liked your photo</AppText>
                    </View>
                </View>

                <More
                    size="20"
                    color="#000000"
                />
            </TouchableOpacity>
        </View>
                
        </AppScreen>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    modal: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#fff",
        // padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
    closeText: { fontSize: 20, color: "#fff" },
    content: { flex: 1, alignItems: "center", justifyContent: "center" },
    headerTitle: {
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
        fontFamily: "Mulish",
        fontWeight: "bold",
        textAlign: "center",
        color: "#474A55",
        flex: 1, // take remaining space to center properly
    },
    form: {
        flexDirection: "column",
        gap: 5,
        // paddingHorizontal: 20,
        paddingVertical: 10,
    }
});

export default NotificationModal;
