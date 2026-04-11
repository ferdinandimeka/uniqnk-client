import AppScreen from "@/app/components/AppScreen";
import { FlatList } from "react-native-gesture-handler";

import AppButton from "@/app/components/AppButton";
import AvatarImage from "@/app/components/AvatarImage";
import {
  LIGHT_GREY
} from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
// import useFlatListAPI from "@/common/utils/use_flatlist_api";
// import { useUserProfile } from "@/redux/auth/authActions";
// import { AuthState } from "@/redux/auth/authSlice";
// import {
//   fetchExploreArticles,
//   useExploreArticles,
// } from "@/redux/posts/postsActions";
// import { TabsParamList } from "@/navigation/TabsRouter";
import AppText from "@/app/components/AppText";
import React, { useEffect } from "react";
import { Dimensions, Image, Pressable, TouchableOpacity, View } from "react-native";
// import { AppScreenProps } from "../../../navigation/RootRouter";
import Section from "@/app/components/Section";
// import { useAppPadding } from "@/redux/ui/uiActions";
import FollowersModal from "@/app/components/FollowersModal";
import { useOpenModal } from "@/app/components/ModalContext";
import NotificationModal from "@/app/components/NotificationModal";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Video } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { HambergerMenu, Notification } from "iconsax-react-native";

const ProfileScreenHeader = React.forwardRef<View>(function ProfileScreenHeader(_, ref) {
    const { users } = useAuthStore(); // ✅ get user from Zustand store
    const { posts } = usePostStore()
    const { user, getUserById } = useUserStore();
    // console.log("posts: ", posts)
    // console.log("user: ", user)

    // find total number of posts by user
    const picture = users?.data?.user.profilePicture;
    const userId = users?.data?.user._id
    // const userFromAuth = users?.data?.user;
    // console.log("userFromAuth: ", userFromAuth)
    const numOfPosts = posts.filter(post => post.user._id === userId).length

    //get number of followers
    const numOfFollowers = user?.followers?.length ?? 0
    //get number of people following
    const numOfFollowing = user?.following?.length ?? 0
    const router = useRouter();
    const openModal = useOpenModal();

     useEffect(() => {
      // if (userId) {
        getUserById(userId); // ✅ fetch user data on mount
      // }
    }, [])

    const EditHandler = () => {
      // openModal(ProfileModal, {}) // 🎁 open edit profile
      router.push("/profile/editProfile")
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
        <AvatarImage image={picture} />
        <AppText variant="body1Black">{user?.fullName}</AppText>
        <View style={[AppStyles.row, { gap: 32 }]}>
          <View style={{ alignItems: "center" }}>
            <AppText variant="headerXlBlack">{numOfPosts}</AppText>
            <AppText variant="body1">posts</AppText>
          </View>
          <Pressable style={{ alignItems: "center" }} onPress={() => openModal(FollowersModal, { id: userId })}>
            <AppText variant="headerXlBlack">{numOfFollowers}</AppText>
            <AppText variant="body1">followers</AppText>
          </Pressable>
          <Pressable style={{ alignItems: "center" }} onPress={() => openModal(FollowersModal, { id: userId })}>
            <AppText variant="headerXlBlack">{numOfFollowing}</AppText>
            <AppText variant="body1">following</AppText>
          </Pressable>
        </View>

        <AppText variant="body1" style={{ alignSelf: "center", paddingHorizontal: 19, fontSize: 14 }}>
          {user?.bio}
        </AppText>

        <View style={[AppStyles.row, { gap: 8, marginTop: 16 }]}>
          <AppButton
            color={"#F1F4FF"}
            textColor={"#6B6F80"}
            style={{
              width: "auto",
              minWidth: 120,
              backgroundColor: "#F1F4FF",
              padding: 12,
              borderRadius: 16,
            }}
            onPress={EditHandler}
          >
            Edit Profile
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
          >
            Share Profile
          </AppButton>
        </View>
      </View>
    );
  }
);

export default function ProfileScreen() {
  const {users} = useAuthStore();
  const { posts } = usePostStore()
  const { getUserNotifications, notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const user = users?.data?.user;
  const userId = users?.data?.user?._id;
  // const articles = useFlatListAPI(fetchExploreArticles, useExploreArticles);
  const router = useRouter();
  const openModal = useOpenModal();
  
  useEffect(() => {
      if (!userId) return
      getUserNotifications(userId)
  }, [userId])

  const userPosts = posts.filter(post => post.user._id === userId);

  const mediaList = userPosts.flatMap(post =>
    (post.mediaUrls || []).map(url => ({
      id: post._id,
      uri: url,
      type: url.endsWith(".mp4") ? "video" : "image",
    }))
  );
  console.log("posts in profile screen: ", posts)
  return (
    <AppScreen backgroundColor={'#fff'} noPadding>
      <Stack.Screen options={{ headerShown: false }} />
      <Section style={{ width: "100%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 6, paddingVertical: 10 }}>
          <AppText variant="body1Black">{user?.username}</AppText>
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
                <AppText variant="body1Bold">{unreadCount}</AppText>
              </Pressable>

              <TouchableOpacity onPress={() => router.push('/settings')}>
                <HambergerMenu size={20} color="#8F94AA" />
              </TouchableOpacity>
          </View>
        </View>
      </Section>

      {/* <FlatList
        data={}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        ListHeaderComponent={ProfileScreenHeader}
        // data={articles.results}
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
      /> */}

      <FlatList
        data={mediaList}
        keyExtractor={(item) => item.uri}
        numColumns={3}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8, padding: 8 }}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        ListHeaderComponent={ProfileScreenHeader}
        renderItem={({ item }) => {
          const size = Dimensions.get("screen").width / 3 - 10;

          if (item.type === "video") {
            return (
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Video
                  source={{ uri: item.uri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  shouldPlay={false}
                  isMuted
                />
              </View>
            );
          }

          return (
            <Image
              source={{ uri: item.uri }}
              style={{
                width: size,
                height: size,
                borderRadius: 8,
              }}
            />
          );
        }}
      />
    </AppScreen>
  );
}
