import { StyleSheet } from "react-native";
// import { UIState } from "../../data/features/ui/uiSlice";
// import { RootState } from "../../data/store";
import {
  DISABLED_ON_BG,
  LIGHT_GREY,
  PRIMARY,
  PRIMARY_BG_HOVER,
  SHADOW_ON_BG,
  TEXT_LIGHTER,
  WHITE,
} from "./colors";
import TextStyles from "./text";

const AppStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: SHADOW_ON_BG,
  },
  radioGroupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  fullWidthCard: {
    backgroundColor: WHITE,
    padding: 16,
    paddingVertical: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: SHADOW_ON_BG,
    width: "100%",
  },
  wFull: {
    width: "100%",
  },
  mt: {
    marginTop: 16,
  },
  mt2: {
    marginTop: 32,
  },
  mb: {
    marginBottom: 16,
  },
  mb2: {
    marginBottom: 32,
  },
  mr: {
    marginRight: 4,
  },
  button: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  iconButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  input: {
    ...TextStyles.normal,
    backgroundColor: "#fffefe",
    borderBottomWidth: 1,
    color: "#333333",
    borderColor: LIGHT_GREY,
    textDecorationColor: PRIMARY,
    paddingVertical: 4,
    minHeight: 40,
    marginBottom: 16,
    width: "100%",
  },
  input2: {
    ...TextStyles.normal,
    backgroundColor: "#fffefe",
    borderBottomWidth: 1,
    color: "#333333",
    borderColor: LIGHT_GREY,
    textDecorationColor: PRIMARY,
    paddingLeft: 40,
    minHeight: 40,
    marginBottom: 16,
    width: "100%",
  },
  focusedInput: {
    borderColor: PRIMARY,
    borderBottomWidth: 2,
  },
  outlinedInput: {
    borderColor: TEXT_LIGHTER,
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 32,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  outlinedInputActive: {
    borderColor: PRIMARY,
  },
  outlined: {
    borderColor: TEXT_LIGHTER,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  outlined2: {
    borderColor: LIGHT_GREY,
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  outlinedBox: {
    borderColor: LIGHT_GREY,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  outlinedButton: {
    flex: 1,
    flexBasis: 0,
    borderColor: DISABLED_ON_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 48,
    gap: 16,
    backgroundColor: "transparent",
  },
  outlinedButton2: {
    width: 56,
    padding: 14,
    flexGrow: 1,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  outlinedActive: {
    borderColor: PRIMARY,
    borderWidth: 2,
    borderBottomWidth: 2,
    backgroundColor: PRIMARY_BG_HOVER,
  },
});

// function createDynamicStyles<
//   T extends Record<string, (ui: UIState) => ViewStyle | TextStyle | ImageStyle>
// >(styles: T) {
//   return function () {
//     const uiStyles = useSelector((e: RootState) => e.ui);
//     return useMemo(() => {
//       const cache = new Map();
//       return Object.fromEntries(
//         Object.entries(styles).map((e) => {
//           return [
//             e[0],
//             () =>
//               cache.get(e[0]) ??
//               cache.set(e[0], e[1](uiStyles) ?? {}).get(e[0]),
//           ];
//         })
//       ) as { [key in keyof T]: () => ReturnType<T[key]> };
//     }, [uiStyles]);
//   };
// }

// export const useDynamicStyles = createDynamicStyles({
//   flatListContainer: (ui) => ({
//     justifyContent: "flex-start",
//     minWidth: "100%",
//     columnGap: 8,
//     paddingHorizontal: ui.transient.app_padding,
//     marginBottom: 8,
//   }),
//   flatList: (ui) => ({
//     marginHorizontal: -ui.transient.app_padding,
//   }),
//   text: (ui) => ({
//     color: ui.transient.theme.colors.text,
//   }),
// });

export default AppStyles;
