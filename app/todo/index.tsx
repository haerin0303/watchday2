import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { todoItems } from "@/data/mock";
import { colors, typography } from "@/theme/colors";

export default function TodoScreen() {
  const allDone = todoItems.length > 0 && todoItems.every((item) => item.done);

  return (
    <Screen scroll contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>할 일</Text>
        </View>

        {allDone ? (
          <View style={styles.doneBox}>
            <Text style={styles.doneTitle}>집가기</Text>
            <Text style={styles.doneSubtitle}>남음없기</Text>
          </View>
        ) : (
          <FlatList
            data={todoItems}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable style={styles.todoCard} onPress={() => router.push(`/todo/${item.id}`)}>
                <View style={[styles.check, item.done && styles.checkDone]}>
                  <Text style={styles.checkText}>{item.done ? "✓" : ""}</Text>
                </View>
                <View style={styles.todoTextArea}>
                  <Text style={styles.todoTitle}>{item.title}</Text>
                  <Text style={styles.todoSub}>{item.due}</Text>
                </View>
              </Pressable>
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
    justifyContent: "center"
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
