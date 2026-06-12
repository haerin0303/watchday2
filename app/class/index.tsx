import { StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { classPeriods } from "@/data/mock";
import { colors, typography } from "@/theme/colors";

export default function ClassScreen() {
  const current = classPeriods[0];

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.content}>
          <View style={styles.centerBlock}>
            <View style={styles.headerInline}>
              <Text style={styles.title}>시간표</Text>
              <Text style={styles.timeLabel}>{current.time}</Text>
            </View>

            <Text style={styles.period}>{current.period}</Text>
            <Text style={styles.subject}>{current.subject}</Text>
            <Text style={styles.room}>{current.room}</Text>
          </View>
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: "center"
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
    gap: 8
  },
  headerInline: {
    alignItems: "center",
    gap: 6,
    marginBottom: 18
  },
  title: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: typography.bold,
    letterSpacing: 0.2
  },
  timeLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontFamily: typography.medium,
    letterSpacing: 0.1
  },
  centerBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -8 }]
  },
  period: {
    color: "#FF6A45",
    fontSize: 13,
    fontFamily: typography.medium,
    marginBottom: 10,
    letterSpacing: 0.1
  },
  subject: {
    color: "#FF6A45",
    fontSize: 52,
    lineHeight: 60,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  room: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 15,
    marginTop: 10,
    fontFamily: typography.medium
  }
});
