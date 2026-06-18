import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { PillButton } from "@/components/PillButton";
import { Screen } from "@/components/Screen";
import { usePhoneViewTarget } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

export default function HomeScreen() {
  usePhoneViewTarget("home");

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.topArea}>
          <Text style={styles.brand}>ologio</Text>
        </View>

        <View style={styles.menuArea}>
          <PillButton
            label="시간표"
            icon={<Ionicons name="calendar-clear-outline" size={18} color={colors.white} />}
            onPress={() => router.push("/class")}
          />
          <PillButton
            label="급식"
            icon={<Ionicons name="restaurant" size={18} color={colors.white} />}
            onPress={() => router.push("/meal")}
          />
          <PillButton
            label="할 일"
            icon={<Ionicons name="clipboard" size={18} color={colors.white} />}
            onPress={() => router.push("/todo")}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerButtonWrap}>
            <PillButton
              label="설정"
              variant="ghost"
              icon={<Ionicons name="settings-sharp" size={15} color={colors.soft} />}
              onPress={() => router.push("/settings")}
            />
          </View>
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 38,
    paddingBottom: 34,
    justifyContent: "space-between",
    maxWidth: 396
  },
  topArea: {
    alignItems: "center",
    marginTop: 0
  },
  brand: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 18,
    letterSpacing: 0.4,
    fontFamily: typography.medium
  },
  menuArea: {
    gap: 10,
    marginTop: 12
  },
  footer: {
    alignItems: "center",
    paddingBottom: 0,
    marginTop: 10
  },
  footerButtonWrap: {
    width: "100%"
  }
  
});
