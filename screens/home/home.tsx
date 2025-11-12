import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import _get from "lodash/get";

import ActiveESIMsScroll from "@/components/home/active-esim-scroll";
import Wallet from "@/components/home/wallet";
import Hero from "@/components/home/hero";
import { useKokio } from "@/hooks/useKokio";

export default function HomeScreen() {
  const { kokio } = useKokio();

  const purchasedESIMs = _get(kokio, "purchasedESIMs") || [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Hero />
        {kokio.userWallet ? (
          <>
            <ActiveESIMsScroll purchasedESIMs={purchasedESIMs} />
            <Wallet
              walletId={kokio.userWallet?.address}
              balance="0"
              isWalletAdded
            />
          </>
        ) : (
          <Wallet isWalletAdded={false} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
