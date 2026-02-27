// import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRouter } from "expo-router";
import { ArrowRight2, ArrowSquareLeft } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  // Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppScreen from "../../components/AppScreen";
import { useOpenModal } from "../../components/ModalContext";
import NotificationEmailModal, { EmailNotificationSettings } from "../../components/NotificationEmailModal";
import Section from "../../components/Section";

const { width } = Dimensions.get("window");

const AccountSetting = () => {
  const openModal = useOpenModal();
  const router = useRouter();
  const { settings, updateNotifications, fetchSettings } = useSettingsStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user?._id

  const [hydrated, setHydrated] = useState(false);
  // const [markAll, setMarkAll] = useState(false);
  // const [likes, setLikes] = useState(settings?.notifications?.likes ?? true);
  // const [newFollowers, setNewFollowers] = useState(settings?.notifications?.followers ?? true);
  // const [comments, setComments] = useState(settings?.notifications?.comments ?? true);
  // const [liveAndReels, setLiveAndReels] = useState(settings?.notifications?.liveReels ?? true);
  // const [profileViews, setProfileViews] = useState(settings?.notifications?.profileViews ?? true);
  // const [mentions, setMentions] = useState(settings?.notifications?.mentions ?? true);
  // const [reposts, setReposts] = useState(settings?.notifications?.reposts ?? true);
  // const [postsYouInteractedWith, setPostsYouInteractedWith] = useState(settings?.notifications?.interactedPosts ?? true);
  const [emailSettings, setEmailSettings] = useState<EmailNotificationSettings>({
    feedbackEmails: settings?.notifications?.email?.feedbackEmails,
    reminderEmails: settings?.notifications?.email?.reminderEmails,
    promotionalEmails: settings?.notifications?.email?.promotionalEmails,
    productEmails: settings?.notifications?.email?.productEmails,
    supportEmails: settings?.notifications?.email?.supportEmails,
  });

  type NotificationSettings = {
  likes: boolean;
  comments: boolean;
  followers: boolean;
  liveReels: boolean;
  profileViews: boolean;
  mentions: boolean;
  reposts: boolean;
  interactedPosts: boolean;
};

const [notificationSettings, setNotificationSettings] =
  useState<NotificationSettings>({
    likes: false,
    comments: false,
    followers: false,
    liveReels: false,
    profileViews: false,
    mentions: false,
    reposts: false,
    interactedPosts: false,
  });


  console.log("feedback emails:", settings?.notifications?.email?.feedbackEmails);

  useEffect(() => {
    if (!settings?.notifications?.email || hydrated) return;

    setEmailSettings({
      feedbackEmails: settings.notifications.email.feedbackEmails,
      reminderEmails: settings.notifications.email.reminderEmails,
      promotionalEmails: settings.notifications.email.promotionalEmails,
      productEmails: settings.notifications.email.productEmails,
      supportEmails: settings.notifications.email.supportEmails,
    });
    setHydrated(true);
  }, [settings?.notifications?.email, hydrated]);

  useEffect(() => {
    if (!settings?.notifications) return;

    setNotificationSettings({
      likes: settings.notifications.likes,
      comments: settings.notifications.comments,
      followers: settings.notifications.followers,
      liveReels: settings.notifications.liveReels,
      profileViews: settings.notifications.profileViews,
      mentions: settings.notifications.mentions,
      reposts: settings.notifications.reposts,
      interactedPosts: settings.notifications.interactedPosts,
    });
  }, [settings?.notifications]);

  const onNotificationChange = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    // 1️⃣ Update UI instantly
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value,
    }));

    console.log("🔔 Notification changed:", key, value);

    // 2️⃣ Update backend (flattened)
    await updateNotifications(userId, {
      [key]: value,
    });
  };

  const goBack = () => {
    router.back();
  };

  /**
   * 🔥 Email toggle handler
   * - Updates UI immediately
   * - Updates backend/store immediately
   */
  const onEmailChange = async (
    key: keyof EmailNotificationSettings,
    value: boolean
  ) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    console.log("Updated Email Settings:")
    await updateNotifications(userId, {
      email: {
        ...emailSettings,
        [key]: value,
      }
    });
  };

  const NOTIFICATION_KEYS: (keyof NotificationSettings)[] = [
    "likes",
    "comments",
    "followers",
    "liveReels",
    "profileViews",
    "mentions",
    "reposts",
    "interactedPosts",
  ];

  const markAll = NOTIFICATION_KEYS.every(
    key => notificationSettings[key]
  );

  const onMarkAllChange = async (value: boolean) => {
  // 1️⃣ Update UI instantly
    const updated = NOTIFICATION_KEYS.reduce(
      (acc, key) => {
        acc[key] = value;
        return acc;
      },
      {} as NotificationSettings
    );

    setNotificationSettings(updated);

    console.log("🔕 Mark all changed:", value);

    // 2️⃣ Send ONE API call
    await updateNotifications(userId, updated);
  };

  useEffect(() => {
    if (userId) {
      fetchSettings(userId);
    }
  }, [userId]);
  console.log("Settings Notification:", settings);

  return (
    <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust depending on header height
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <Section
                as={SafeAreaView}
                style={{
                width: "100%",
                backgroundColor: "#fff",
                paddingBottom: 16,
                }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBack}>
                        <ArrowSquareLeft size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 40 }} />
                </View>
            </Section>

            <View style={styles.settingsContent}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, width: "40%", color: "gray", lineHeight: 24 }}>Push notification Mute all</Text>
                    <Switch value={markAll} onValueChange={onMarkAllChange} />
                </View>

                <View style={styles.border} />

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Likes</Text>
                    <Switch
                      value={notificationSettings.likes}
                      onValueChange={(v) => onNotificationChange("likes", v)}
                    />

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Comments</Text>
                    <Switch
                      value={notificationSettings.comments}
                      onValueChange={(v) => onNotificationChange("comments", v)}
                    />

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Live and reels</Text>
                    <Switch
                      value={notificationSettings.liveReels}
                      onValueChange={(v) => onNotificationChange("liveReels", v)}
                    />

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>New Followers</Text>
                    <Switch
                      value={notificationSettings.followers}
                      onValueChange={(v) => onNotificationChange("followers", v)}
                    />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Mention and Tags</Text>
                    <Switch
                      value={notificationSettings.mentions}
                      onValueChange={(v) => onNotificationChange("mentions", v)}
                    />

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Profile views</Text>
                    <Switch value={notificationSettings.profileViews} onValueChange={(v) => onNotificationChange("profileViews", v)} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Reposts</Text>
                    <Switch
                      value={notificationSettings.reposts}
                      onValueChange={(v) => onNotificationChange("reposts", v)}
                    />

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray", lineHeight: 24 }}>Posts you interacted with</Text>
                    <Switch
                      value={notificationSettings.interactedPosts}
                      onValueChange={(v) => onNotificationChange("interactedPosts", v)}
                    />

                </View>

                <Text style={{ width: "85%", color: "gray", fontWeight: "semibold", marginBottom: 10 }}>
                    Get notifications when others comment on a post you liked or commented on
                </Text>

                <View style={styles.border} />

                <TouchableOpacity style={styles.contents} onPress={() => 
                  openModal(({ dismiss, visible }) => (
                    <NotificationEmailModal
                      dismiss={dismiss}
                      visible={visible}
                      id={undefined}
                      emailSettings={emailSettings}
                      onChange={onEmailChange}
                    />
                  ), {})
                }>
                    <View style={styles.content} >
                        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#555555" }}>Other notifications</Text>
                        <Text style={{ color: "gray" }}>Email Notifications</Text>
                    </View>

                    <ArrowRight2
                        size="16"
                        color="#555555"
                        variant="Linear"
                    />
                </TouchableOpacity>
            </View>

            

        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Mulish",
    fontWeight: "bold",
    textAlign: "center",
    color: "#474A55",
    flex: 1,
  },
  form: {
    flexDirection: "column",
    gap: 5,
    paddingVertical: 0,
  },
  settingsContent: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
  },
  contents: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 6
  },
  content: {
    flexDirection: "column",
    gap: 6,
  },
  border: {
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 2,
  }
});

export default AccountSetting;
