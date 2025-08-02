import AppHeader from "@/app/components/AppHeader";
import AppIcon from "@/app/components/AppIcon";
import AppScreen from "@/app/components/AppScreen";
import AppText from "@/app/components/AppText";
import { useOpenModal } from "@/app/components/ModalContext";
import PostView from "@/app/components/PostView";
import Section from "@/app/components/Section";
import useFlatListAPI from "@/common/utils/use_flatlist_api";
import {
  fetchPosts,
  fetchStatus,
  usePosts,
  useStatus,
} from "@/redux/posts/postsActions";
// import { useAppPadding } from "@/data/features/ui/uiActions";
// import { StackNavigationProp } from "@react-navigation/stack";
import {
  LIGHT_GREY,
  PRIMARY,
  WHITE
} from "@/common/theming/colors";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import type { RootParamList } from "../../../navigation/RootRouter";

export default function HomeScreen() {
  
  const status = useFlatListAPI(fetchStatus, useStatus);
  const posts = useFlatListAPI(fetchPosts, usePosts);
  const padding = 16;
  const openModal = useOpenModal();
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
        <AppHeader
          disableBack
          actions={["search", "messages", "notifications"]}
        >
          <AppIcon size={45} />
          <View style={{ marginRight: 8 }} />
          <AppText variant="header2XlBlack">Uniqnk</AppText>
          <View style={{ flex: 1 }} />
        </AppHeader>
        <FlatList
          horizontal
          {...status.flatListProps}
          data={status.results}
          ListEmptyComponent={<ActivityIndicator />}
          contentContainerStyle={{
            gap: 16,
          }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  padding: 3,
                  borderColor: PRIMARY,
                  borderWidth: 1,
                  borderStyle: "dashed",
                }}
              >
                <Image
                  source={{ uri: item.author.photo_url }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              </View>
            );
          }}
        />
      </Section>
      <FlatList
        {...posts.flatListProps}
        data={posts.results}
        style={{
          paddingTop: 16,
          width: "100%",
          flex: 1,
          backgroundColor: WHITE,
          paddingHorizontal: padding,
          marginTop: 5
        }}
        contentContainerStyle={{
          gap: 8,
          width: "100%",
        }}
        renderItem={({ item }) => {
          return <PostView post={item} />;
        }}
      />
    </AppScreen>
  );
}
