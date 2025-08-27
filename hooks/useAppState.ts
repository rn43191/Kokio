import { useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
// import { useAuthContext } from "../context/AuthContext";

export function useAppState(reauth?: boolean) {
  // const { dispatch } = useAuthContext();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("Kokio App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
}
