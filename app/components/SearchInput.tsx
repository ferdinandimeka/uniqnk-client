import { LIGHT_GREY } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { SearchNormal } from "iconsax-react-native";
import { View } from "react-native";
import AppTextField from "./AppTextField";

export default function SearchInput({
  style,
  ...props
}: Parameters<typeof AppTextField>[0]) {
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-end",

        ...(style as object),
      }}
    >
      <AppTextField
        style={[
          AppStyles.outlinedInput,
          { marginBottom: 0, paddingRight: 40, borderRadius: 32 },
        ]}
        focusStyle={AppStyles.outlinedActive}
        {...props}
      />

      <SearchNormal
        color={LIGHT_GREY}
        style={{
          position: "absolute",
          left: 10,
        }}
        size={20}
      />
    </View>
  );
}
