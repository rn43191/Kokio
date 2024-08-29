/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // background: '#ffffff',
    foreground: "#09090b",

    card: "#ffffff",
    cardForeground: "#09090b",

    popover: "#ffffff",
    popoverForeground: "#09090b",

    primary: "#006FEE",
    primaryForeground: "#ffffff",

    secondary: "#f4f4f5",
    secondaryForeground: "#09090b",

    muted: "#f4f4f5",
    mutedForeground: "#71717a",

    accent: "#f4f4f5",
    accentForeground: "#09090b",

    destructive: "#ff0000",
    destructiveForeground: "#ffffff",

    border: "#e4e4e7",

    input: "#e4e4e7",

    ring: "#006FEE",
  },

  dark: {
    text: "#AEAEB2",
    background: "#000000",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // background: '#ffffff',
    foreground: "#AEAEB2",

    card: "#FFD60A",
    cardForeground: "#000000",

    popover: "#242427",
    popoverForeground: "#E5E5EA",

    primary: "#FF9F0A",
    primaryForeground: "#000000",

    secondary: "#FFD60A",
    secondaryForeground: "#000000",

    muted: "#46464B",
    mutedForeground: "#AEAEB2",

    accent: "#767680",
    accentForeground: "#8E8E93",

    destructive: "#ff0000",
    destructiveForeground: "#ffffff",

    border: "#FF9F0A",

    input: "#46464B",

    ring: "#006FEE",
  },
};
