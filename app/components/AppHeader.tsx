import { useOpenModal } from "@/app/components/ModalContext";
import { ON_BG } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Notification,
  SearchNormal,
  Setting5,
  Sms
} from "iconsax-react-native";
import { ReactNode, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import NotificationModal from "./NotificationModal";

type Action = "search" | "settings" | "notifications" | "messages";
export default function AppHeader({
  title = "",
  actions = [],
  children,
  disableBack = false,
  onBackPressed,
}: {
  title?: string;
  actions?: Action[];
  disableBack?: boolean;
  children?: ReactNode;
  onBackPressed?: () => void;
}) {
  const navigation = useNavigation();
  const router = useRouter();
  const openModal = useOpenModal();
  const {users} = useAuthStore();
  const { chats, fetchUserChats, messages, fetchMessages } = useChatStore();

  const theme = useTheme();

  const { getUserNotifications, notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const chatMessages = messages[chats[0]?.id] || []
  const unreadMessageCount = chatMessages.filter((n) => !n.isRead).length
  const jsonChats = JSON.parse(JSON.stringify(chats, null, 2));
  const userId = users?.data?.user?._id;

  useEffect(() => {
      if (!userId) return
      getUserNotifications(userId)
  }, [userId])

  useEffect(() => {
      if (!userId) return; // wait until userId exists
      fetchUserChats(userId);
  }, [userId]);

  return (
    <View
      style={{
        flexDirection: "row",
        minHeight: 32,
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {disableBack ? null : (
        <TouchableOpacity
          onPress={() =>
            onBackPressed ? onBackPressed() : navigation.goBack()
          }
        >
          <ArrowLeft size={20} color={ON_BG} style={{ marginRight: 8 }} />
        </TouchableOpacity>
      )}
      {title ? <AppText variant="headerXlDark">{title}</AppText> : null}
      {children ? (
        children
      ) : actions.length ? (
        <View style={{ flex: 1 }} />
      ) : null}
      {actions.includes("search") ? (
        <TouchableOpacity
          style={[
            AppStyles.iconButton,
            actions[actions.length - 1] === "search"
              ? { marginRight: 0 }
              : null,
          ]}
        >
          <SearchNormal size={20} color={theme.colors.text} />
        </TouchableOpacity>
      ) : null}
      {actions.includes("settings") ? (
        <TouchableOpacity
          style={[
            AppStyles.iconButton,
            actions[actions.length - 1] === "settings"
              ? { marginRight: 0 }
              : null,
          ]}
        >
          <Setting5 size={20} color={theme.colors.text} />
        </TouchableOpacity>
      ) : null}
      {actions.includes("messages") ? (
        <TouchableOpacity
          onPress={() => router.push("/messages")}
          style={[
            AppStyles.iconButton,
            actions[actions.length - 1] === "messages"
              ? { marginRight: 0 }
              : null,
          ]}
        >
          <View style={{ position: "relative", alignItems: "center" }}>
            <Sms size={20} color={theme.colors.text} />

            {unreadMessageCount > 0 && (<View
              style={{ 
                position: "absolute", 
                top: -4, 
                right: -6,  
                minWidth: 18,
                paddingHorizontal: 4,
                borderRadius: 9,
                backgroundColor: "#2F6BFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{
                color: "#fff",
                fontSize: 10,
                fontWeight: "bold",
              }}>{1}</Text>
            </View>)}
          </View>
        </TouchableOpacity>
      ) : null}
      {actions.includes("notifications") ? (
        <TouchableOpacity
          onPress={() => openModal(NotificationModal, {})}
          style={[
            AppStyles.iconButton,
            actions[actions.length - 1] === "notifications"
              ? { marginRight: 0 }
              : null,
          ]}
        >
          <View style={{ position: "relative", alignItems: "center" }}>
            <Notification size={20} color={theme.colors.text} />
            {unreadCount > 0 && (<View
              style={{ 
                position: "absolute", 
                top: -4, 
                right: -6,  
                minWidth: 18,
                paddingHorizontal: 4,
                borderRadius: 9,
                backgroundColor: "#2F6BFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{
                color: "#fff",
                fontSize: 10,
                fontWeight: "bold",
              }}>{unreadCount > 10 ? `9+` : unreadCount}</Text>
            </View>)}
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
