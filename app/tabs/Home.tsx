/* eslint-disable react-hooks/exhaustive-deps */
import AppHeader from "@/app/components/AppHeader";
import AppIcon from "@/app/components/AppIcon";
import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import CreateStoryBottomSheet from "@/app/components/CreateStoryBottomSheet";
import PostView from "@/app/components/PostView";
import Section from "@/app/components/Section";
import StoryViewerModal from "@/app/components/StoryBottomSheet";
import StoryCircle from "@/app/components/StoryCircle";
import { LIGHT_GREY, PRIMARY, WHITE } from "@/common/theming/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { useStoryStore } from "@/store/useStoryStore";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { posts, isLoading, error, getAllPosts } = usePostStore();
  const { users } = useAuthStore();
  console.log("user: ", users)
  // const { user } = useUserStore();
  // const userId = users?._id || null;
  const userid = users?.data.user._id || null;
  const profilePicture = users?.data?.user.profilePicture

  const router = useRouter()

  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const { stories, getAllStories } = useStoryStore();
  // console.log("stories: ", stories)

  useFocusEffect(
    useCallback(() => {
      getAllStories();
      // getAllPosts();
    }, [])
  );

 // ✅ Enhanced Helper function to group stories by user and normalize story fields
  const groupStoriesByUser = (stories: any[]) => {
    const grouped: Record<string, any> = {};

    stories.forEach((story) => {
      const userId = story.user?._id;
      if (!userId) return;

      // Initialize group if user not yet added
      if (!grouped[userId]) {
        grouped[userId] = {
          userId,
          username: story.user.username,
          profilePicture: story.user.profilePicture,
          stories: [],
        };
      }

      // Determine story type (text, image, or video)
      let type: "text" | "image" | "video" = "text";
      if (story.contentType === "image") type = "image";
      if (story.contentType === "video") type = "video";

      // Normalize each story object
      const formattedStory = {
        _id: story._id,
        type,
        text: story.text || "",
        backgroundColor: story.backgroundColor || "#000",
        mediaUrl: story.contentUrl || "", // for image or video
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
      };

      grouped[userId].stories.push(formattedStory);
    });

    return Object.values(grouped);
  };

  // // Group stories by userId
  // const groupedStories = useMemo(() => groupStoriesByUser(stories), [stories]);
  // console.log("groupedStories: ", groupedStories)

  // Add "Add New Story" circle at the beginning for the current user
  const storyListData = useMemo(() => {
    const grouped = groupStoriesByUser(stories);

    // Add "Add New Story" item for current user
    const userHasStories = grouped.some((g) => g.userId === userid);

    if (!userHasStories) {
      // If user has no stories, add "add" circle only
      grouped.unshift({
        userId: userid,
        username: users?.data.user.username,
        profilePicture: profilePicture,
        stories: [],
        isAddCircle: true,
      });
    } else {
      // If user already has stories, add separate add-circle at index 0
      grouped.unshift({
        userId: userid,
        username: users?.data.user.username,
        profilePicture: profilePicture,
        stories: [],
        isAddCircle: true,
      });
    }

    return grouped;
  }, [stories, userid, users, profilePicture]);

 

  useEffect(() => {
      getAllPosts();
  }, []); // <-- prevent infinite loop

  // console.log("Home view: ", posts)

  const padding = 16;

  if (isLoading) {
    return (
      <AppScreen>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen>
        <AppText variant="body1Dark" style={{ textAlign: "center", marginTop: 20 }}>
          {error}
        </AppText>
      </AppScreen>
    );
  }

  // const navigate = (id: string) => {
  //   router.push({
  //     pathname: "/post/postDetails",
  //     params: { id },
  //   });
  // };

  return (
    <AppScreen noSafeArea noPadding>
      <Section
        as={SafeAreaView}
        style={{
          width: "100%",
          backgroundColor: WHITE,
          elevation: 4,
          paddingBottom: 16,
          borderColor: LIGHT_GREY,
          borderWidth: 1,
        }}
      >
        <AppHeader disableBack actions={["search", "messages", "notifications"]}>
          <AppIcon size={45} />
          <View style={{ marginRight: 8 }} />
          <AppText variant="header2XlBlack">Uniqnk</AppText>
          <View style={{ flex: 1 }} />
        </AppHeader>

        {/* Stories Section (placeholder) */}
       <FlatList
        horizontal
        data={storyListData}
        keyExtractor={(item) => item.userId + (item.isAddCircle ? "-add" : "")}
        ListEmptyComponent={<ActivityIndicator />}
        contentContainerStyle={{ paddingVertical: 5, gap: 6 }}
        renderItem={({ item }) => (
          <StoryCircle
            image={item.profilePicture}
            username={item.isAddCircle ? "Add Story" : item.username}
            isUser={item.userId === userid && item.isAddCircle}
            onPress={() => {
              if (item.isAddCircle) {
                // Open create story modal
                setVisible(true);
              } else if (item.userId === userid) {
                // View your existing stories
                setSelectedStory(item);
                setIsStoryOpen(true);
              } else {
                // View others' stories
                setSelectedStory(item);
                setIsStoryOpen(true);
              }
            }}
          />
        )}
      />


      <CreateStoryBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        userImage={profilePicture}
        onSelectOption={(option) => {
          if (option === "photo"){
            router.push("/story/createPhoto")
          };
          if (option === "video") {
            router.push("/story/createVideo")
          };
          if (option === "text") {
            router.push("/story/createText")
          }
        }}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal
        visible={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        stories={selectedStory?.stories || []}
        username={selectedStory?.username || ""}
        userPhoto={selectedStory?.profilePicture || ""}
      />

      </Section>

      {/* Posts Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        style={{
          paddingTop: 16,
          width: "100%",
          flex: 1,
          backgroundColor: WHITE,
          paddingHorizontal: padding,
        }}
        contentContainerStyle={{
          gap: 8,
          width: "100%",
          paddingBottom: 150,
        }}
        // renderItem={({ item }) => <PostView post={item} />}
        renderItem={({ item }) => {
          // Map backend response to PostView’s expected props
          const mappedPost = {
            id: item._id,
            author: {
              name: item.user?.fullName || "Anonymous",
              photo_url:
                item.user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            },
            location: item.location,
            post: item.content,
            createdAt: item.createdAt,
            image: item.mediaUrls?.[0],
            // image: item.mediaUrls && item.mediaUrls.length > 0 ? item.mediaUrls : [], // 👈 pass all images
            is_liked: false,
            is_saved: false,
            num_likes: item.likes?.length || 0,
            num_comments: item.comments?.length || 0,
            num_saved: item.shares?.length || 0,
          };

          return <PostView post={mappedPost} />
          // <TouchableOpacity
          //   onPress={() => navigate(item._id)}
          // >
          // </TouchableOpacity>;
        }}
        ListEmptyComponent={
          <AppText variant="body1Dark" style={{ textAlign: "center", marginTop: 20 }}>
            No posts available.
          </AppText>
        }
      />
    </AppScreen>
  );
}

