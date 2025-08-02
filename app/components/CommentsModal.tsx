import { Animated, FlatList, StyleSheet, Text, View, useAnimatedValue } from "react-native";

import AppButton from "@/app/components/AppButton";
import { LIGHT_GREY } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import useFlatListAPI from "@/common/utils/use_flatlist_api";
import useStable from "@/common/utils/useStable";
import { fetchComments, useComments } from "@/redux/posts/postsActions";
import { CloseCircle, Send, Smileys } from "iconsax-react-native";
import { useEffect, useMemo, useState } from "react";
import Form, { FormInput } from "./AppForm";
import { BottomSheetDialog } from "./BottomSheetDialog";
import CommentsView from "./CommentsView";
import DecoratedTextField from "./DecoratedTextField";
// import IconButton from "./IconButton";
import IconButton2 from "./IconButton2";
import Loader from "./Loader";
import { ModalArgs } from "./ModalContext";

function useTreeList<T extends { id: number }>(
  items: T[] | null,
  getChildren: (item: T) => Promise<T[]> | T[]
) {
  const [expanded, setExpanded] = useState({} as Record<string, T[]>);
  getChildren = useStable(getChildren);
  return useMemo(() => {
    function flatten(
      items: T[],
      getChildren: (e: T) => T[] | undefined,
      depth = 0
    ) {
      return items?.flatMap<{ element: T; depth: number }, T>((e) => {
        const x = getChildren(e);
        return [
          { depth, element: e, expanded: !!x },
          ...flatten(x ?? [], getChildren, depth + 1),
        ];
      });
    }
    return [
      flatten(items, (item) => expanded[item.id]) as {
        element: T & { loading?: boolean };
        expanded: boolean;
        depth: number;
      }[],
      async (item: T, open: boolean) => {
        if (open) {
          setExpanded((expanded) => ({
            ...expanded,
            [item.id]: [{ id: -item.id, loading: true }],
          }));
          const res = await getChildren(item);
          setExpanded((expanded) => ({ ...expanded, [item.id]: res }));
        } else {
          setExpanded((expanded) => ({ ...expanded, [item.id]: null }));
        }
      },
    ] as const;
  }, [items, expanded, getChildren]);
}

export default function CommentsModal({
  id,
  ...props
}: {
  id: number;
} & ModalArgs) {
  const bounce = useAnimatedValue(0);
  useEffect(() => {
    bounce.setValue(0);
    Animated.spring(bounce, {
      toValue: 100,
      bounciness: 25,
      useNativeDriver: true,
    }).start();
  }, [bounce, props.visible]);
  const comments = useFlatListAPI(fetchComments, useComments, id);
  const [expandedComments, setExpanded] = useTreeList(
    comments.results,
    (e) => e.replies
  );

  return (
    <BottomSheetDialog {...props} dragToClose scrollable={false}>
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
      <FlatList
        {...comments.flatListProps}
        data={expandedComments}
        style={{
          paddingTop: 8,
          width: "100%",
          flex: 1,
        }}
        contentContainerStyle={{
          gap: 8,
          width: "100%",
        }}
        renderItem={({ item: { element, depth, expanded } }) => {
          return (
            <View style={{ width: "100%", paddingLeft: depth * 16 }}>
              {element.loading ? (
                <Loader />
              ) : (
                <CommentsView
                  comment={element}
                  expanded={expanded}
                  setExpanded={(open) => setExpanded(element, open)}
                />
              )}
            </View>
          );
        }}
      />
      <Form>
        <View
          style={[
            AppStyles.row,
            { paddingTop: 8, alignItems: "center", gap: 8 },
          ]}
        >
          <FormInput
            as={DecoratedTextField}
            name="comment"
            prefix={<IconButton2 icon={Smileys} size={24} />}
            containerStyle={{ flex: 1 }}
            outlined
            noMargin
            placeholder="Write a comment"
          />
          <AppButton
            prefixIcon={Send}
            style={{ width: 48, height: 48, paddingRight: 10 }}
            fontSize={24}
          />
        </View>
      </Form>
    </BottomSheetDialog>
  );
}

const styles = StyleSheet.create({
  comment: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 18,
    letterSpacing: 0,
    color: "#2B2C33",
    fontFamily: "Mulish"
  },
  section: {
    paddingBottom: 10
  }
})
