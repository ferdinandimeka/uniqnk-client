// import { useRouter } from "expo-router";
import { ArrowSquareLeft } from "iconsax-react-native";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppScreen from "./AppScreen";
import { ModalArgs } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

export type EmailNotificationSettings = {
  feedbackEmails: boolean;
  reminderEmails: boolean;
  promotionalEmails: boolean;
  productEmails: boolean;
  supportEmails: boolean;
};

interface EmailNotificationProps extends ModalArgs {
  emailSettings: EmailNotificationSettings;
  onChange: (key: keyof EmailNotificationSettings, value: boolean) => void;
}

const EmailNotification: React.FC<EmailNotificationProps> = ({
  dismiss,
  visible,
  emailSettings,
  onChange,
}) => {

  const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)
    // const openModal = useOpenModal();

    // const router = useRouter();
   
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

    const [localSettings, setLocalSettings] =
        React.useState<EmailNotificationSettings>(emailSettings);
    // const wasVisible = useRef(visible);

    // Sync ONLY when modal opens
    useEffect(() => {
        if (visible) {
            setLocalSettings(emailSettings);
        }
        // wasVisible.current = visible;
    }, [visible]);

    const handleToggle = (key: keyof EmailNotificationSettings, value: boolean) => {
        setLocalSettings(prev => ({
        ...prev,
        [key]: value,
        }));

        onChange(key, value);
    };

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

                <Text style={styles.headerTitle}>Email Notifications</Text>
                {/* Dummy spacer to balance the avatar on the right side */}
                <View style={{ width: 40 }} />
            </View>
        </Section>

        <View style={styles.settingsContent}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#555555" }}>Feedback emails</Text>
                    <Text style={{ color: "gray" }}>In-app feedback given</Text>
                </View>
                <Switch
                    value={localSettings.feedbackEmails}
                    onValueChange={(v) => handleToggle("feedbackEmails", v)}
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#555555" }}>Reminder emails</Text>
                    <Text style={{ color: "gray" }}>Receive notification reminders</Text>
                </View>
                <Switch
                    value={localSettings.reminderEmails}
                    onValueChange={(v) => handleToggle("reminderEmails", v)}
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#555555" }}>Promotional Emails</Text>
                    <Text style={{ color: "gray" }}>Get latest info on limited offers and services</Text>
                </View>
                <Switch
                    value={localSettings.promotionalEmails}
                    onValueChange={(v) => handleToggle("promotionalEmails", v)}
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
               <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#555555" }}>Product Emails</Text>
                    <Text style={{ color: "gray" }}>Get Info on latest updates and features</Text>
                </View>
                <Switch
                    value={localSettings.productEmails}
                    onValueChange={(v) => handleToggle("productEmails", v)}
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#555555" }}>Support Emails</Text>
                    <Text style={{ color: "gray" }}>Get Info on terms of use and guidelines</Text>
                </View>
                <Switch
                    value={localSettings.supportEmails}
                    onValueChange={(v) => handleToggle("supportEmails", v)}
                />
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
        padding: 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
    closeText: { fontSize: 20, color: "#fff" },
    content: {

    },
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
    },
    settingsContent: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        gap: 16,
        flex: 1,
    },
});

export default EmailNotification;
