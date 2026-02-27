import { useOpenModal } from "@/app/components/ModalContext";
import { ON_BG } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Notification,
  SearchNormal,
  Setting5,
  Sms
} from "iconsax-react-native";
import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
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

  const theme = useTheme();
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
          <Sms size={20} color={theme.colors.text} />
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
          <Notification size={20} color={theme.colors.text} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
