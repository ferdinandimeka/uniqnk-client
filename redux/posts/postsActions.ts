import { createDummyGenericAPIAction } from "@/common/utils/dummy_api_action";
import { dummyData, pick } from "@/common/utils/dummy_data";
import { faker } from "@faker-js/faker/";

export const [fetchPosts, usePosts] = createDummyGenericAPIAction({
  id: "insert_id(posts)",
  author: {
    id: "insert_id(author)",
    name: "name",
    photo_url: "image",
  },
  is_liked: pick(true, false),
  is_saved: pick(true, false),
  num_likes: "number",
  num_comments: "number",
  num_saved: "number",
  post: "text(1,10)",
  location: () => "Asaba",
  created_at: "pastDate",
  image: "optional(image)",
});

export const [fetchStatus, useStatus] = createDummyGenericAPIAction({
  author: {
    id: "insert_id(author)",
    name: "name",
    photo_url: "image",
  },

  count: "range(5, 10)",
});

const commentSchema = {
  id: "insert_id(comments)",
  author: {
    id: "insert_id(author)",
    name: "name",
    photo_url: "image",
  },
  created_at: "pastDate",
  is_liked: pick(true, false),
  num_likes: "number",
  post: "text(1)",
  num_comments: () =>
    pick(
      0,
      dummyData({ value: "range(0,20)" }).value,
      dummyData({ value: "range(0,5)" }).value
    )(),
  replies: () => dummyData([commentSchema, 0, 2]),
} as const;
export const [fetchComments, useComments] =
  createDummyGenericAPIAction(commentSchema);

export const [fetchExploreTags, useExploreTags] = createDummyGenericAPIAction({
  name: () => faker.commerce.productAdjective(),
  id: "insert_id(tags)",
});
export const [fetchExploreArticles, useExploreArticles] =
  createDummyGenericAPIAction({
    image: "image",
    id: "insert_id(tags)",
    tagId: () => dummyData({ value: "insert_id(tags)" }).value
  });
