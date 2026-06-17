import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { loadTodayMeal, MealData } from "@/services/meal";
import { usePhoneViewTarget } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

export default function MealScreen() {
  usePhoneViewTarget("meal");

  const [meal, setMeal] = useState<MealData | null>(null);
  const [message, setMessage] = useState("불러오는 중");

  useEffect(() => {
    let active = true;

    async function loadMeal() {
      try {
        setMessage("불러오는 중");
        const nextMeal = await loadTodayMeal();

        if (!active) {
          return;
        }

        setMeal(nextMeal);
        setMessage(nextMeal.existence && !nextMeal.rest && nextMeal.items.length > 0 ? "" : "오늘 급식이 없어요");
      } catch (error) {
        console.log("[meal] load failed:", error);

        if (active) {
          setMeal(null);
          setMessage("급식 정보를 불러오지 못했어요");
        }
      }
    }

    loadMeal();

    return () => {
      active = false;
    };
  }, []);

  const items = meal?.items ?? [];

  return (
    <Screen scroll contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>급식</Text>
          <Text style={styles.date}>{meal?.date ?? ""}</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{message}</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.menuCard}>
                <Text style={styles.menuText}>{item.name}</Text>
                <Pressable style={styles.infoButton} onPress={() => router.push(`/meal/allergy/${item.id}`)}>
                  <Ionicons name="information-circle" size={20} color={colors.orange} />
                </Pressable>
              </View>
            )}
          />
        )}
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    paddingBottom: 10
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    gap: 4
  },
  title: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: typography.bold
  },
  date: {
    color: colors.gold,
    fontSize: 12,
    fontFamily: typography.medium
  },
  list: {
    gap: 8,
    paddingBottom: 4
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  menuText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: typography.medium,
    textAlign: "center",
    flexShrink: 1
  },
  infoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceElevated
  },
  emptyBox: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    color: colors.soft,
    fontSize: 14,
    fontFamily: typography.medium,
    textAlign: "center"
  }
});
