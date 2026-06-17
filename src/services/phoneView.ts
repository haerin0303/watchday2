import { useCallback } from "react";
import { Alert, Linking } from "react-native";
import { useFocusEffect } from "expo-router";

type PhoneViewTarget = "home" | "timetable" | "meal" | "tasks";

const PHONE_VIEW_URLS: Record<PhoneViewTarget, string> = {
  home: "dailysunrin://home",
  timetable: "dailysunrin://timetable",
  meal: "dailysunrin://meal",
  tasks: "dailysunrin://tasks"
};

let currentPhoneViewTarget: PhoneViewTarget = "home";

export function usePhoneViewTarget(target: PhoneViewTarget) {
  useFocusEffect(
    useCallback(() => {
      currentPhoneViewTarget = target;
    }, [target])
  );
}

export async function openCurrentPhoneView() {
  const url = PHONE_VIEW_URLS[currentPhoneViewTarget];

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log("[phone-view] open failed:", error);
    Alert.alert("폰에서 보기", "폰에 Daily Sunrin 앱이 설치되어 있지 않거나 실행할 수 없어요.");
  }
}
