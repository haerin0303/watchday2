import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { todoItems } from "@/data/mock";
import { colors, typography } from "@/theme/colors";

export default function TodoDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const todo = todoItems.find((item) => item.id === params.id) ?? todoItems[0];

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>할 일 상세</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemTitle}>{todo?.title}</Text>
          <Text style={styles.description}>{todo?.description}</Text>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>마감일</Text>
            <Text style={styles.metaValue}>{todo?.due}</Text>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>상태</Text>
            <Text style={styles.metaValue}>{todo?.status}</Text>
          </View>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>돌아가기</Text>
        </Pressable>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 14,
    paddingBottom: 18,
    justifyContent: "space-between"
  },
  header: {
    alignItems: "center"
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontFamily: typography.bold
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 22,
    gap: 14
  },
  itemTitle: {
    color: colors.gold,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  description: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: typography.medium
  },
  metaBlock: {
    alignItems: "center",
    gap: 4
  },
  metaLabel: {
    color: colors.soft,
    fontSize: 12,
    fontFamily: typography.medium
  },
  metaValue: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.medium
  },
  backButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14
  },
  backText: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: typography.medium
  }
});
