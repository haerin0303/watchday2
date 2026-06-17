import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { usePhoneViewTarget } from "@/services/phoneView";
import { getCachedTodoItems, loadTodoItems, TodoItem } from "@/services/todo";
import { colors, typography } from "@/theme/colors";
import { getSubjectColor } from "@/theme/subjectColors";

export default function TodoDetailScreen() {
  usePhoneViewTarget("tasks");

  const params = useLocalSearchParams<{ id?: string }>();
  const [todoItems, setTodoItems] = useState<TodoItem[]>(() => getCachedTodoItems());
  const [message, setMessage] = useState("불러오는 중");

  useEffect(() => {
    if (todoItems.length > 0) {
      return;
    }

    let active = true;

    async function loadTodos() {
      try {
        const items = await loadTodoItems();

        if (active) {
          setTodoItems(items);
          setMessage("등록된 할 일이 없어요");
        }
      } catch (error) {
        console.log("[todo] detail load failed:", error);

        if (active) {
          setMessage("할 일을 불러오지 못했어요");
        }
      }
    }

    loadTodos();

    return () => {
      active = false;
    };
  }, [todoItems.length]);

  const todo = useMemo(() => todoItems.find((item) => item.id === params.id) ?? todoItems[0] ?? null, [params.id, todoItems]);
  const subjectColor = getSubjectColor(todo?.subject);
  const detailText = todo
    ? [todo.description, todo.due, todo.period].filter((value) => value.length > 0).join("\n")
    : message;

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.centerFull}>
          <Text style={[styles.bigTitle, { color: subjectColor }]}>{todo?.title ?? message}</Text>
          <Text style={styles.smallSub}>{detailText}</Text>
        </View>
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
    fontSize: 20,
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
    color: colors.soft,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: typography.medium,
    marginTop: 8
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
    paddingVertical: 14,
    marginTop: 20
  },
  backText: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: typography.medium
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  }
  ,
  centerFull: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bigTitle: {
    color: colors.gold,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  smallSub: {
    color: colors.soft,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    textAlign: "center",
    fontFamily: typography.medium
  }
});
