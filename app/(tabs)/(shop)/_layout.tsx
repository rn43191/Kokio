import { Stack } from "expo-router";

import _isFunction from "lodash/isFunction";
import _get from "lodash/get";

import Header from "@/components/Header";
import { ROUTE_NAMES } from "@/constants/route.constants";
import CheckoutHeader from "@/components/checkoutHeader";
import appBootstrap from "@/utils/appBootstrap";

export default function ShopStack() {
  return (
    <Stack>
      <Stack.Screen
        name={ROUTE_NAMES.HOME}
        options={{
          header: () => (
            <Header title="Shop" style={{ justifyContent: "center" }} />
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
              <Header
                title={countryLabel}
                hasBack
                style={{ justifyContent: "center" }}
              />
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
              <Header
                title={regionLabel}
                hasBack
                style={{ justifyContent: "center" }}
              />
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
              <Header
                title="Install eSIM"
                style={{ justifyContent: "center" }}
                hasBack
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
