// import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowRight2, ArrowSquareLeft } from "iconsax-react-native";
import React, { useState } from "react";
import {
    // Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppScreen from "../../components/AppScreen";
import { useOpenModal } from "../../components/ModalContext";
import NotificationEmailModal from "../../components/NotificationEmailModal";
import Section from "../../components/Section";

const { width } = Dimensions.get("window");

const AccountSetting = () => {
  const openModal = useOpenModal();
  const router = useRouter();
  const [isTemporarilyDisabled, setIsTemporarilyDisabled] = useState(false);
  const goBack = () => {
    router.back();
  };

  return (
    <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust depending on header height
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <Section
                as={SafeAreaView}
                style={{
                width: "100%",
                backgroundColor: "#fff",
                paddingBottom: 16,
                }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBack}>
                        <ArrowSquareLeft size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 40 }} />
                </View>
            </Section>

            <View style={styles.settingsContent}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, width: "40%", color: "gray", lineHeight: 24 }}>Push notification Mute all</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={styles.border} />

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Likes</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Comments</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Live and reels</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>New Followers</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Mention and Tags</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Profile views</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Reposts</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Posts you interacted with</Text>
                    <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
                </View>

                <Text style={{ width: "85%", color: "gray", fontWeight: "semibold", marginBottom: 10 }}>
                    Get notifications when others comment on a post you liked or commented on
                </Text>

                <View style={styles.border} />

                <TouchableOpacity style={styles.contents} onPress={() => openModal(NotificationEmailModal, {})}>
                    <View style={styles.content} >
                        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#555555" }}>Other notifications</Text>
                        <Text style={{ color: "gray" }}>Email Notifications</Text>
                    </View>

                    <ArrowRight2
                        size="16"
                        color="#555555"
                        variant="Linear"
                    />
                </TouchableOpacity>
            </View>

            

        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Mulish",
    fontWeight: "bold",
    textAlign: "center",
    color: "#474A55",
    flex: 1,
  },
  form: {
    flexDirection: "column",
    gap: 5,
    paddingVertical: 0,
  },
  settingsContent: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
  },
  contents: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 6
  },
  content: {
    flexDirection: "column",
    gap: 6,
  },
  border: {
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 2,
  }
});

export default AccountSetting;
