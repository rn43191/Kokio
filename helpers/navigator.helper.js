import _includes from "lodash/includes";

import { TAB_BAR_ENABLED_ROUTES } from "@/constants/route.constants";

export const getRouteName = (navigationState) => {
  const currentRouteData = navigationState?.routes[navigationState?.index];

  if (currentRouteData?.state) {
    return `${currentRouteData?.name || ""}/${getRouteName(
      currentRouteData?.state
    )}`;
  }

  return currentRouteData?.name;
};

export const getIsTabBarVisible = (routeName) =>
  _includes(TAB_BAR_ENABLED_ROUTES, routeName);
