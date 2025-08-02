import { View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

export default function Spacer({
  style,
}: {
  style?: ViewProps["style"] & object;
}) {
  return <View style={{ flexGrow: 1, ...style }} />;
}
