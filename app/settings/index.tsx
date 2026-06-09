import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/Logo";
import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { colors, typography } from "@/theme/colors";

export default function SettingsScreen() {
  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Logo small />
          <Text style={styles.title}>설정</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>워치 전용 최소 설정</Text>
          <Text style={styles.cardText}>폰 앱에서 더 많은 설정을 확인할 수 있습니다.</Text>
        </View>

        <Pressable
          style={styles.phoneButton}
          onPress={() => Alert.alert("폰에서 보기", "추후 폰 앱과 연결되는 동작을 여기에 연결할 수 있습니다.")}
        >
          <Text style={styles.phoneButtonText}>폰에서 보기</Text>
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
    gap: 6
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontFamily: typography.bold
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 6,
    alignItems: "center"
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 15,
    fontFamily: typography.medium,
    textAlign: "center"
  },
  cardText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    fontFamily: typography.medium
  },
  phoneButton: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  phoneButtonText: {
    color: colors.black,
    fontSize: 13,
    fontFamily: typography.bold
  }
});
