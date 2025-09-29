import AppButton from "@/app/components/AppButton";
import AppScreen from "@/app/components/AppScreen";
import AvatarImage from "@/app/components/AvatarImage";
import {
  BG,
  LIGHT_GREY
} from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import useFlatListAPI from "@/common/utils/use_flatlist_api";
import { useUserProfile } from "@/redux/auth/authActions";
import { AuthState } from "@/redux/auth/authSlice";
import {
  fetchExploreArticles,
  useExploreArticles,
} from "@/redux/posts/postsActions";
import { FlatList } from "react-native-gesture-handler";
// import { TabsParamList } from "@/navigation/TabsRouter";
import AppText from "@/app/components/AppText";
import React from "react";
import { Dimensions, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
// import { AppScreenProps } from "../../../navigation/RootRouter";
import Section from "@/app/components/Section";
// import { useAppPadding } from "@/redux/ui/uiActions";
import FollowBottomSheet from "@/app/components/FollowBottomSheet";
import FollowersModal from "@/app/components/FollowersModal";
import NotificationModal from "@/app/components/NotificationModal";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowDown2, ArrowSquareLeft, HambergerMenu, Notification } from "iconsax-react-native";
import { useOpenModal } from "../../components/ModalContext";

const ProfileScreenHeader = React.forwardRef<View, { user: AuthState["user"] }>(
  function ProfileScreenHeader({ user }, ref) {
    user = useUserProfile();
    const openModal = useOpenModal();
    const router = useRouter();
    const { isFollowing, notFollowing } = useLocalSearchParams();

    // convert string -> boolean
    const following = isFollowing === "true";
    const notFollow = notFollowing === "true";
    
    const followHandler = () => {
      if (!notFollowing) {
        openModal(FollowBottomSheet, {}) // 🎁 open edit follow
      }
      return;
    }
    return (
      // header
      <View
        ref={ref}
        style={{
          alignItems: "center",
          flex: 1,
          width: Dimensions.get("screen").width,
          backgroundColor: '#fff',
          paddingTop: 16,
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: LIGHT_GREY,
          paddingBottom: 24,
        }}
      >
        <AvatarImage />
        <AppText variant="body1Black">Dennis Ikebuiro</AppText>
         <View style={[AppStyles.row, { gap: 32 }]}>
          <View style={{ alignItems: "center" }}>
            <AppText variant="headerXlBlack">{36}</AppText>
            <AppText variant="body1">posts</AppText>
          </View>
          <Pressable style={{ alignItems: "center" }} onPress={() => openModal(FollowersModal, {})}>
            <AppText variant="headerXlBlack">{43}</AppText>
            <AppText variant="body1">followers</AppText>
          </Pressable>
          <Pressable style={{ alignItems: "center" }} onPress={() => openModal(FollowersModal, {})}>
            <AppText variant="headerXlBlack">{72}</AppText>
            <AppText variant="body1">following</AppText>
          </Pressable>
        </View>

        <AppText variant="body1" style={{ alignSelf: "center", paddingHorizontal: 19, fontSize: 14 }}>
          Lorem ipsum dolor sit amet consectetur. Pharetra nulla lorem justo lectus sit. Purus magna leo pulvinar aliquet risus. Etiam lorem sem adipiscing et. Lorem sagittis ipsum.
        </AppText>

        <View style={[AppStyles.row, { gap: 8, marginTop: 16 }]}>
          <AppButton
            color={"#F1F4FF"}
            textColor={"#fff"}
            style={{
              width: "auto",
              minWidth: 120,
              backgroundColor: following ? "#F1F4FF" : "#5c7cf3ff",
              padding: 12,
              borderRadius: 16,
            }}
            onPress={followHandler}
          >
            {following && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ color: "#6B6F80" }}>Following</Text>
              <ArrowDown2 size={16} color="#6B6F80" />
            </View>
          )}
            {notFollow && <Text style={{ color: "#fff" }}>Follow</Text>}
          </AppButton>
          <AppButton
            color={LIGHT_GREY}
            textColor={"#6B6F80"}
            style={{
              width: "auto",
              minWidth: 120,
              backgroundColor: "#F1F4FF",
              padding: 12,
              borderRadius: 16,
            }}
            onPress={() => router.push("/messages")}
          >
            Message
          </AppButton>
        </View>
      </View>
    );
  }
);

export default function ProfileScreen() {
  const user = useUserProfile();
  const articles = useFlatListAPI(fetchExploreArticles, useExploreArticles);
  const router = useRouter();
  const openModal = useOpenModal();
  // const padding = useAppPadding();
  return (
    <AppScreen backgroundColor={'#fff'} noPadding>
      <Stack.Screen options={{ headerShown: false }} />
      <Section style={{ width: "100%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 6, paddingVertical: 10 }}>
           <TouchableOpacity onPress={() => router.back()}>
                <ArrowSquareLeft size={24} color="#000" />
            </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable 
              style={{ 
                backgroundColor: "#f7f8ff", 
                borderRadius: 20, 
                paddingHorizontal: 13, 
                paddingVertical: 3, 
                flexDirection: "row",
                alignItems: "center",
                gap: 4
                }}
                onPress={() => openModal(NotificationModal, {})}
              >
                <Notification size={18} color="#8F94AA" />
                <AppText variant="body1Bold">0</AppText>
              </Pressable>

              <TouchableOpacity onPress={() => router.push('/settings')}>
                <HambergerMenu size={20} color="#8F94AA" />
              </TouchableOpacity>
          </View>
        </View>
      </Section>

      <FlatList
        // stickyHeaderIndices={[0]}
        {...articles.flatListProps}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        ListHeaderComponent={ProfileScreenHeader}
        data={articles.results}
        style={{
          width: "100%",
          flex: 1,

          backgroundColor: BG,
        }}
        contentContainerStyle={{
          gap: 8,
          width: "100%",
          // paddingHorizontal: ,
        }}
        numColumns={3}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }) => {
          return (
            <Image
              source={{ uri: item.image }}
              style={{
                width: "100%",
                height:
                  (Dimensions.get("screen").width / 3 - 16) *
                  (item.id % 5 === 0 ? 1 : 1.5),
                flex: 1,
                borderRadius: 8,
              }}
            />
          );
        }}
      />
    </AppScreen>
  );
}
