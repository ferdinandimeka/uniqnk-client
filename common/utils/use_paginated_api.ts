import { AppDispatch } from "@/redux/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createGenericAPIAction } from "./redux";

export default function usePaginatedAPI<V extends any[], W extends any[]>(
  fetchData: ReturnType<
    typeof createGenericAPIAction<V, [offset: number, ...W]>
  >[0],
  useInitialData: ReturnType<
    typeof createGenericAPIAction<V, [offset: number, ...W]>
  >[1],
  ...args: W
) {
  const initialCards = useInitialData(0, ...args);
  const [allCards, setAllCards] = useState<V>(null);
  const [endReached, setEndReached] = useState<number | false>(false);
  useEffect(() => {
    setAllCards(initialCards);
    if (initialCards?.length) setEndReached(false);
  }, [initialCards]);

  const dispatch = useDispatch<AppDispatch>();

  const fetchMore = useCallback(
    async (force?: unknown) => {
      if (force !== true && endReached && Date.now() - endReached < 30_000)
        return;
      const x = await dispatch(fetchData(allCards?.length ?? 0, ...args));

      if (x?.length) {
        setAllCards((allCards ? allCards.concat(x) : x) as V);
      } else {
        setEndReached(Date.now());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allCards, dispatch, fetchData, endReached, ...args]
  );
  const [refreshing, setRefresing] = useState(false);

  const refresh = useCallback(() => {
    console.log("refreshing...");
    setRefresing(true);
    dispatch(fetchData(0, ...args)).finally(() => {
      setRefresing(false);
      console.log("done refreshing...");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ...args, fetchData]);

  return useMemo(
    () => ({
      results: allCards,
      endReached: !!endReached,
      fetchMore,
      refresh,
      refreshing,
    }),
    [allCards, fetchMore, endReached, refresh, refreshing]
  );
}
