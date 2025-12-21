/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { ArrowSquareLeft, Search } from "iconsax-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Form, { FormInput } from "./AppForm";
import AppScreen from "./AppScreen";
import AvatarImage from "./AvatarImage";
import DecoratedTextField from "./DecoratedTextField";
import { FollowItem } from "./FollowItem";
import IconButton2 from "./IconButton2";
import { ModalArgs } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

const FollowersModal: React.FC<ModalArgs> = ({ id, dismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [activeTab, setActiveTab] = useState("followers");
  const { users } = useAuthStore();
  const { getUserById } = useUserStore();
  const [followingData, setFollowingData] = useState<any[]>([]);
  const [followersData, setFollowersData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // const userData = users?.data?.user
  console.log("user: ", userData)

  useEffect(() => {
    // Fetch the main user data when the id changes
    const fetchUser = async () => {
      if (id) {
        const data = await getUserById(id as string);
        console.log("Fetched user data:", data);
        setUserData(data);
      }
    };
    fetchUser();
  }, [id]); // ✅ Only re-run when id changes

  // 🔹 Fetch full user data for both followers and following
  useEffect(() => {
    const fetchUsers = async (ids: string[], type: "followers" | "following") => {
      if (!ids?.length) {
        if (type === "followers") {
          setFollowersData([]);
        } else {
          setFollowingData([]);
        }
        return;
      }

      setLoading(true);
      try {
        const promises = ids.map(id => getUserById(id));
        const results = await Promise.all(promises);
        console.log("ids: ", ids, "promise: ", promises, "results: ", results)
        const validUsers = results.filter(Boolean);

        if (type === "followers") setFollowersData(validUsers);
        else setFollowingData(validUsers);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "followers") fetchUsers(userData?.followers || [], "followers");
    if (activeTab === "following") fetchUsers(userData?.following || [], "following");
  }, [activeTab, userData?.followers, userData?.following]);


  const tabs = [
    { label: "followers", name: `Followers (${userData?.followers?.length || 0})` },
    { label: "following", name: `Following (${userData?.following?.length || 0})` },
    { label: "suggested", name: `Suggested` },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const renderUsers = (users: any[] = [], type: string) => {
    if (!users.length) {
      return (
        <Text style={styles.emptyText}>
          No {type} yet.
        </Text>
      );
    }

    return users.map((u, index) => (
      <FollowItem
        key={u._id || index}
        userId={u._id}
        userAvatar={<AvatarImage image={{ uri: u.profilePicture }} size={48} />}
        userName={u.username || u.fullName || "Unknown User"}
        followers={u.followers || []}
        dismiss={dismiss}
        {...(type === "followers"
          ? { remove: true }
          : type === "following"
          ? { isFollowing: true }
          : { notFollowing: true })}
      />
    ));
  };

  return (
    <Animated.View
      style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
    >
      <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
        <Section
          as={SafeAreaView}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            paddingBottom: 16,
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={dismiss}>
              <ArrowSquareLeft size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Followers</Text>
            <View style={{ width: 40 }} />
          </View>
        </Section>

        {/* Search Bar */}
        <Form>
          <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
            <FormInput
              as={DecoratedTextField}
              name="search"
              prefix={<IconButton2 icon={Search} size={15} />}
              containerStyle={{ flex: 1 }}
              outlined
              noMargin
              placeholder="Search"
            />
          </View>
        </Form>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setActiveTab(tab.label)}
              style={[
                styles.tab,
                activeTab === tab.label && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.label && styles.activeText,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User List */}
        <ScrollView>
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            {loading ? (
              <ActivityIndicator size="small" color="#888" />
            ) : (
              <>
                {activeTab === "followers" &&
                  renderUsers(followersData, "followers")}

                {activeTab === "following" &&
                  renderUsers(followingData, "following")}

                {activeTab === "suggested" &&
                  renderUsers(userData?.suggestedUsers || [], "suggested")}
              </>
            )}
          </View>
        </ScrollView>
      </AppScreen>
    </Animated.View>
  );
};

export default FollowersModal;

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#474A55",
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  tab: {
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#384CFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#a6a6a7ff",
  },
  activeText: {
    color: "#1d1d1fff",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 15,
    fontFamily: "Mulish",
  },
});
