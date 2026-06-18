import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { getCachedTodayMeal, loadTodayMeal, MealData } from "@/services/meal";
import { usePhoneViewTarget } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

const ALLERGY_LABELS: Record<string, string> = {
  "1": "난류",
  "2": "우유",
  "3": "메밀",
  "4": "땅콩",
  "5": "대두",
  "6": "밀",
  "7": "고등어",
  "8": "게",
  "9": "새우",
  "10": "돼지고기",
  "11": "복숭아",
  "12": "토마토",
  "13": "아황산류",
  "14": "호두",
  "15": "닭고기",
  "16": "쇠고기",
  "17": "오징어",
  "18": "조개류",
  "19": "잣"
};

function formatAllergyText(allergyCode?: string) {
  if (!allergyCode || allergyCode === "알레르기 정보 없음") {
    return "알레르기 정보 없음";
  }

  const items = allergyCode
    .split(/[.,/ ]+/)
    .map((code) => code.trim())
    .filter((code) => code.length > 0)
    .map((code) => `${code} ${ALLERGY_LABELS[code] ?? "알레르기"}`);

  return items.length > 0 ? items.join("\n") : "알레르기 정보 없음";
}

export default function MealAllergyDetailScreen() {
  usePhoneViewTarget("meal");

  const params = useLocalSearchParams<{ mealId?: string }>();
  const [meal, setMeal] = useState<MealData | null>(() => getCachedTodayMeal());
  const [fallbackText, setFallbackText] = useState("불러오는 중");

  useEffect(() => {
    if (meal) {
      return;
    }

    let active = true;

    async function loadMeal() {
      try {
        const nextMeal = await loadTodayMeal();

        if (active) {
          setMeal(nextMeal);
          setFallbackText("알레르기 정보 없음");
        }
      } catch (error) {
        console.log("[meal] allergy load failed:", error);

        if (active) {
          setFallbackText("급식 정보를 불러오지 못했어요");
        }
      }
    }

    loadMeal();

    return () => {
      active = false;
    };
  }, [meal]);

  const menu = useMemo(() => meal?.items.find((item) => item.id === params.mealId) ?? meal?.items[0] ?? null, [meal?.items, params.mealId]);
  const allergyText = menu ? formatAllergyText(menu.allergyNumbers) : fallbackText;

  return (
    <Screen scroll contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>급식</Text>
          <Text style={styles.date}>{meal?.date ?? ""}</Text>
        </View>

        <View style={styles.allergyArea}>
          <Text style={styles.value}>{allergyText}</Text>
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 42,
    paddingBottom: 36
  },
  header: {
    alignItems: "center",
    marginBottom: 18,
    gap: 4
  },
  title: {
    color: colors.white,
    fontSize: 21,
    lineHeight: 25,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  date: {
    color: colors.soft,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: typography.bold
  },
  allergyArea: {
    alignItems: "center",
    backgroundColor: colors.backgroundThird,
    borderColor: colors.borderPrimary,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginTop: 4,
    minHeight: 118,
    justifyContent: "center"
  },
  value: {
    color: colors.soft,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: typography.medium,
    textAlign: "center"
  }
});
