import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import _isFunction from "lodash/isFunction";
import _get from "lodash/get";

import Header from "@/components/Header";
import { ROUTE_NAMES } from "@/constants/route.constants";
import CheckoutHeader from "@/components/checkoutHeader";
import appBootstrap from "@/utils/appBootstrap";

export default function ShopStack() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        contentStyle:
          route.name === ROUTE_NAMES.CHECKOUT ? { flex: 1 } : undefined,
      })}
    >
      <Stack.Screen
        name={ROUTE_NAMES.HOME}
        options={{
          header: () => (
            <SafeAreaView edges={["top"]}>
              <Header title="Shop" style={{ justifyContent: "center" }} />
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.BY_COUNTRY}
        options={({ route, navigation }: any) => {
          const countryConfig = appBootstrap.getCountryConfig;
          const countryLabel =
            _get(countryConfig, [route?.params?.id, "name"]) || "";
          return {
            header: () => (
              <SafeAreaView edges={["top"]}>
                <Header
                  title={countryLabel}
                  hasBack
                  style={{ justifyContent: "center" }}
                />
              </SafeAreaView>
            ),
          };
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.BY_REGION}
        options={({ route, navigation }: any) => {
          const regionConfig = appBootstrap.getRegionConfig;
          const regionLabel =
            _get(regionConfig, [route?.params?.id, "name"]) || "";

          return {
            header: () => (
              <SafeAreaView edges={["top"]}>
                <Header
                  title={regionLabel}
                  hasBack
                  style={{ justifyContent: "center" }}
                />
              </SafeAreaView>
            ),
          };
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.CHECKOUT}
        options={({ route }: any) => {
          const { id, item } = route?.params || {};
          return {
            header: () => <CheckoutHeader id={id} eSimDetails={item} />,
          };
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.INSTALLATION}
        options={() => {
          return {
            header: () => (
              <SafeAreaView edges={["top"]}>
                <Header
                  title="Install eSIM"
                  style={{ justifyContent: "center" }}
                  hasBack
                  goBackHandler={() => {
                    router.push("/");
                  }}
                />
              </SafeAreaView>
            ),
            animation: "slide_from_right",
            animationDuration: 100,
          };
        }}
      />
    </Stack>
  );
}
