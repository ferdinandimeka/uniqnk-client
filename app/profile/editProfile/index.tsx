import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { AddCircle, ArrowSquareLeft } from "iconsax-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Form, { FormInput, FormLabel } from "../../components/AppForm";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import AvatarImage from "../../components/AvatarImage";
import DecoratedTextField from "../../components/DecoratedTextField";
import { useOpenModal } from "../../components/ModalContext";
import ProfileGenderBottomSheet from "../../components/ProfileGenderBottomSheet";
import ProfileMaritalStatusBottomSheet from "../../components/ProfileMaritalStatusBottomSheet";
import Section from "../../components/Section";
// import { updateUserProfile } from "@/app/api/user"; // 🔹 create this API function

const { width } = Dimensions.get("window");

const EditProfile = () => {
  const openModal = useOpenModal();
  const router = useRouter();
  const goBack = () => router.back();

  const { users } = useAuthStore(); // ✅ from Zustand
  const user = users?.data?.user
  // console.log("user from login: ", user)
  const { updateUserById } = useUserStore(); // ✅ from Zustand
  console.log("user from userstore: ", user)

  const [ isLoading, setIsLoading ] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    username: user?.username || "",
    phone: user?.phone || "",
    email: user?.email || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
    maritalStatus: user?.marital_status || "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserById(user?._id ?? "", formData)
      setIsLoading(false);
      // setUser(updated); // ✅ sync back to Zustand
      // console.log("updated: ", updated)
      Alert.alert("Profile Updated", "Your profile has been successfully updated.");
      // router.back();
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert("Error", err?.message || "Failed to update profile.");
    }
  };

  return (
    <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
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

              <Text style={styles.headerTitle}>Edit Profile</Text>

              {/* Save Button */}
              <TouchableOpacity onPress={handleSave}>
                <Text style={{ color: "#384CFF", fontWeight: "bold" }}>{isLoading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
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
              <View style={{ position: "relative" }}>
                <AvatarImage bordered size={40} />
                <AddCircle
                  size={15}
                  color="#384CFF"
                  variant="Bold"
                  style={{ position: "absolute", top: 30, left: 12 }}
                />
              </View>
              <AppText variant="buttonTextPrimary">Edit Picture</AppText>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <Form>
            <View style={{ flexDirection: "column", gap: 15, paddingHorizontal: 10 }}>
              {[
                { label: "Name", key: "name" },
                { label: "Username", key: "username" },
                { label: "Phone Number", key: "phone" },
                { label: "Email", key: "email" },
                { label: "Bio", key: "bio", multiline: true },
              ].map((field) => (
                <View key={field.key} style={styles.form}>
                  <FormLabel
                    required={false}
                    label={field.label}
                    labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                  />
                  <FormInput
                    as={DecoratedTextField}
                    name={field.key}
                    containerStyle={{ flex: 1 }}
                    outlined
                    noMargin
                    placeholder=""
                    multiline={field.multiline}
                    value={formData[field.key as keyof typeof formData]}
                    onChangeText={(text: string) => handleChange(field.key, text)}
                  />
                </View>
              ))}

              {/* Gender */}
              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Gender"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="gender"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value={formData.gender}
                  onChangeText={(val: string) => handleChange("gender", val)}
                  onOpenDropdown={() =>
                    openModal(ProfileGenderBottomSheet, {
                      onSelect: (val: string) => handleChange("gender", val),
                    })
                  }
                />
              </View>

              {/* Marital Status */}
              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Marital Status"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="maritalStatus"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value={formData.maritalStatus}
                  onChangeText={(val: string) => handleChange("maritalStatus", val)}
                  onOpenDropdown={() =>
                    openModal(ProfileMaritalStatusBottomSheet, {
                      onSelect: (val: string) => handleChange("maritalStatus", val),
                    })
                  }
                />
              </View>
            </View>
          </Form>
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
    paddingHorizontal: 16,
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
});

export default EditProfile;
