import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { usePhoneViewTarget } from "@/services/phoneView";
import { loadTodoItems, TodoItem } from "@/services/todo";
import { colors, typography } from "@/theme/colors";
import { getSubjectColor } from "@/theme/subjectColors";

export default function TodoScreen() {
  usePhoneViewTarget("tasks");

  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [message, setMessage] = useState("불러오는 중");

  useEffect(() => {
    let active = true;

    async function loadTodos() {
      try {
        setMessage("불러오는 중");
        const items = await loadTodoItems();

        if (active) {
          setTodoItems(items);
          setMessage(items.length > 0 ? "" : "등록된 할 일이 없어요");
        }
      } catch (error) {
        console.log("[todo] load failed:", error);

        if (active) {
          setTodoItems([]);
          setMessage("할 일을 불러오지 못했어요");
        }
      }
    }

    loadTodos();

    return () => {
      active = false;
    };
  }, []);

  const allDone = todoItems.length === 0;

  return (
    <Screen scroll contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>할 일</Text>
        </View>

        {allDone ? (
          <View style={styles.doneBox}>
            <Text style={styles.doneTitle}>{message}</Text>
          </View>
        ) : (
          <FlatList
            data={todoItems}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const subjectColor = getSubjectColor(item.subject);

              return (
                <Pressable style={[styles.todoCard, item.done && styles.todoCardDone]} onPress={() => router.push(`/todo/${item.id}`)}>
                  <View style={[styles.subjectDot, { backgroundColor: subjectColor }]} />
                  <View style={styles.todoTextArea}>
                    <Text style={[styles.todoSub, { color: subjectColor, marginTop: 0, marginBottom: 2 }]}>{item.subject}</Text>
                    <Text style={[styles.todoTitle, item.done && styles.todoTitleDone]}>{item.title}</Text>
                  </View>
                </Pressable>
              );
            }}
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
    marginBottom: 10
  },
  title: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: typography.bold
  },
  list: {
    gap: 8,
    paddingBottom: 4
  },
  todoCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  todoCardDone: {
    opacity: 0.45
  },
  subjectDot: {
    width: 12,
    height: 12,
    borderRadius: 8,
    marginRight: 12
  },
  checkDone: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft
  },
  checkText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: typography.bold
  },
  todoTextArea: {
    flex: 1
  },
  todoTitle: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.medium,
    lineHeight: 19
  },
  todoTitleDone: {
    textDecorationLine: "line-through"
  },
  
  todoSub: {
    color: colors.soft,
  
    fontSize: 11,
    fontFamily: typography.medium,
    marginTop: 4
  },
  doneBox: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center"
  },
  doneTitle: {
    color: colors.gold,
    fontSize: 26,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  doneSubtitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.medium,
    marginTop: 6
  }
});
