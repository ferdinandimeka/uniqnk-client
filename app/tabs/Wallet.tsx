import AppScreen from "@/app/components/AppScreen";

import AppText from "@/app/components/AppText";
// import { AppScreenProps } from "../../../navigation/RootRouter";
// import { TabsParamList } from "@/navigation/TabsRouter";
import {
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_HOVER
} from "@/common/theming/colors";
import { Wallet3 } from "iconsax-react-native";

export default function WalletScreen() {
  return (
    <AppScreen
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        paddingBottom: 72,
      }}
    >
      <Wallet3 size={120} color={PRIMARY_HOVER} />
      <AppText variant="design" style={{ color: PRIMARY_DARK }}>
        Uniq Wallet
      </AppText>
      <AppText variant="body1" style={{ color: PRIMARY }}>
        Coming Soon...
      </AppText>
    </AppScreen>
  );
}
