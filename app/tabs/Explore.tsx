import AppScreen from "@/app/components/AppScreen";
// import { TabsParamList } from "@/navigation/TabsRouter";
// import { AppScreenProps } from "../../../navigation/RootRouter";
import Form, { FormInput } from "@/app/components/AppForm";
import Loader from "@/app/components/Loader";
import SearchInput from "@/app/components/SearchInput";
import {
  PRIMARY,
  TEXT_DARKER,
  TEXT_LIGHTER,
  WHITE,
} from "@/common/theming/colors";
import useFlatListAPI from "@/common/utils/use_flatlist_api";
import useArrayState from "@/common/utils/useArrayState";
import {
  fetchExploreArticles,
  useExploreArticles,
  useExploreTags,
} from "@/redux/posts/postsActions";
import { useEffect, useMemo } from "react";
import { Dimensions, FlatList, Image } from "react-native";
import { TabBar, TabBarItem, TabView } from "react-native-tab-view";

export default function ExploreScreen() {
  const tags = useExploreTags();
  const memoTags = useMemo(() => tags?.map((e) => e.id), [tags]);
  const [selectedTag, setSelectedTag] = useArrayState(memoTags ?? []);
  const articles = useFlatListAPI(fetchExploreArticles, useExploreArticles);
  const routes = useMemo(() => {
    return (
      tags?.map((e) => ({
        title: e.name,
        key: e.id.toString(),
      })) ?? []
    );
  }, [tags]);
  const navigationState = useMemo(
    () => ({
      index: memoTags?.indexOf(selectedTag) ?? 0,
      routes,
    }),
    [memoTags, selectedTag, routes]
  );

  console.log("Sample Article:", articles.results?.[0]);

  useEffect(() => {
    if (!selectedTag && memoTags?.length) {
      setSelectedTag(memoTags[0]); // set first tab by default
    }
  }, [memoTags]);


  return (
    <AppScreen>
      <Form>
        <FormInput
          as={SearchInput}
          outlined
          placeholder="search"
          name="search"
        />
      </Form>
      {memoTags ? (
        <TabView
          onIndexChange={(e) => setSelectedTag(memoTags?.[e])}
          navigationState={navigationState}
          style={{ flex: 1 }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              labelStyle={{
                textTransform: "capitalize",
              }}
              renderTabBarItem={(props) => {
                return <TabBarItem {...props} style={{}} />;
              }}
              scrollEnabled
              style={{ height: 40, backgroundColor: "transparent" }}
              activeColor={TEXT_DARKER}
              inactiveColor={TEXT_LIGHTER}
              tabStyle={{
                backgroundColor: "transparent",
                minWidth: 72,
                width: "auto",
              }}
              indicatorStyle={{ backgroundColor: PRIMARY }}
              contentContainerStyle={{ backgroundColor: "transparent" }}
            />
          )}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderScene={({ route }) => {
            const tagId = route.key;

            const tagArticles = (articles.results ?? []).filter(
              (article) => article.tagId?.toString() === tagId
            );

            return (
              <FlatList
                // {...articles.flatListProps}
                keyExtractor={(item) => item.id.toString()}
                data={tagArticles}
                style={{
                  paddingTop: 8,
                  width: "100%",
                  flex: 1,
                  backgroundColor: WHITE,
                }}
                contentContainerStyle={{
                  gap: 8,
                  width: "100%",
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
            );
          }}
        ></TabView>
      ) : (
        <Loader variant="tab_screen" />
      )}
    </AppScreen>
  );
}
