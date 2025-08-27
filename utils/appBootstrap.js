import _keyBy from "lodash/keyBy";

// Create a singleton instance
let instance = {
  initialized: false,
};
/**
 * Class to store and access bootstrap data across the app
 */
class AppBootstrap {
  constructor({ countries, regions } = {}) {
    if (!instance.initialized) {
      instance = {
        initialized: false,
        countries,
        regions,
        countryConfig: _keyBy(countries, "code"),
        regionConfig: _keyBy(regions, "code"),
      };
    }
  }

  static set setCountries(countries) {
    instance.countries = countries;
    instance.countryConfig = _keyBy(countries, "code");
  }

  static set setRegions(regions) {
    instance.regions = regions;
    instance.regionConfig = _keyBy(regions, "code");
  }

  static get getRegions() {
    return instance.regions;
  }
  static get getRegionConfig() {
    return instance.regionConfig;
  }

  static get getCountries() {
    return instance.countries;
  }
  static get getCountryConfig() {
    return instance.countryConfig;
  }

  static get isInitialized() {
    return instance.initialized;
  }
}

export default AppBootstrap;
