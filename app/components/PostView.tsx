/* eslint-disable react-hooks/exhaustive-deps */
import { PRIMARY, RED } from "@/common/theming/colors";
import formatNumber from "@/common/utils/format_number";
// import { usePosts } from "@/redux/posts/postsActions";
import { Bookmark, Heart, Location, Message, Send } from "iconsax-react-native";
// import share from "@/assets/icons/Share-box.png"
import { BULLET_POINT } from "@/common/utils/unicode";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
import { Video } from "expo-av";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import AvatarImage from "./AvatarImage";
import CommentsModal from "./CommentsModal";
import IconButton2 from "./IconButton2";
import { useOpenModal } from "./ModalContext";
import Spacer from "./Spacer";

// types/PostViewProps.ts

export interface Author {
  // _id: string;
  name: string;
  photo_url: string;
}

export interface Locations {
    name?: string;
    latitude?: number;
    longitude?: number;
}

export interface PostViewProps {
  id: string;
  author: Author;
  is_liked: boolean;
  is_saved: boolean;
  num_likes: number;
  num_comments: number;
  num_saved: number;
  post: string;
  createdAt?: string;
  image?: string; // optional
  mediaUrls?: string; // optional
  location?: Locations; // optional
}

export default function PostView({
  post,
}: {
  post: PostViewProps;
}) {
  const openModal = useOpenModal();
  const { likePost, unlikePost, getPostById } = usePostStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user._id || "";
  const { followUser, unfollowUser } = useUserStore();
  const following = users?.data?.user?.following || [];

  // ✅ Local state to manage like toggle and count instantly
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.num_likes);
  const [postUser, setPostUser] = useState<string>("")
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  // Handle follow and unfollow logic
  const getDetailedPost = async () => {
    const detailedPost = await getPostById(post.id);
    // const targetUserId = detailedPost?.user?._id || detailedPost?.user;
    // Ensure targetUserId is always a string
    const targetUserId =
      typeof detailedPost?.user === "object"
        ? detailedPost.user._id // if populated user object
        : detailedPost?.user ?? ""; // if it's already an ID or undefined

    setPostUser(targetUserId); // ✅ now always a string
  }

  useEffect(() => {
    getDetailedPost();
  }, [post.id]);

   // ✅ Check if logged-in user already follows the post author
  useEffect(() => {
    if (postUser && following?.length > 0) {
      const alreadyFollowing = following.includes(postUser);
      setIsFollowing(alreadyFollowing);
    }
  }, [postUser, following]);

  const handleLikeToggle = async() => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));
      await unlikePost(post.id, userId);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      await likePost(post.id, userId)
    }
  };

  const handleFollowToggle = async() => {
    if (userId === postUser) return; // Prevent following oneself

    if (isFollowing) {
      setIsFollowing(false);
      await unfollowUser(userId, postUser.toString());
    } else {
      setIsFollowing(true);
      await followUser(userId, postUser);
    }
  }

   // ✅ Handle both single image/video or array of media
  const mediaList = Array.isArray(post.image)
    ? post.image
    : post.image
    ? [post.image]
    : post.mediaUrls || post.media || [];

    // console.log("userId: ", userId, "targetUserId: ", postUser)
    // console.log("time view: ", moment(post.createdAt).fromNow())

  return (
    <View style={{ marginTop: 24, gap: 4, flexDirection: "column" }}>
      <View style={{ flexDirection: "row", gap: 8, marginRight: 0 }}>
        <AvatarImage bordered image={post.author.photo_url} />
        <View style={{ flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
          <AppText variant="headerSm" style={{ marginTop: 4 }}>
            {post.author.name}
          </AppText>

          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <IconButton2 icon={Location} size={12} />
            <AppText variant="body2Light">{post.location?.name ? post.location?.name.split(",")[0].trim() : "Location"}</AppText>
            <AppText variant="body1">{BULLET_POINT}</AppText>
            <AppText variant="body2Light">{moment(post.createdAt).fromNow()}{" "}</AppText>
          </View>
        </View>
        <Spacer />
          <TouchableOpacity 
            style={{ backgroundColor: PRIMARY, flexDirection: "column", justifyContent: "center", alignItems: "center", borderWidth: 1, paddingHorizontal: 10, borderColor: "#fff", borderRadius: 10 }}
            onPress={handleFollowToggle}
          >
              <Text style={{ alignSelf: "center", color: "#fff" }}>{isFollowing ? "Following" : "Follow"}</Text>
          </TouchableOpacity>
        {/* <IconButton2 icon={More} /> */}
      </View>
      {/* ✅ Render images or videos */}
      {mediaList.length > 0 && (
        <View style={{ gap: 10, marginVertical: 8 }}>
          {mediaList.map((uri: string, idx: number) => {
            const isVideo = uri.match(/\.(mp4|mov|avi|mkv)$/i);
            return isVideo ? (
              <Video
                key={idx}
                source={{ uri }}
                style={{
                  width: "100%",
                  height: 300,
                  borderRadius: 16,
                }}
                // shouldPlay
                isLooping
                resizeMode="cover"
                useNativeControls
              />
            ) : (
              <Image
                key={idx}
                source={{ uri }}
                style={{
                  width: "100%",
                  height: 300,
                  borderRadius: 16,
                }}
              />
            );
          })}
        </View>
      )}
      <AppText variant="body1Darker">{post.post}</AppText>
      <View
        style={{
          flexDirection: "row",
          marginLeft: -8,
          gap: 4,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <IconButton2 
          icon={Heart} 
          active={isLiked} 
          activeColor={RED}
          onPress={handleLikeToggle}
        >
          <AppText variant="body2Dark">{formatNumber(likeCount)}</AppText>
        </IconButton2>
        <IconButton2
          icon={Message}
          onPress={() => {
            openModal(
              (props) => <CommentsModal id={post.id} {...props} />,
              {}
            );
          }}
        >
          <AppText variant="body2Dark">
            {formatNumber(post.num_comments)}
          </AppText>
        </IconButton2>
        <IconButton2 icon={Bookmark} active={post.is_saved}>
          <AppText variant="body2Dark">{formatNumber(post.num_saved)}</AppText>
        </IconButton2>
        {/* <Spacer /> */}
        <IconButton2 icon={Send} />
      </View>
    </View>
  );
}
