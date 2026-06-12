import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { todoItems } from "@/data/mock";
import { colors, typography } from "@/theme/colors";

export default function TodoScreen() {
  const allDone = todoItems.length > 0 && todoItems.every((item) => item.done);
  const subjectColor = (subject?: string) => {
    switch (subject) {
      case "수학":
        return "#6EC1FF";
      case "영어":
        return "#66D196";
      case "과학":
        return "#FF7A7A";
      default:
        return "#C4C4C4";
    }
  };
  

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
              <Pressable style={[styles.todoCard, item.done && styles.todoCardDone]} onPress={() => router.push(`/todo/${item.id}`)}>
                <View style={[styles.subjectDot, { backgroundColor: subjectColor((item as any).subject) }]} />
                <View style={styles.todoTextArea}>
                  <Text style={[styles.todoTitle, item.done && styles.todoTitleDone]}>{item.title}</Text>
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
