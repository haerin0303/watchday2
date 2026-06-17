import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { getCachedTodayMeal, loadTodayMeal, MealData } from "@/services/meal";
import { usePhoneViewTarget } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

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
  const allergyText = menu ? `${menu.name} - ${menu.allergyNumbers}` : fallbackText;

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>알레르기 정보</Text>
          <Text style={styles.subtitle}>{menu?.name ?? ""}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>알레르기 번호</Text>
          <Text style={styles.value}>{allergyText}</Text>
          <Text style={styles.note}>{menu?.warning ?? fallbackText}</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>닫기</Text>
        </Pressable>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    paddingBottom: 14,
    justifyContent: "space-between"
  },
  header: {
    alignItems: "center",
    gap: 4
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  subtitle: {
    color: colors.gold,
    fontSize: 12,
    fontFamily: typography.medium,
    textAlign: "center"
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: "center",
    gap: 8
  },
  label: {
    color: colors.soft,
    fontSize: 11,
    fontFamily: typography.medium,
    letterSpacing: 0.8
  },
  value: {
    color: colors.orange,
    fontSize: 22,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  note: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    fontFamily: typography.medium
  },
  closeButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  closeText: {
    color: colors.gold,
    fontSize: 13,
    fontFamily: typography.medium
  }
});
