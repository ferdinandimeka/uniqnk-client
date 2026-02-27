/* eslint-disable no-unused-expressions */
// import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { ArrowRight2, ArrowSquareLeft } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import AppText from "../../components/AppText";
import AvatarImage from "../../components/AvatarImage";
import ConfirmChangeBottomSheet from "../../components/ConfirmChangeBottomSheet";
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

  const { getUserById } = useUserStore();
  const { users } = useAuthStore(); // ✅ get user from Zustand store
  const userId = users?.data?.user._id
  const { disableAccount, enableAccount, restrictAccount, deactivateAccount } = useSettingsStore(); // ✅ get disableAccount function from Zustand store
  
  const picture = users?.data?.user.profilePicture;
  const username = users?.data?.user.username
  const fullName = users?.data?.user.fullName

  const [loading, setLoading] = useState(false);
  const [isRestricting, setIsRestricting] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const onRestrictHandler = async () => {
    setIsRestricting(true);

    try {
      await restrictAccount(userId, "User requested account restriction");
      setIsRestricting(false);
      Alert.alert("Account Restricted", "Your account has been restricted. Please contact support for more information.");
    } catch (e) {
      Alert.alert("Error", e as string)
    } finally {
      setIsRestricting(false);
    }
  };

  const onDeactivateHandler = async () => {
    try {
      await deactivateAccount(userId, "User requested account deactivation");
      Alert.alert("Account Deactivated", "Your account has been deactivated. You can re-enable it anytime by logging in.");
    } catch (error) {
      Alert.alert("Error", error as string);
    }
  }

  const onToggleDisableAccount = (value: boolean) => {
    if (loading) return;

    setPendingValue(value);   // store intent
    setConfirmVisible(true);  // open confirm modal
  };

  const confirmToggle = async () => {
    if (pendingValue === null) return;

    setConfirmVisible(false);
    setLoading(true);

    // optimistic UI
    setIsTemporarilyDisabled(pendingValue);

    try {
      pendingValue
        ? await disableAccount(userId, "User requested account disable")
        : await enableAccount(userId);
    } catch (e) {
      // rollback on failure
      setIsTemporarilyDisabled(!pendingValue);
      console.log("Toggle failed:", e);
    } finally {
      setLoading(false);
      setPendingValue(null);
    }
  };

  const cancelToggle = () => {
    setConfirmVisible(false);
    setPendingValue(null);
  };

  useEffect(() => {
    if (!confirmVisible || pendingValue === null) return;

    Alert.alert(
      pendingValue ? "Disable account?" : "Enable account?",
      pendingValue
        ? "Your account will be temporarily disabled. You can re-enable it anytime."
        : "Your account will be re-enabled.",
      [
        { text: "Cancel", style: "cancel", onPress: cancelToggle },
        { text: "Confirm", onPress: confirmToggle }
      ]
    );
  }, [confirmVisible]);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const userData = await getUserById(userId)
          console.log("Fetched user data in privacy bottom sheet: ", userData.settings?.accountStatus);
          setIsTemporarilyDisabled(userData?.settings?.accountStatus?.isDisabled || false);
        } catch (error) {
          console.log("Failed to fetch user data:", error);
        }
      };
      fetchUser();
    }
  }, [userId, getUserById]);

  console.log("pending value: ", pendingValue)

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

              <Text style={styles.headerTitle}>Settings</Text>
              <View style={{ width: 40 }} />
            </View>
          </Section>

          {/* Avatar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "column",
                gap: 6,
                alignItems: "center",
              }}
            >
              <AvatarImage  bordered size={40} image={picture} />
              <AppText variant="body1">{fullName}</AppText>
              <AppText variant="body1">@{username}</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingHorizontal: 6 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Temporarily disable account</Text>
                <Switch 
                  value={isTemporarilyDisabled} 
                  onValueChange={onToggleDisableAccount} 
                  disabled={loading}
                />
            </View>
            
            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
                <ConfirmChangeBottomSheet
                    title="Restrict Account" 
                    dismiss={dismiss} 
                    visible={visible}
                    id={undefined}
                    onConfirm={onRestrictHandler}
                />
            ), {})}>
                <View style={styles.content}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "gray" }}>Restrict Account</Text>
                    <Text style={{ color: "gray" }}>Stop transactions in emergency situations</Text>
                </View>

                <ArrowRight2
                size="16"
                color="#555555"
                variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
                <ConfirmChangeBottomSheet
                    title="Deactivate Account" 
                    dismiss={dismiss} 
                    visible={visible}
                    id={undefined}
                    onConfirm={onDeactivateHandler}
                />
            ), {})}>
                <View style={styles.content} >
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "red" }}>Close Account</Text>
                    <Text style={{ color: "gray" }}>Deactive your Uniqnk Account</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 20,
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
});

export default AccountSetting;
