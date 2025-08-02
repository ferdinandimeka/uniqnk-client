import { LIGHT_GREY, PRIMARY } from "@/common/theming/colors";
import { useUserProfile } from "@/redux/auth/authActions";
import { Image } from "react-native";

export default function AvatarImage({
  size = 48,
  image = null,
  bordered = false,
}) {
  const user = useUserProfile();
  return (
    <Image
      source={{ uri: image ?? user?.photo_url }}
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
