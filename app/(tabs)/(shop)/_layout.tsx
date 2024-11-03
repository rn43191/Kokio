import { Stack } from "expo-router";

import _isFunction from "lodash/isFunction";

import Header from "@/components/Header";
import { ROUTE_NAMES } from "@/constants/route.constants";
import CheckoutHeader from "@/components/checkoutHeader";

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
          const country = route?.params?.id;
          return {
            header: () => (
              <Header
                title={country}
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
          const id = route?.params?.id;
          return {
            header: () => <CheckoutHeader id={id} />,
          };
        }}
      />
    </Stack>
  );
}
