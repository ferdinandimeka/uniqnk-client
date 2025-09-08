import { useRouter } from "expo-router";
import { AddCircle, ArrowSquareLeft } from "iconsax-react-native";
import React from "react";
import {
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

const { width } = Dimensions.get("window");

const EditProfile = () => {
  const openModal = useOpenModal();
  const router = useRouter();
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

              <Text style={styles.headerTitle}>Edit Profile</Text>
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
            <View
              style={{
                flexDirection: "column",
                gap: 15,
                paddingHorizontal: 10,
              }}
            >
              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Name"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="name"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value="Dennis Ikebuiro"
                />
              </View>

              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Username"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="username"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value="@DennisDMenace"
                />
              </View>

              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Phone Number"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="phone number"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value="+234 817 8984 8989"
                />
              </View>

              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Email"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="email"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value="DennisIkebuiro@gmail.com"
                />
              </View>

              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Bio"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="bio"
                  containerStyle={{ flex: 1 }}
                  multiline={true}
                  outlined
                  noMargin
                  placeholder=""
                  value="Lorem ipsum dolor sit amet consectetur. Sit at ullamcorper viverra tincidunt nascetur eget."
                />
              </View>

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
                  value="Male"
                  onOpenDropdown={() => openModal(ProfileGenderBottomSheet, {})}
                />
              </View>

              <View style={styles.form}>
                <FormLabel
                  required={false}
                  label="Marital Status"
                  labelStyle={{ fontWeight: "bold", marginLeft: 20 }}
                />
                <FormInput
                  as={DecoratedTextField}
                  name="marital status"
                  containerStyle={{ flex: 1 }}
                  outlined
                  noMargin
                  placeholder=""
                  value="Single"
                  onOpenDropdown={() =>
                    openModal(ProfileMaritalStatusBottomSheet, {})
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
