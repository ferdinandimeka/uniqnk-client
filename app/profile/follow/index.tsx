import AppButton from "@/app/components/AppButton";
import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import AvatarImage from "@/app/components/AvatarImage";
import FollowBottomSheet from "@/app/components/FollowBottomSheet";
import FollowersModal from "@/app/components/FollowersModal";
import NotificationModal from "@/app/components/NotificationModal";
import Section from "@/app/components/Section";
import {
  LIGHT_GREY
} from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
// import useFlatListAPI from "@/common/utils/use_flatlist_api";
import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
import { Video } from "expo-av";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowDown2,
  ArrowSquareLeft,
  HambergerMenu,
  Notification,
} from "iconsax-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useOpenModal } from "../../components/ModalContext";

const ProfileScreenHeader = React.forwardRef<View>(function ProfileScreenHeader(_, ref) {
  const { getUserById } = useUserStore(); // ✅ get user from Zustand store
  const { posts } = usePostStore()
  // console.log("posts: ", posts)

  const [user, setUser] = React.useState({})
  const { isFollowing, notFollowing, id } = useLocalSearchParams();
  console.log("id: ", id)
  // console.log("id: ", id)

  // find total number of posts by user
  const numOfPosts = posts.filter(post => post.user === id).length
  // get user by Id
  React.useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      if (data) {
        setUser(data);
      }
    }
    fetchUser()
  }, [])

  //get number of followers
  const numOfFollowers = user?.followers?.length
  //get number of people following
  const numOfFollowing = user?.following?.length

  const openModal = useOpenModal();
  const router = useRouter();

  // convert string -> boolean
  const following = isFollowing === "true";
  const notFollow = notFollowing === "true";

  const followHandler = () => {
    if (!notFollowing) {
      openModal(FollowBottomSheet, {});
    }
  };

  // const users = users?.data?.user;

  return (
    <View
      ref={ref}
      style={{
        alignItems: "center",
        flex: 1,
        width: Dimensions.get("screen").width,
        backgroundColor: "#fff",
        paddingTop: 16,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT_GREY,
        paddingBottom: 24,
      }}
    >
      <AvatarImage size={90} />
      <AppText variant="body1Black">{user?.fullName || ""}</AppText>

      <View style={[AppStyles.row, { gap: 32 }]}>
        <View style={{ alignItems: "center" }}>
          <AppText variant="headerXlBlack">{numOfPosts}</AppText>
          <AppText variant="body1">posts</AppText>
        </View>
        <Pressable
          style={{ alignItems: "center" }}
          onPress={() => openModal(FollowersModal, { id })}
        >
          <AppText variant="headerXlBlack">{numOfFollowers}</AppText>
          <AppText variant="body1">followers</AppText>
        </Pressable>
        <Pressable
          style={{ alignItems: "center" }}
          onPress={() => openModal(FollowersModal, { id })}
        >
          <AppText variant="headerXlBlack">{numOfFollowing}</AppText>
          <AppText variant="body1">following</AppText>
        </Pressable>
      </View>

      <AppText
        variant="body1"
        style={{
          alignSelf: "center",
          paddingHorizontal: 19,
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {user?.bio ||
          "Lorem ipsum dolor sit amet consectetur. Pharetra nulla lorem justo lectus sit."}
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
});

export default function ProfileScreen() {
  // const { users } = useAuthStore(); // ✅ get user globally
  // const articles = useFlatListAPI(fetchExploreArticles, useExploreArticles);
  const router = useRouter();
  const openModal = useOpenModal();
  const { posts } = usePostStore()
  const { getUserById } = useUserStore();

  const { id } = useLocalSearchParams();
  const [user, setUser] = React.useState({})

  React.useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      if (data) {
        setUser(data);
      }
    }
    fetchUser()
  }, [])
  const userPosts = posts.filter(post => post.user._id === user._id);

  const mediaList = userPosts.flatMap(post =>
    (post.mediaUrls || []).map(url => ({
      id: post._id,
      uri: url,
      type: url.endsWith(".mp4") ? "video" : "image",
    }))
  );

  return (
    <AppScreen backgroundColor={"#fff"} noPadding>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Section style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 6,
            paddingVertical: 10,
          }}
        >
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
                gap: 4,
              }}
              onPress={() => openModal(NotificationModal, {})}
            >
              <Notification size={18} color="#8F94AA" />
              <AppText variant="body1Bold">0</AppText>
            </Pressable>

            <TouchableOpacity onPress={() => router.push("/settings")}>
              <HambergerMenu size={20} color="#8F94AA" />
            </TouchableOpacity>
          </View>
        </View>
      </Section>

      {/* Feed */}
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
