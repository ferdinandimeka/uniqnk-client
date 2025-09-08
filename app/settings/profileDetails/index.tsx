import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowRight2, ArrowSquareLeft } from "iconsax-react-native";
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
    View
} from "react-native";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import AvatarImage from "../../components/AvatarImage";
import ChangeNameModal from "../../components/ChangeNameModal";
import { useOpenModal } from "../../components/ModalContext";
import Section from "../../components/Section";

const { width } = Dimensions.get("window");

const EditProfile = () => {
  const openModal = useOpenModal();
  const [media, setMedia] = useState<string[]>([]);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  // 🖼️ Pick Image from Gallery
    const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Gallery access is needed to upload images.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setMedia([...media, result.assets[0].uri]);
      }
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

              <Text style={styles.headerTitle}>Profile Details</Text>
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
              <AvatarImage bordered size={40} />
              <AppText variant="body1">Dennis Ikebuiro</AppText>
              <AppText variant="body1">@DennisK</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
              <ChangeNameModal 
                title="Profile Name" 
                placeholder="Name" 
                dismiss={dismiss} 
                visible={visible} 
              />
            ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">Name</AppText>
                    <Text style={{ color: "gray" }}>Change name</Text>
                </View>

                <ArrowRight2
                size="16"
                color="#555555"
                variant="Linear"
                />
            </TouchableOpacity>

             <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
              <ChangeNameModal 
                title="User Name" 
                placeholder="Username" 
                dismiss={dismiss} 
                visible={visible} 
              />
            ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">Username</AppText>
                    <Text style={{ color: "gray" }}>Change username</Text>
                </View>

                <ArrowRight2
                size="16"
                color="#555555"
                variant="Linear"
                />
            </TouchableOpacity>

             <TouchableOpacity style={styles.contents} onPress={pickImage}>
                <View style={styles.content} >
                    <AppText variant="body1BoldDark">Profile picture</AppText>
                    <Text style={{ color: "gray" }}>Change profile picture</Text>
                </View>

                <ArrowRight2
                size="16"
                color="#555555"
                variant="Linear"
                />
            </TouchableOpacity>

             <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
              <ChangeNameModal 
                title="Phone Number" 
                placeholder="Phone Number" 
                dismiss={dismiss} 
                visible={visible} 
              />
            ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">+2348037610592</AppText>
                    <Text style={{ color: "gray" }}>Change phone number</Text>
                </View>

                <ArrowRight2
                size="16"
                color="#555555"
                variant="Linear"
                />
            </TouchableOpacity>

             <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
                <ChangeNameModal 
                    title="Email Address" 
                    placeholder="Email" 
                    dismiss={dismiss} 
                    visible={visible} 
                />
                ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">FerdinandImeka@gmail.com</AppText>
                    <Text style={{ color: "gray" }}>Change email</Text>
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

export default EditProfile;
