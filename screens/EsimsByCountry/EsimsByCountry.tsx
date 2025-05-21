import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import _get from "lodash/get";

import { Theme } from "@/constants/Colors";
import { COUNTRY_CONFIG } from "@/constants/general.constants";
import { useEsimsByCountry } from "@/queries/e-sims";
import appBootstrap from "@/utils/appBootstrap";

import DataPackTabGroup from "@/components/DataPackTabGroup";

export default function EsimsByCountry() {
  const params = useLocalSearchParams();
  const countryConfig = appBootstrap.getCountryConfig;
  const countryCode = _get(countryConfig, [params?.id, "code"]);
  const { data: esims, isFetching } = useEsimsByCountry(countryCode, {
    enabled: !!countryCode,
  });

  return (
    <DataPackTabGroup
      esims={esims}
      containerStyle={styles.containerStyle}
      isLoading={isFetching}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: Theme.spacing.sm,
  },
});
