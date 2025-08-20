import AppScreen from "@/app/components/AppScreen";
import { FlatList } from "react-native-gesture-handler";

import AppButton from "@/app/components/AppButton";
import AppHeader from "@/app/components/AppHeader";
import AvatarImage from "@/app/components/AvatarImage";
import {
  BG,
  LIGHT_GREY,
  TEXT_DARKER
} from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import useFlatListAPI from "@/common/utils/use_flatlist_api";
import { useUserProfile } from "@/redux/auth/authActions";
import { AuthState } from "@/redux/auth/authSlice";
import {
  fetchExploreArticles,
  useExploreArticles,
} from "@/redux/posts/postsActions";
// import { TabsParamList } from "@/navigation/TabsRouter";
import AppText from "@/app/components/AppText";
import React from "react";
import { Dimensions, Image, View } from "react-native";
// import { AppScreenProps } from "../../../navigation/RootRouter";
import Section from "@/app/components/Section";
import { useAppPadding } from "@/redux/ui/uiActions";

const ProfileScreenHeader = React.forwardRef<View, { user: AuthState["user"] }>(
  function ProfileScreenHeader({ user }, ref) {
    user = useUserProfile();
    return (
      <View
        ref={ref}
        style={{
          alignItems: "center",
          width: "100%",
          backgroundColor: BG,
          paddingTop: 16,
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: LIGHT_GREY,
          paddingBottom: 24,
        }}
      >
        <AvatarImage />
        <AppText variant="body1Black">{user?.name}</AppText>
        <View style={[AppStyles.row, { gap: 32 }]}>
          <View style={{ alignItems: "center" }}>
            <AppText variant="headerXlBlack">{36}</AppText>
            <AppText variant="body1">posts</AppText>
          </View>
          <View style={{ alignItems: "center" }}>
            <AppText variant="headerXlBlack">{43}</AppText>
            <AppText variant="body1">followers</AppText>
          </View>
          <View style={{ alignItems: "center" }}>
            <AppText variant="headerXlBlack">{72}</AppText>
            <AppText variant="body1">following</AppText>
          </View>
        </View>
        <View style={[AppStyles.row, { gap: 8, marginTop: 16 }]}>
          <AppButton
            color={LIGHT_GREY}
            textColor={TEXT_DARKER}
            style={{
              width: "auto",
              minWidth: 120,

              padding: 12,
              borderRadius: 16,
            }}
          >
            Edit Profile
          </AppButton>
          <AppButton
            color={LIGHT_GREY}
            textColor={TEXT_DARKER}
            style={{
              width: "auto",
              minWidth: 120,

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
  const user = useUserProfile();
  const articles = useFlatListAPI(fetchExploreArticles, useExploreArticles);
  const padding = useAppPadding();
  return (
    <AppScreen noPadding>
      <Section style={{ width: "100%" }}>
        <AppHeader disableBack title={user?.name} actions={["notifications"]} />
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
          paddingHorizontal: padding,
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
