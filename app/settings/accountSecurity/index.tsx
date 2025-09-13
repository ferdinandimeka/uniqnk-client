// import * as ImagePicker from "expo-image-picker";
import AuthBottomSheet from "@/app/components/AuthBottomSheet";
import ChangePasswordBottomSheet from "@/app/components/ChangePasswordBottomSheet";
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

              <Text style={styles.headerTitle}>Account Security</Text>
              <View style={{ width: 40 }} />
            </View>
          </Section>

        <View style={styles.settingsContent}>
            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
                <ChangePasswordBottomSheet
                    Password
                    title={"Change Password"}
                    dismiss={dismiss} 
                    visible={visible} 
                />
            ), {})}>
                <View style={styles.content}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "gray" }}>Password</Text>
                    <Text style={{ color: "gray" }}>Change Password</Text>
                </View>

                <ArrowRight2
                    size="16"
                    color="#555555"
                    variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
                <ChangePasswordBottomSheet
                    Pin
                    // title="Enter Current Pin"
                    dismiss={dismiss} 
                    visible={visible} 
                />
            ), {})}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "gray" }}>Transaction Pin</Text>
                    <Text style={{ color: "gray" }}>Change pin</Text>
                </View>

                <ArrowRight2
                size="16"
                color="#555555"
                variant="Linear"
                />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "grey" }}>Biometric Login</Text>
                    <Text style={{ color: "gray" }}>Enable/Disable</Text>
                </View>
                <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "grey" }}>PIN + Biometric Authentication</Text>
                    <Text style={{ color: "gray" }}>Phone Number</Text>
                </View>
                <Switch value={isTemporarilyDisabled} onValueChange={setIsTemporarilyDisabled} />
            </View>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "gray" }}>Security Question</Text>
                    <Text style={{ color: "gray" }}>Change security question</Text>
                </View>

                <ArrowRight2
                    size="16"
                    color="#555555"
                    variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
                <AuthBottomSheet
                    auth_method
                    title="Choose Authentication Method"
                    dismiss={dismiss} 
                    visible={visible} 
                />
            ), {})}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "gray" }}>Two-factor authentication</Text>
                    {/* <Text style={{ color: "gray" }}>Deactive your Uniqnk Account</Text> */}
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
    paddingVertical: 0,
    paddingHorizontal: 16,
    gap: 20,
    flex: 1,
  },
  contents: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: 10,
    paddingHorizontal: 0
  },
  content: {
    flexDirection: "column",
    gap: 6,
  },
});

export default AccountSetting;
