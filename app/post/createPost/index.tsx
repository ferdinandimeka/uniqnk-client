import AppScreen from "@/app/components/AppScreen";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import * as ImagePicker from "expo-image-picker";
import * as Locations from 'expo-location';
import { Stack, useRouter } from "expo-router"; // Adjust the import path as needed
import { ArrowSquareLeft, Camera, GalleryImport, Location, Tag, Video } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { TextInput } from "react-native-gesture-handler"; // Adjust the import path as needed
import AvatarImage from "../../components/AvatarImage";
import { useOpenModal } from "../../components/ModalContext";
import PostBottomSheet from "../../components/PostBottomSheet";
import Section from "../../components/Section";
import SelectLocationModal from "../../components/SelectLocationModal";
import TagFriendsModal from "../../components/TagFriendsModal";

const LitPostScreen = () => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [location, setLocation] = useState<{ name?: string; latitude?: number; longitude?: number }>({});
  const { createPost } = usePostStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user._id || "";
  const profilePhoto = users?.data?.user.profilePicture || "";
//   const [showTagModal, setShowTagModal] = useState(false);
//   const { height, width } = Dimensions.get("window");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Locations.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const loc = await Locations.getCurrentPositionAsync({});
      const reverseGeocode = await Locations.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const place = reverseGeocode[0];
      const name = place
        ? `${place.city || place.region || ''}, ${place.country || ''}`.trim()
        : 'Unknown location';

      setLocation({
        name,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

   // 📸 Take Photo with Camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera access is needed to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setMedia([...media, result.assets[0].uri]);
    }
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

  // 🎥 Pick Video from Gallery
  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Gallery access is needed to upload videos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      setMedia([...media, result.assets[0].uri]);
    }
  };

    const openModal = useOpenModal();

    const TagHandler = () => {
      openModal(TagFriendsModal, {}) // 🎁 open tags
    }

    const LocationHandler = () => {
        openModal(SelectLocationModal, {}) // 📍 open location selection
    }

    // const postHandler = () => {
    //     openModal(PostBottomSheet, {}) // open post bottom sheet
    // }

    const postHandler = async () => {
        if (!text.trim() && media.length === 0) {
            Alert.alert("Empty Post", "Please add text or media before posting.");
            return;
        }

        try {
            openModal(PostBottomSheet, {});

            const result = await createPost({
                content: text,
                mediaUrls: media,
                user: userId,
                location
            // Add other post fields as necessary
            });

            if (result) {
            openModal(PostBottomSheet, {});
            setText("");
            setMedia([]);
            } else {
            Alert.alert("Error", "Failed to create post. Please try again.");
            }
        } catch (err) {
            console.error("Error creating post:", err);
            Alert.alert("Error", "Something went wrong while creating your post.");
        }
    };


  return (
    <AppScreen noPadding style={styles.container}>
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <Stack.Screen options={{ headerShown: false }} />
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
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 20}}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowSquareLeft size={24} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <AvatarImage bordered image={profilePhoto} size={30} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.headerTitle}>Create Post</Text>
                    {/* Dummy spacer to balance the avatar on the right side */}
                    <View style={{ width: 70 }} />
                </View>
            </Section>

            {/* Post creation form */}
            <Section style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 10, flexDirection: "column", backgroundColor: "#fff" }}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Share your thoughts here..."
                    multiline
                    value={text}
                    onChangeText={setText}
                />
                {/* Uploaded media preview */}
                {media.length > 0 && (
                    <View style={styles.mediaContainer}>
                    {media.map((uri) => (
                        <Image key={uri} source={{ uri }} style={styles.mediaImage} />
                    ))}
                    </View>
                )}
                {/* selection */}
                <View style={styles.selectionContainer}>
                    <TouchableOpacity onPress={openCamera} style={{ backgroundColor: "#FFFDD6", borderRadius: 100, padding: 12, alignSelf: "center" }}>
                        <Camera size={20} color="#101D55" variant="Bold"  />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#ffdbd6", borderRadius: 100, padding: 12, alignSelf: "center" }}>
                        <GalleryImport size={20} color="#101D55" variant="Bold" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickVideo} style={{ backgroundColor: "#d6d7ff", borderRadius: 100, padding: 12, alignSelf: "center" }}>
                        <Video size={20} color="#101D55" variant="Bold"  />
                    </TouchableOpacity>
                </View>

                <View style={styles.tagContainer}>
                    <TouchableOpacity style={styles.tagButton} onPress={TagHandler}>
                        <Tag size={17} color="#8F94AA" variant="Bold" />
                        <Text style={{ color: "#6B6F80", fontSize: 14 }}>Tag Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton} onPress={LocationHandler}>
                        <Location size={17} color="#8F94AA" variant="Bold" />
                        <Text style={{ color: "#6B6F80", fontSize: 14 }}>Location</Text>
                    </TouchableOpacity>
                </View>
            </Section>
        </ScrollView>

        <TouchableOpacity style={{ bottom: 20, alignSelf: "center", borderRadius: 32, backgroundColor: "#00A3FF", width: "90%", padding: 16 }} onPress={postHandler}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Post</Text>
        </TouchableOpacity>
    </AppScreen>
  );
};

export default LitPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textInput: {
        height: 134,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        color: "#6B6F80"
    },
    mediaContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        // paddingBottom: 20
    },
    mediaImage: {
        height: 289,
        width: Dimensions.get("window").width * 0.9,
        borderRadius: 20
    },
    selectionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        paddingVertical: 12,
        alignSelf: "flex-start",
        height: 54
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
    tagContainer: {
        flexDirection: "column",
        marginTop: 10,
        gap: 15,
        alignItems: "flex-start"
    },
    tagButton: {
        flexDirection: "row",
        gap: 5,
    }
});

