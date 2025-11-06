import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActiveESIMsScroll from "@/components/home/active-esim-scroll";
import Wallet from "@/components/home/wallet";
import Hero from "@/components/home/hero";
import { useKokio } from "@/hooks/useKokio";
import { Esim } from "@/components/ESIMItem";

// TODO: Get actual active eSIMs
const activeESIMs: Esim[] = [];

export default function HomeScreen() {
  const { kokio } = useKokio();
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
