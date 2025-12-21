import { LIGHT_GREY, PRIMARY } from "@/common/theming/colors";
// import { useUserProfile } from "@/redux/auth/authActions";
// import { useUserStore } from "@/store/useUserStore";
import { Image } from "react-native";

interface AvatarImageProps {
  image?: { uri: string } | null | undefined;
  size?: number;
  bordered?: boolean;
}

export default function AvatarImage({
  size = 48,
  image = null,
  bordered = false,
}: AvatarImageProps) {
  // const {user} = useUserStore();

  return (
    <Image
      source={{ uri: (image && typeof image === 'object' ? image.uri : image) ?? "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
      style={{
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: LIGHT_GREY,
        borderColor: bordered ? PRIMARY : undefined,
        borderWidth: 1,
      }}
    />
  );
}
