// import {
//   PRIMARY,
//   RED,
//   TEXT_DARKER,
// } from "@/common/theming/colors";
// import formatNumber from "@/common/utils/format_number";
// import { useComments } from "@/redux/posts/postsActions";
// import { ArrowDown2, ArrowUp2, Heart } from "iconsax-react-native";
// import { StyleSheet, Text, View } from "react-native";
// import AppButton from "./AppButton";
// import AppText from "./AppText";
// import AvatarImage from "./AvatarImage";
// import IconButton2 from "./IconButton2";
// // import { useOpenModal } from "./ModalContext";

// import formatDate from "@/common/utils/format_date";
// import plural from "@/common/utils/plural";
// import { BULLET_POINT } from "@/common/utils/unicode";
// // import { useState } from "react";
// import TextStyles from "@/common/theming/text";
// import { IS_UI_DEMO_MODE } from "@/common/utils/ui_demo_mode";

// export default function CommentsView({
//   comment,
//   setExpanded,
//   expanded,
// }: {
//   comment: ReturnType<typeof useComments>[0];
//   setExpanded: (open: boolean) => void;
//   expanded: boolean;
// }) {
//   if (IS_UI_DEMO_MODE) comment.num_comments = comment.replies.length;
//   return (
//     <View style={{}}>
//       <View
//         style={{
//           flexDirection: "row",
//           gap: 8,
//           marginRight: 0,
//           alignItems: "flex-start",
//           marginBottom: 8,
//         }}
//       >
//         <AvatarImage bordered image={comment.author.photo_url} size={36} />
//         <View style={{ flex: 1, gap: 4 }}>
//           <AppText
//             variant="design2"
//             style={[ { flex: 1, color: TEXT_DARKER, fontSize: 18 }, TextStyles.xs]}
//           >
//             {comment.author.name}
//             <AppText variant="body2" style={styles.date}>
//               {" "}
//               {BULLET_POINT} {formatDate(comment.created_at, "round")}{" "}
//             </AppText>
//           </AppText>

//           <AppText variant="body2Dark" style={TextStyles.xs}>{comment.post}</AppText>
//           <Text style={styles.reply}>Reply</Text>
//           {comment.num_comments ? (
//             <AppButton
//               onPress={() => setExpanded(!expanded)}
//               fontSize={10}
//               textColor={expanded ? PRIMARY : TEXT_DARKER}
//               variant="text"
//               style={{ paddingVertical: 4 }}
//               suffixIcon={expanded ? ArrowUp2 : ArrowDown2}
//             >
//               <Text style={styles.replies}>
//                 See {comment.num_comments > 1 ? plural("Reply") : "Reply"} (
//                 {formatNumber(comment.num_comments)})
//               </Text>
//             </AppButton>
//           ) : null}
//         </View>
//         <IconButton2 icon={Heart} active={comment.is_liked} activeColor={RED} size={20}>
//           <Text style={styles.time}>
//             {formatNumber(comment.num_likes)}
//           </Text>
//         </IconButton2>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   date: {
//     fontSize: 10,
//     fontWeight: 400,
//     lineHeight: 10,
//     letterSpacing: 0
//   },
//   reply: {
//     fontSize: 10,
//     fontWeight: 700,
//     lineHeight: 12,
//     letterSpacing: 0,
//     color: "#6B6F80"
//   },
//   replies: {
//     fontSize: 10,
//     fontWeight: 500,
//     lineHeight: 10,
//     letterSpacing: 0,
//     color: "#6B6F80"
//   },
//   time: {
//     fontSize: 12,
//     fontWeight: 700,
//     lineHeight: 12,
//     letterSpacing: 0,
//     color: "#474A55"
//   }
// })
import {
  PRIMARY,
  RED,
  TEXT_DARKER,
} from "@/common/theming/colors";
import formatNumber from "@/common/utils/format_number";
import { ArrowDown2, ArrowUp2, Heart } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AvatarImage from "./AvatarImage";
import IconButton2 from "./IconButton2";

import TextStyles from "@/common/theming/text";
import plural from "@/common/utils/plural";
import { BULLET_POINT } from "@/common/utils/unicode";
import moment from "moment";

// ✅ import your Zustand store instead of redux hook
import { useAuthStore } from "@/store/useAuthStore";
import useCommentStore, { Comment } from "@/store/useCommentStore";



export default function CommentsView({
  commentId,
  setExpanded,
  expanded,
  onReply
}: {
  commentId: string;
  setExpanded: (open: boolean) => void;
  expanded: boolean;
  onReply: (data: { commentId: string; username: string }) => void;
}) {
  const { getCommentById, likeAComment, unlikeAComment } = useCommentStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user._id || "";
  // console.log("user: ", users.data.user._id)
  const [comment, setComment] = useState<Comment | null>(null)

  useEffect(() => {
    let isMounted = true;
    const fetchComment = async () => {
      const fetchedComment = await getCommentById(commentId);
      if (isMounted) setComment(fetchedComment);
    };
    fetchComment();
    return () => {
      isMounted = false;
    };
  }, [commentId]); // ✅ only refetch when commentId changes

  if (!comment || !comment.user) return null

  // if (IS_UI_DEMO_MODE) comment.num_comments = comment.replies?.length || 0;if (!comment || !comment.user) return null;

  const numComments = comment.replies?.length || 0;
  const isLiked = comment.likes.includes(userId);

  const handleLikeToggle = async () => {
    if (!comment) return;

    if (isLiked) {
      await unlikeAComment(comment._id, userId);
      setComment((prev) =>
        prev ? { ...prev, likes: prev.likes.filter((id) => id !== userId) } : prev
      )
    } else {
      await likeAComment(comment._id, userId);
      setComment((prev) =>
        prev ? { ...prev, likes: [...prev.likes, userId] } : prev 
      )
    }
  }

  // console.log("Rendering comment:", comment?._id);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginRight: 0,
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <AvatarImage bordered image={comment.user.profilePicture} size={36} />
        <View style={{ flex: 1, gap: 4 }}>
          <AppText
            variant="design2"
            style={[
              { flex: 1, color: TEXT_DARKER, fontSize: 18 },
              TextStyles.xs,
            ]}
          >
            {comment.user.username}
            <AppText variant="body2" style={styles.date}>
              {" "}
              {BULLET_POINT} {moment(comment.createdAt).fromNow()}{" "}
            </AppText>
          </AppText>

          <AppText variant="body2Dark" style={TextStyles.xs}>
            {comment.content}
          </AppText>
          <Text style={styles.reply} onPress={() => 
            onReply({
              commentId: comment._id,
              username: comment.user.username
            })
          }>Reply</Text>
          {numComments ? (
            <AppButton
              onPress={() => setExpanded(!expanded)}
              fontSize={10}
              textColor={expanded ? PRIMARY : TEXT_DARKER}
              variant="text"
              style={{ paddingVertical: 4 }}
              suffixIcon={expanded ? ArrowUp2 : ArrowDown2}
            >
              <Text style={styles.replies}>
                See{" "}
                {numComments > 1
                  ? plural("Reply")
                  : "Reply"}{" "}
                ({formatNumber(numComments)})
              </Text>
            </AppButton>
          ) : null}
        </View>
        <IconButton2
          icon={Heart}
          active={isLiked}
          activeColor={RED}
          size={20}
          onPress={handleLikeToggle}
        >
          <Text style={styles.time}>
            {formatNumber(comment.likes.length)}
          </Text>
        </IconButton2>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 10,
    letterSpacing: 0,
  },
  reply: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    letterSpacing: 0,
    color: "#6B6F80",
  },
  replies: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 10,
    letterSpacing: 0,
    color: "#6B6F80",
  },
  time: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 12,
    letterSpacing: 0,
    color: "#474A55",
  },
});

