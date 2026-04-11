// import { LIGHT_GREY } from "@/common/theming/colors";
// import AppStyles from "@/common/theming/styles";
// import { usePostStore } from "@/store/usePostStore";
// import { CloseCircle, Smileys } from "iconsax-react-native";
// import { useEffect, useMemo, useState } from "react";
// import { Animated, FlatList, StyleSheet, Text, View, useAnimatedValue } from "react-native";
// import Form, { FormInput, FormSubmit } from "./AppForm";
// import { BottomSheetDialog } from "./BottomSheetDialog";
// import CommentsView from "./CommentsView";
// import DecoratedTextField from "./DecoratedTextField";
// import IconButton2 from "./IconButton2";
// import Loader from "./Loader";
// import { ModalArgs } from "./ModalContext";

// function useTreeList<T extends { id: string | number }>(
//   items: T[] | null,
//   getChildren: (item: T) => Promise<T[]> | T[]
// ) {
//   const [expanded, setExpanded] = useState({} as Record<string | number, T[]>);
//   return useMemo(() => {
//     function flatten(items: T[], getChildren: (e: T) => T[] | undefined, depth = 0) {
//       return items?.flatMap<{ element: T; depth: number; expanded: boolean }>((e) => {
//         const x = getChildren(e);
//         return [
//           { depth, element: e, expanded: !!x },
//           ...flatten(x ?? [], getChildren, depth + 1),
//         ];
//       });
//     }

//     return [
//       flatten(items ?? [], (item) => expanded[item.id]) as {
//         element: T & { loading?: boolean };
//         expanded: boolean;
//         depth: number;
//       }[],
//       async (item: T, open: boolean) => {
//         if (open) {
//           setExpanded((prev) => ({
//             ...prev,
//             [item.id]: [{ id: `loading-${item.id}`, loading: true } as any],
//           }));
//           const res = await getChildren(item);
//           setExpanded((prev) => ({ ...prev, [item.id]: res }));
//         } else {
//           setExpanded((prev) => ({ ...prev, [item.id]: [] }));
//         }
//       },
//     ] as const;
//   }, [items, expanded, getChildren]);
// }

// export default function CommentsModal({
//   id,
//   ...props
// }: {
//   id: string;
// } & ModalArgs) {
//   const bounce = useAnimatedValue(0);
//   const { getPostById, commentToPost, isLoading } = usePostStore();
//   // const { users } = useAuthStore();
//   // const UserId = users?._id || "";
  

//   const [postComments, setPostComments] = useState<any[]>([]);
//   const [UserId, setUserId] = useState<string | null>(null);
//   const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);

//   useEffect(() => {
//     bounce.setValue(0);
//     Animated.spring(bounce, {
//       toValue: 100,
//       bounciness: 25,
//       useNativeDriver: true,
//     }).start();
//   }, [bounce, props.visible]);

//   // 🔹 Fetch post comments
//   useEffect(() => {
//     (async () => {
//       const post = await getPostById(id);
//       console.log("Fetched post for comments:", post);
//       if (post && Array.isArray(post.comments)) {
//         setPostComments(post.comments);
//         setUserId(post.user);
//         // console.log("user: ", UserId);
//       } else {
//         setPostComments([]);
//       }
//     })();
//   }, [id, getPostById]);

//   const [expandedComments, setExpanded] = useTreeList(postComments, (e) => e.replies || []);
//   const hasNoComments = !postComments || postComments.length === 0;

//   return (
//     <BottomSheetDialog {...props} dragToClose scrollable={false}>
//       <View
//         style={[
//           AppStyles.row,
//           styles.section,
//           { borderBottomWidth: 1, borderBottomColor: LIGHT_GREY },
//         ]}
//       >
//         <Text style={styles.comment}>Comments</Text>
//         <IconButton2 icon={CloseCircle} onPress={props.dismiss} />
//       </View>

//       {/* 🟢 No comments display */}
//       {isLoading ? (
//         <View style={styles.noCommentsContainer}>
//           <Loader />
//         </View>
//       ) : hasNoComments ? (
//         <View style={styles.noCommentsContainer}>
//           <Text style={styles.noCommentsText}>No comments yet</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={expandedComments}
//           style={{ paddingTop: 8, width: "100%", flex: 1 }}
//           contentContainerStyle={{ gap: 8, width: "100%" }}
//           renderItem={({ item: { element, depth, expanded } }) => (
//             <View style={{ width: "100%", paddingLeft: depth * 16 }}>
//               {element.loading ? (
//                 <Loader />
//               ) : (
//                 <CommentsView
//                   key={element._id}
//                   commentId={element._id}
//                   expanded={expanded}
//                   setExpanded={(open) => setExpanded(element, open)}
//                 />
//               )}
//             </View>
//           )}
//           keyExtractor={(_, i) => i.toString()}
//         />
//       )}

//       {/* 🟣 Comment input form */}
//       <Form
//         onSubmit={async (values) => {
//           const text = values.comment?.trim();
//           // console.log("Submitting comment: ", text);
//           if (!text) return;
//           const res = await commentToPost(id, UserId ?? "", text);
//           // console.log("Commented to post response: ", res)
//           const updated = await getPostById(id);
//           // console.log("Updated post: ", updated);
//           setPostComments(updated?.comments ?? []);
//         }}
//       >
//         <View style={[AppStyles.row, { paddingTop: 8, alignItems: "center", gap: 8 }]}>
//           <FormInput
//             as={DecoratedTextField}
//             name="comment"
//             prefix={<IconButton2 icon={Smileys} size={24} />}
//             containerStyle={{ flex: 1 }}
//             outlined
//             noMargin
//             placeholder="Write a comment"
//           />
//           <FormSubmit
//             // prefixIcon={Send}
//             variant="full"
//             style={{ width: 48, height: 48, padding: 8 }}
//             fontSize={20}
//             loading={isLoading}
//           >
//             ➤
//           </FormSubmit>
//         </View>
//       </Form>
//     </BottomSheetDialog>
//   );
// }

// const styles = StyleSheet.create({
//   comment: {
//     fontSize: 18,
//     fontWeight: "700",
//     lineHeight: 18,
//     letterSpacing: 0,
//     color: "#2B2C33",
//     fontFamily: "Mulish",
//   },
//   section: {
//     paddingBottom: 10,
//   },
//   noCommentsContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 50,
//   },
//   noCommentsText: {
//     fontSize: 16,
//     color: "#777",
//     fontFamily: "Mulish",
//   },
// });

import { LIGHT_GREY } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { useAuthStore } from "@/store/useAuthStore";
import useCommentStore from "@/store/useCommentStore";
import { usePostStore } from "@/store/usePostStore";
import { CloseCircle, Smileys } from "iconsax-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  useAnimatedValue,
} from "react-native";
import Form, { FormInput, FormSubmit } from "./AppForm";
import { BottomSheetDialog } from "./BottomSheetDialog";
import CommentsView from "./CommentsView";
import DecoratedTextField from "./DecoratedTextField";
import IconButton2 from "./IconButton2";
import Loader from "./Loader";
import { ModalArgs } from "./ModalContext";

function useTreeList<T extends { _id: string | number; replies?: T[] }>(
  items: T[] | null,
  getChildren: (item: T) => T[] | undefined
) {
  const [expanded, setExpandedState] = useState<Record<string | number, boolean>>({});

  const flatten = (items: T[], depth = 0): { element: T; depth: number; expanded: boolean }[] => {
    return items?.flatMap((e) => {
      const isExpanded = !!expanded[e._id];
      const children = isExpanded ? getChildren(e) ?? [] : [];
      return [
        { depth, element: e, expanded: isExpanded },
        ...flatten(children, depth + 1),
      ];
    });
  };

  const toggleExpanded = (item: T, open?: boolean) => {
    setExpandedState((prev) => ({
      ...prev,
      [item._id]: open ?? !prev[item._id],
    }));
  };

  return [flatten(items ?? []), toggleExpanded] as const;
}


export default function CommentsModal({
  id,
  ...props
}: {
  id: string;
} & ModalArgs) {
  const bounce = useAnimatedValue(0);
  const { getPostById, commentToPost } = usePostStore();
  const { replyToComment } = useCommentStore();
  const { users } = useAuthStore();
  const userId = users?.data?.user._id || "";
  const formRef = useRef<any>(null);

  const [postComments, setPostComments] = useState<any[]>([]);
  // const [UserId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    bounce.setValue(0);
    Animated.spring(bounce, {
      toValue: 100,
      bounciness: 25,
      useNativeDriver: true,
    }).start();
  }, [bounce, props.visible]);

  // Fetch post + comments
  useEffect(() => {
    (async () => {
      setIsLoading(true); // Start loading
      try{
        const post = await getPostById(id);
        
        if (post && Array.isArray(post.comments)) {
          setPostComments(post.comments);
          // setUserId(post.user);
        } else {
          setPostComments([]);
        }
      } catch (error) {
        setPostComments([]);
      } finally {
        setIsLoading(false); // End loading
      }
    })();
  }, [id]);

  const [expandedComments, setExpanded] = useTreeList(
    postComments,
    (e) => e.replies || []
  );

  const hasNoComments = !postComments || postComments.length === 0;

  return (
    <BottomSheetDialog id={undefined} {...props} dragToClose scrollable={false}>
      <View
        style={[
          AppStyles.row,
          styles.section,
          { borderBottomWidth: 1, borderBottomColor: LIGHT_GREY },
        ]}
      >
        <Text style={styles.comment}>Comments</Text>
        <IconButton2 icon={CloseCircle} onPress={props.dismiss} />
      </View>

      {isLoading ? (
        <View style={styles.noCommentsContainer}>
          <Loader />
        </View>
      ) : hasNoComments ? (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>No comments yet</Text>
        </View>
      ) : (
        <FlatList
          data={expandedComments}
          style={{ paddingTop: 8, width: "100%", flex: 1 }}
          contentContainerStyle={{ gap: 8, width: "100%" }}
          renderItem={({ item: { element, depth, expanded } }) => (
            <View
              style={{
                width: "100%",
                paddingLeft: depth * 16,
              }}
            >
              {element.loading ? (
                <Loader />
              ) : (
                <CommentsView
                  key={element._id}
                  commentId={element._id}
                  // comment={element}
                  expanded={expanded}
                  setExpanded={(open) => setExpanded(element, open)}
                  onReply={setReplyTo}
                />
              )}
            </View>
          )}
          keyExtractor={(_, i) => i.toString()}
        />
      )}

      {replyTo && (
        <View style={styles.replyBanner}>
          <Text style={styles.replyText}>
            Replying to @{replyTo.username}
          </Text>
          <Text
            style={styles.cancelReply}
            onPress={() => setReplyTo(null)}
          >
            Cancel
          </Text>
        </View>
      )}

      {/* Add a comment */}
      <Form
        formRef={formRef}
        onSubmit={async (values) => {
          const text = values.comment?.trim();
          if (!text) return;

          if (replyTo) {
            // console.log("Replying to commentId:", replyTo.commentId, "with text:", text);
            await replyToComment(userId, id, replyTo.commentId, text);
          } else {
            await commentToPost(id, userId ?? "", text);
          }

          const updated = await getPostById(id);
          setPostComments(updated?.comments ?? []);

          if (replyTo) {
            setExpanded({ _id: replyTo.commentId } as any, true);
          }

          setReplyTo(null);
          // clear input
          formRef.current?.reset({ comment: "" })
        }}
      >
        <View
          style={[AppStyles.row, { paddingTop: 8, alignItems: "center", gap: 8 }]}
        >
          <FormInput
            as={DecoratedTextField}
            name="comment"
            prefix={<IconButton2 icon={Smileys} size={24} />}
            containerStyle={{ flex: 1 }}
            outlined
            noMargin
            placeholder={
              replyTo
                ? `Reply to @${replyTo.username}`
                : "Write a comment"
            }
          />
          <FormSubmit
            variant="full"
            style={{ width: 48, height: 48, padding: 8 }}
            fontSize={20}
            loading={isLoading}
          >
            ➤
          </FormSubmit>
        </View>
      </Form>
    </BottomSheetDialog>
  );
}

const styles = StyleSheet.create({
  comment: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#2B2C33",
    fontFamily: "Mulish",
  },
  section: {
    paddingBottom: 10,
  },
  noCommentsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#777",
    fontFamily: "Mulish",
  },
  replyBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  replyText: {
    fontSize: 12,
    color: "#6B6F80",
    fontWeight: "600",
  },
  cancelReply: {
    fontSize: 12,
    color: "#384CFF",
    fontWeight: "700",
  },
});

