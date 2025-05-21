import CountryFlag from "react-native-country-flag";
import { Image } from "react-native";

import _get from "lodash/get";
const CODE_VS_RESIZE_MODE = {
  NP: "center",
  DEFAULT: "cover",
};
const CountryFlagWrapper = ({
  style = {},
  size = 20,
  isoCode = "",
  flagUrl = "",
}) => {
  const resizeMode =
    _get(CODE_VS_RESIZE_MODE, isoCode) || CODE_VS_RESIZE_MODE.DEFAULT;

  return flagUrl ? (
    <Image
      source={{ uri: flagUrl }}
      style={[{ height: size, width: 1.7 * size }, style]}
      resizeMode={resizeMode}
    />
  ) : (
    <CountryFlag style={style} isoCode={isoCode} size={size} />
  );
};

export default CountryFlagWrapper;
