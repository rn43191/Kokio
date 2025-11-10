import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";
import _map from "lodash/map";

import ActiveESIMsScroll from "@/components/home/active-esim-scroll";
import Wallet from "@/components/home/wallet";
import Hero from "@/components/home/hero";
import { useKokio } from "@/hooks/useKokio";
import { Esim } from "@/components/ESIMItem";

export default function HomeScreen() {
  const { kokio } = useKokio();

  const activeESIMs: Esim[] = useMemo(() => {
    return _map(kokio?.purchasedESIMs, "eSimItem");
  }, [kokio?.purchasedESIMs]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Hero />
        {kokio.userWallet ? (
          <>
            <ActiveESIMsScroll esims={activeESIMs} />
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
