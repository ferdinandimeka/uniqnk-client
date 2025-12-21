import Form, { FormInput, FormSubmit } from "@/app/components/AppForm";
import CommentsView from "@/app/components/CommentsView";
import DecoratedTextField from "@/app/components/DecoratedTextField";
import IconButton2 from "@/app/components/IconButton2";
import Loader from "@/app/components/Loader";
import { ModalArgs } from "@/app/components/ModalContext";
import { LIGHT_GREY } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { usePostStore } from "@/store/usePostStore";
import { CloseCircle, Smileys } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    View
} from "react-native";

function useTreeList<T extends { id: string | number; replies?: T[] }>(
  items: T[] | null,
  getChildren: (item: T) => T[] | undefined
) {
  const [expanded, setExpandedState] = useState<Record<string | number, boolean>>({});

  const flatten = (items: T[], depth = 0): { element: T; depth: number; expanded: boolean }[] => {
    return items?.flatMap((e) => {
      const isExpanded = !!expanded[e.id];
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
      [item.id]: open ?? !prev[item.id],
    }));
  };

  return [flatten(items ?? []), toggleExpanded] as const;
}

export default function CommentsModal({
  id,
  visible,
  dismiss,
}: { id: string } & ModalArgs) {
  const { getPostById, commentToPost } = usePostStore();
  const [postComments, setPostComments] = useState<any[]>([]);
  const [UserId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedComments, setExpanded] = useTreeList(postComments, (e) => e.replies || []);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      setIsLoading(true);
      try {
        const post = await getPostById(id);
        if (post && Array.isArray(post.comments)) {
          setPostComments(post.comments);
          setUserId(post.user);
        } else setPostComments([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, visible]);

  const hasNoComments = !postComments || postComments.length === 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={dismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[AppStyles.row, styles.section]}>
            <Text style={styles.comment}>Comments</Text>
            <IconButton2 icon={CloseCircle} onPress={dismiss} />
          </View>

          {/* Body */}
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
              keyExtractor={(_, i) => i.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10, gap: 8 }}
              renderItem={({ item: { element, depth, expanded } }) => (
                <View style={{ paddingLeft: depth * 16 }}>
                  {element.loading ? (
                    <Loader />
                  ) : (
                    <CommentsView
                      commentId={element._id}
                      expanded={expanded}
                      setExpanded={(open) => setExpanded(element, open)}
                    />
                  )}
                </View>
              )}
            />
          )}

          {/* Comment Input */}
          <Form
            onSubmit={async (values) => {
              const text = values.comment?.trim();
              if (!text) return;
              await commentToPost(id, UserId ?? "", text);
              const updated = await getPostById(id);
              setPostComments(updated?.comments ?? []);
            }}
          >
            <View style={[AppStyles.row, styles.inputRow]}>
              <FormInput
                as={DecoratedTextField}
                name="comment"
                prefix={<IconButton2 icon={Smileys} size={24} />}
                containerStyle={{ flex: 1 }}
                outlined
                noMargin
                placeholder="Write a comment..."
              />
              <FormSubmit style={styles.sendButton}>➤</FormSubmit>
            </View>
          </Form>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    maxHeight: "85%",
  },
  section: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY,
  },
  comment: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2C33",
    fontFamily: "Mulish",
  },
  noCommentsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#777",
    fontFamily: "Mulish",
  },
  inputRow: {
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    padding: 8,
    fontSize: 20,
  },
});
