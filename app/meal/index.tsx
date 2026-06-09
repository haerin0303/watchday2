import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { todayMeal } from "@/data/mock";
import { colors, typography } from "@/theme/colors";

export default function MealScreen() {
  return (
    <Screen scroll contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>급식</Text>
          <Text style={styles.date}>{todayMeal.date}</Text>
        </View>

        {todayMeal.items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>등록된 급식이 없습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={todayMeal.items}
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
