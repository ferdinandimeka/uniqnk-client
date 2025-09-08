import { AddCircle, ArrowSquareLeft } from "iconsax-react-native";
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
import Form, { FormInput, FormLabel } from "./AppForm";
import AppScreen from "./AppScreen";
import AppText from "./AppText";
import AvatarImage from "./AvatarImage";
import DecoratedTextField from "./DecoratedTextField";
import { ModalArgs, useOpenModal } from "./ModalContext";
import ProfileGenderBottomSheet from "./ProfileGenderBottomSheet"; // Adjust the import path as needed
import Section from "./Section";

const { width } = Dimensions.get("window");

const ProfileModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
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

                <Text style={styles.headerTitle}>Edit Profile</Text>
                {/* Dummy spacer to balance the avatar on the right side */}
                <View style={{ width: 40 }} />
            </View>
        </Section>

        <View 
            style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "center", 
                paddingBottom: 20 
            }}
        >
            <TouchableOpacity style={{ flexDirection: "column", gap: 6, alignItems: "center" }}>
                <View style={{ position: "relative" }}>
                    <AvatarImage bordered size={40} />
                    <AddCircle size={15} color="#384CFF" variant="Bold" style={{ position: "absolute", top: 30, left: 12  }} />
                </View>
                <AppText variant="buttonTextPrimary">Edit Picture</AppText>
            </TouchableOpacity>
        </View>

        <Form>
            <View
                style={{
                    flexDirection: "column",
                    gap: 35,
                }}
            >
                <View style={styles.form}>
                    <FormLabel required={false} label="Name" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder=""
                        value="Dennis Ikebuiro"
                    />
                </View>

                <View style={styles.form}>
                    <FormLabel required={false} label="Username" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder=""
                        value="@DennisDMenace"
                    />
                </View>

                <View style={styles.form}>
                    <FormLabel required={false} label="Phone Number" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder=""
                        value="+234 817 8984 8989"
                    />
                </View>

                <View style={styles.form}>
                    <FormLabel required={false} label="Email" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder=""
                        value="DennisIkebuiro@gmail.com"
                    />
                </View>

                <View style={styles.form}>
                    <FormLabel required={false} label="Bio" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder=""
                        value="Lorem ipsum dolor sit amet consectetur. Sit at ullamcorper viverra tincidunt nascetur eget."
                    />
                </View>

                <View style={styles.form}>
                    <FormLabel required={false} label="Gender" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        multiline={true}
                        outlined
                        noMargin
                        placeholder=""
                        value="DennisIkebuiro@gmail.com"
                        onOpenDropdown={() => openModal(ProfileGenderBottomSheet, {})}
                    />
                </View>

                <View style={styles.form}>
                    <FormLabel required={false} label="Marital Status" labelStyle={{ fontWeight: "bold", marginLeft: 20 }} />
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        // prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder=""
                        value="DennisIkebuiro@gmail.com"
                    />
                </View>
            </View>
        </Form>
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
    form: {
        flexDirection: "column",
        gap: 5,
        // paddingHorizontal: 20,
        paddingVertical: 10,
    }
});

export default ProfileModal;
