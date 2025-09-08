import { ArrowSquareLeft, Search } from "iconsax-react-native";
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
import Form, { FormInput } from "./AppForm";
import AppScreen from "./AppScreen";
import AvatarImage from "./AvatarImage";
import DecoratedTextField from "./DecoratedTextField";
import IconButton2 from "./IconButton2";
import { ModalArgs } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

const TagFriendsModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)

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

                    <Text style={styles.headerTitle}>Tag Friends</Text>
                    {/* Dummy spacer to balance the avatar on the right side */}
                    <View style={{ width: 40 }} />
                </View>
            </Section>

            <Form>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder="Search Friends list"
                    />
                </View>
            </Form>

            <View style={styles.friendSection}>
                <View style={styles.friends}>
                    <View style={styles.friend}>
                        <AvatarImage bordered image={null} size={40} />
                        <Text style={styles.friendName}>Robert Fox</Text>
                    </View>
                    <View style={styles.friend}>
                        <AvatarImage bordered image={null} size={40} />
                        <Text style={styles.friendName}>Eleanor Pena</Text>
                    </View>
                    <View style={styles.friend}>
                        <AvatarImage bordered image={null} size={40} />
                        <Text style={styles.friendName}>Theresa Webb</Text>
                    </View>
                    <View style={styles.friend}>
                        <AvatarImage bordered image={null} size={40} />
                        <Text style={styles.friendName}>Guy Hawkins</Text>
                    </View>
                </View>

                <View style={styles.friends}>
                    <Text style={styles.suggestedFriendsTitle}>Suggested</Text>
                    <View style={styles.friends}>
                        <View style={styles.friend}>
                            <AvatarImage bordered image={null} size={40} />
                            <Text style={styles.friendName}>Devon Lane</Text>
                        </View>
                        <View style={styles.friend}>
                            <AvatarImage bordered image={null} size={40} />
                            <Text style={styles.friendName}>Annette Black</Text>
                        </View>
                        <View style={styles.friend}>
                            <AvatarImage bordered image={null} size={40} />
                            <Text style={styles.friendName}>Savannah Nguyen</Text>
                        </View>
                        <View style={styles.friend}>
                            <AvatarImage bordered image={null} size={40} />
                            <Text style={styles.friendName}>Jane Cooper</Text>
                        </View>
                    </View>
                </View>
            </View>
        </AppScreen>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    modal: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#fff",
        padding: 10,
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
    friendSection: {
        paddingVertical: 20,
        flexDirection: "column",
        gap: 30,
    },
    friends: {
        flexDirection: "column",
        gap: 10,
    },
    friend: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    suggestedFriendsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#474A55",
    },
    friendName: {
        fontSize: 14,
        fontWeight: "400",
        color: "#474A55",
        fontFamily: "Satoshi",
    }
});

export default TagFriendsModal;
