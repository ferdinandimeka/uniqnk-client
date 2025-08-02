import { useIsFocused, useNavigationState } from "@react-navigation/native";
import { createContext, useContext, useLayoutEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ScrollView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BG } from "../../common/theming/colors";
// import { useAppPadding } from "../data/features/ui/uiActions";
import ErrorView from "./ErrorView";

const AppContext = createContext({ scrollView: null as ScrollView | null });

export const useAppScrollView = () => {
  return useContext(AppContext).scrollView;
};

export default function AppScreen({
  backgroundColor = BG,
  children,
  noPadding = false,
  scrollable = false,
  style = {} as ViewStyle,
  noSafeArea = false,
}) {
  const focused = useIsFocused();
  const paddingHorizontal = 16;

  const rootStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
    ...(noSafeArea
      ? { paddingVertical: 0 }
      : {
          paddingTop: style.paddingVertical ?? 8,
          paddingBottom: style.paddingVertical ?? (scrollable ? 128 : 8),
        }),
    backgroundColor,
    ...(noPadding ? {} : { paddingHorizontal }),
    alignItems: "flex-start",
    ...style,
  };
  const scrollRef = useRef<ScrollView>(null);
  children = (
    <ErrorBoundary fallback={<ErrorView />}>
      {scrollable ? (
        <AppContext.Provider value={{ scrollView: scrollRef.current }}>
          <ScrollToTop />
          <ScrollView
            ref={scrollRef}
            style={{
              flex: 1,
            }}
            nestedScrollEnabled
            contentContainerStyle={rootStyle}
          >
            {children}
          </ScrollView>
        </AppContext.Provider>
      ) : (
        <View style={rootStyle}>{children}</View>
      )}
    </ErrorBoundary>
  );
  return noSafeArea ? (
    <>
      {focused ? <StatusBar translucent backgroundColor="transparent" /> : null}
      {children}
    </>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      {focused ? (
        <StatusBar backgroundColor={backgroundColor} animated />
      ) : null}
      {children}
    </SafeAreaView>
  );
}

export function ScrollToTop() {
  const scrollView = useAppScrollView();
  const fullPath = useNavigationState((e) => {
    let route: any = e.routes[e.index];
    let fullPath = "";
    while (route) {
      fullPath += route.name + ".";
      route = null; //route.state?.routes[route.state?.index];
    }
    return fullPath;
  });

  useLayoutEffect(() => {
    scrollView?.scrollTo({ y: 0, animated: false });
  }, [fullPath, scrollView]);
  return null;
}
