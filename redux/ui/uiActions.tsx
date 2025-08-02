import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useAppPadding = () =>
  useSelector((e: RootState) => e.ui.transient.app_padding);

export const useAppTheme = () =>
  useSelector((e: RootState) => e.ui.transient.theme);
