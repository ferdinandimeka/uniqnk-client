import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
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
import ConfirmChangeBottomSheet from "../../components/ConfirmChangeBottomSheet";
import { useOpenModal } from "../../components/ModalContext";
import Section from "../../components/Section";

const { width } = Dimensions.get("window");

const EditProfile = () => {
  const openModal = useOpenModal();
  // const [media, setMedia] = useState<string[]>([]);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const { users } = useAuthStore();
  const { updateUserById } = useUserStore();
  console.log("Current User in EditProfile:", users);
  const username = users?.data?.user?.username || "Guest";
  const name = users?.data?.user?.fullName || "Guest";
  const email = users?.data?.user?.email || "email";
  const picture = users?.data?.user.profilePicture;
  const phone = users?.data?.user.phone;
  const userId = users?.data?.user._id;

  // 🖼️ Pick Image from Gallery
    // const pickImage = async () => {
    //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //   if (status !== "granted") {
    //     Alert.alert("Permission Required", "Gallery access is needed to upload images.");
    //     return;
    //   }
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     quality: 1,
    //   });
    //   if (!result.canceled) {
    //     const newUri = result.assets[0].uri;
    //     setMedia([...media, newUri]);

    //     await updateUserById(userId, {
    //       profilePicture: newUri,
    //     });

    //     Alert.alert("Success", "Profile picture updated");
    //   }
    // };

    const handleConfirmImage = async (uri: string) => {
      try {
        await updateUserById(userId, {
          profilePicture: uri,
        });

        Alert.alert("Success", "Profile picture updated");
        setPendingImage(null);
      } catch (e) {
        Alert.alert("Error", "Failed to update profile picture");
      }
    };

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
        const uri = result.assets[0].uri;
        setPendingImage(uri);

        openModal(({ dismiss, visible }) => (
          <ConfirmChangeBottomSheet
            title="Profile Picture"
            visible={visible}
            dismiss={dismiss}
            id={undefined}
            onConfirm={async () => {
              await handleConfirmImage(uri);
              dismiss();
            }}
          />
        ), {});
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
              <AvatarImage bordered size={50} image={picture} />
              <AppText variant="body1">{username}</AppText>
              <AppText variant="body1">{email}</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <TouchableOpacity style={styles.contents} onPress={() => openModal(({ dismiss, visible }) => (
              <ChangeNameModal 
                title="Profile Name"
                placeholder="Name"
                field="fullName"
                dismiss={dismiss}
                visible={visible} id={undefined} />
            ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">{name}</AppText>
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
                 field="username"
                 dismiss={dismiss}
                 visible={visible} id={undefined} />
            ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">{username}</AppText>
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
                 field="phone"
                 dismiss={dismiss}
                 visible={visible} id={undefined} />
            ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">{phone}</AppText>
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
                 field="email"
                 dismiss={dismiss}
                 visible={visible} id={undefined} />
                ), {})}>
                <View style={styles.content}>
                    <AppText variant="body1BoldDark">{email}</AppText>
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
