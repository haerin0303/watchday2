import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { openCurrentPhoneView } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

export default function SettingsScreen() {
  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.content}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <View style={styles.logoMarkStem} />
              <View style={styles.logoMarkTop} />
              <View style={styles.logoMarkSlash} />
            </View>
            <Text style={styles.logoText}>ologio</Text>
          </View>

          <Pressable style={styles.phoneButton} onPress={openCurrentPhoneView}>
            <Ionicons name="phone-portrait-outline" size={28} color={colors.white} />
            <Text style={styles.phoneButtonText}>폰에서 보기</Text>
          </Pressable>
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center"
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -12 }]
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 38
  },
  logoMark: {
    width: 37,
    height: 36
  },
  logoMarkStem: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 13,
    height: 36,
    backgroundColor: colors.brandPrimary
  },
  logoMarkTop: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 36,
    height: 13,
    backgroundColor: colors.brandPrimary
  },
  logoMarkSlash: {
    position: "absolute",
    left: 12,
    top: 15,
    width: 31,
    height: 13,
    backgroundColor: colors.brandPrimary,
    transform: [{ rotate: "45deg" }]
  },
  logoText: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 34,
    fontFamily: typography.bold
  },
  phoneButton: {
    width: "100%",
    maxWidth: 340,
    minHeight: 84,
    backgroundColor: colors.backgroundThird,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14
  },
  phoneButtonText: {
    color: colors.white,
    fontSize: 19,
    fontFamily: typography.bold
  }
});
