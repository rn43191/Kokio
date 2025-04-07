import CountryFlag from "react-native-country-flag";

const CountryFlagWrapper = ({ style = {}, size = 20, isoCode = "" }) => (
  <CountryFlag style={style} isoCode={isoCode} size={size} />
);

export default CountryFlagWrapper;
