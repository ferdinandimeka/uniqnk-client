import { RED } from "@/common/theming/colors";
import formatNumber from "@/common/utils/format_number";
import { usePosts } from "@/redux/posts/postsActions";
import { Bookmark, Heart, Message, More, Send } from "iconsax-react-native";
// import share from "@/assets/icons/Share-box.png"
import { Image, View } from "react-native";
import AppText from "./AppText";
import AvatarImage from "./AvatarImage";
import CommentsModal from "./CommentsModal";
import IconButton2 from "./IconButton2";
import { useOpenModal } from "./ModalContext";
import Spacer from "./Spacer";

export default function PostView({
  post,
}: {
  post: ReturnType<typeof usePosts>[0];
}) {
  const openModal = useOpenModal();
  return (
    <View style={{ marginTop: 24, gap: 4, flexDirection: "column" }}>
      <View style={{ flexDirection: "row", gap: 8, marginRight: -8 }}>
        <AvatarImage bordered image={post.author.photo_url} />
        <AppText variant="headerSm" style={{ marginTop: 4 }}>
          {post.author.name}
        </AppText>
        <Spacer />
        <IconButton2 icon={More} />
      </View>
      {post.image ? (
        <Image
          source={{ uri: post.image }}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: 1.2,
            borderRadius: 16,
            marginVertical: 8,
          }}
        />
      ) : null}
      <AppText variant="body1Darker">{post.post}</AppText>
      <View
        style={{
          flexDirection: "row",
          marginLeft: -8,
          gap: 4,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <IconButton2 icon={Heart} active={post.is_liked} activeColor={RED}>
          <AppText variant="body2Dark">{formatNumber(post.num_likes)}</AppText>
        </IconButton2>
        <IconButton2
          icon={Message}
          onPress={() => {
            openModal(CommentsModal, {
              post_id: post.id,
            });
          }}
        >
          <AppText variant="body2Dark">
            {formatNumber(post.num_comments)}
          </AppText>
        </IconButton2>
        <IconButton2 icon={Bookmark} active={post.is_saved}>
          <AppText variant="body2Dark">{formatNumber(post.num_saved)}</AppText>
        </IconButton2>
        {/* <Spacer /> */}
        <IconButton2 icon={Send} />
      </View>
    </View>
  );
}
