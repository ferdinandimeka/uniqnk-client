import Loader from "@/app/components/Loader";
import NoResults from "@/app/components/NoResults";
import { useMemo } from "react";
import usePaginatedAPI from "./use_paginated_api";

export default function useFlatListAPI<V extends any[], W extends any[]>(
  ...args: Parameters<typeof usePaginatedAPI<V, W>>
) {
  const props = usePaginatedAPI(...args);

  return useMemo(
    () => ({
      flatListProps: {
        refreshing: props.refreshing,
        onRefresh: props.refresh,
        ListFooterComponent:
          props.results && !props.endReached ? <Loader /> : null,
        ListEmptyComponent: props.results ? (
          <NoResults />
        ) : (
          <Loader variant="tab_screen" />
        ),
        onEndReached: props.fetchMore,
        onEndReachedThreshold: 0.8,
      },
      results: props.results,
      endReached: props.endReached,
    }),
    [props]
  );
}
