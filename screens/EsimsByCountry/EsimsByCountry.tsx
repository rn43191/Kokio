import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import _get from "lodash/get";

import { Theme } from "@/constants/Colors";
import { COUNTRY_CONFIG } from "@/constants/general.constants";
import { useEsimsByCountry } from "@/queries/e-sims";

import DataPackTabGroup from "@/components/DataPackTabGroup";

export default function EsimsByCountry() {
  const params = useLocalSearchParams();
  const countryCode = _get(COUNTRY_CONFIG, [params?.id, "isoCode"]);
  const { data: esims, ...rest } = useEsimsByCountry(countryCode, {
    enabled: !!countryCode,
  });

  console.log({ esims });

  return (
    <DataPackTabGroup esims={esims} containerStyle={styles.containerStyle} />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: Theme.spacing.sm,
  },
});
