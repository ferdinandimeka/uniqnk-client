import { StyleSheet } from "react-native";
import {
  BLACK,
  CARD_HEADER_NEUTRAL,
  DARK_GRAY,
  HEADER_BLACK,
  PRIMARY,
  TEXT_DARKER,
  TEXT_LIGHTER,
  TEXT_NEUTRAL,
  WHITE
} from "./colors";

const TextStyles = StyleSheet.create({
  xs: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 15
  },
  sm: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  smBold: {
    fontSize: 14,
    fontFamily: "Mulish_700Bold",
  },
  normal: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  italic: {
    fontStyle: "italic",
  },
  bold: {
    fontFamily: "Mulish_700Bold",
  },
  thin: {
    fontFamily: "Inter_300Light",
  },
  lg: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
  },
  lgBold: {
    fontSize: 18,
    fontFamily: "Mulish_700Bold",
  },
  xl: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
  xlBold: {
    fontSize: 20,
    fontFamily: "Mulish_700Bold",
  },
  _2xl: {
    fontSize: 24,
    fontFamily: "Inter_400Regular",
  },
  _2xlBold: {
    fontSize: 24,
    fontFamily: "Mulish_700Bold",
  },
  design: {
    fontSize: 36,
    fontFamily: "Mulish_700Bold",
  },
  design2: {
    fontSize: 32,
    fontFamily: "Mulish_600SemiBold",
  },
  _3xlBold: {
    fontSize: 28,
    fontFamily: "Mulish_700Bold",
  },
});

export const variants = StyleSheet.create({
  largeLight: {
    ...TextStyles._3xlBold,
    color: DARK_GRAY,
  },
  largeDark: {
    ...TextStyles._3xlBold,
    color: HEADER_BLACK,
  },
  largeWhite: {
    ...TextStyles._3xlBold,
    color: WHITE,
  },
  headerSm: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: CARD_HEADER_NEUTRAL,
    lineHeight: 24,
  },
  header: {
    ...TextStyles.lgBold,
    color: CARD_HEADER_NEUTRAL,
    lineHeight: TextStyles.lg.fontSize * 1.5,
  },
  headerXlDark: {
    ...TextStyles.xlBold,
    color: DARK_GRAY,
    lineHeight: 30,
  },
  header2XlDark: {
    ...TextStyles._2xlBold,
    color: DARK_GRAY,
    lineHeight: 36,
  },
  headerXlBlack: {
    ...TextStyles.xlBold,
    color: BLACK,
    lineHeight: 30,
  },
  header2XlBlack: {
    ...TextStyles._2xlBold,
    color: BLACK,
    lineHeight: 36,
  },
  headerXl: {
    ...TextStyles.xlBold,
    color: CARD_HEADER_NEUTRAL,
    lineHeight: 30,
  },
  header2Xl: {
    ...TextStyles._2xlBold,
    color: CARD_HEADER_NEUTRAL,
    lineHeight: 36,
  },
  body1: {
    ...TextStyles.normal,
    color: TEXT_NEUTRAL,
    lineHeight: 24,
  },
  body1Bold: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: CARD_HEADER_NEUTRAL,
    lineHeight: 24,
  },
  body1BoldDark: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: TEXT_DARKER,
    lineHeight: 24,
  },
  body1BoldBlack: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: BLACK,
    lineHeight: 24,
  },
  bodyLg: {
    ...TextStyles.lg,
    color: DARK_GRAY,
    lineHeight: 24,
  },
  label1Light: {
    ...TextStyles.normal,
    ...TextStyles.thin,
    color: TEXT_LIGHTER,
    lineHeight: 24,
  },
  body1Light: {
    ...TextStyles.normal,
    ...TextStyles.thin,
    color: TEXT_LIGHTER,
    lineHeight: TextStyles.normal.fontSize * 1.2,
  },
  label2Light: {
    ...TextStyles.sm,
    ...TextStyles.thin,
    color: TEXT_LIGHTER,
    lineHeight: TextStyles.sm.fontSize * 1.2,
  },
  body1LightSlant: {
    ...TextStyles.italic,
    ...TextStyles.thin,
    color: TEXT_LIGHTER,
    lineHeight: 24,
  },
  body1Link: {
    ...TextStyles.normal,
    fontWeight: "bold",
    color: PRIMARY,
    lineHeight: 24,
  },
  body1White: {
    ...TextStyles.normal,
    color: WHITE,
    lineHeight: 24,
  },
  body1Darker: {
    ...TextStyles.normal,
    color: TEXT_DARKER,
    lineHeight: 24,
  },
  body1Black: {
    ...TextStyles.normal,
    color: BLACK + "dd",
    lineHeight: 24,
  },
  body2Dark: {
    ...TextStyles.normal,
    fontSize: 14.875,
  },
  body2: {
    ...TextStyles.normal,
    color: TEXT_NEUTRAL,
    fontSize: 14.875,
  },
  body2Bold: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: CARD_HEADER_NEUTRAL,
    fontSize: 14.875,
  },
  body2Light: {
    ...TextStyles.sm,
    ...TextStyles.thin,
    color: TEXT_LIGHTER,
  },
  buttonText: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: WHITE,
  },
  buttonTextPrimary: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: PRIMARY,
  },
  buttonTextDark: {
    ...TextStyles.normal,
    ...TextStyles.bold,
    color: TEXT_DARKER,
  },
  design: {
    ...TextStyles.design,
    color: BLACK,
  },
  design2: {
    ...TextStyles.design2,
    color: BLACK,
  },
});

export default TextStyles;
