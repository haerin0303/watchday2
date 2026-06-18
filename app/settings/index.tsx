import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { openCurrentPhoneView } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

export default function SettingsScreen() {
  return (
    <Screen scroll contentStyle={styles.screen}>
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
    minHeight: 270,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 34,
    paddingBottom: 34
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 26
  },
  logoMark: {
    width: 30,
    height: 29
  },
  logoMarkStem: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 10,
    height: 29,
    backgroundColor: colors.brandPrimary
  },
  logoMarkTop: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 29,
    height: 10,
    backgroundColor: colors.brandPrimary
  },
  logoMarkSlash: {
    position: "absolute",
    left: 10,
    top: 12,
    width: 25,
    height: 10,
    backgroundColor: colors.brandPrimary,
    transform: [{ rotate: "45deg" }]
  },
  logoText: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 29,
    fontFamily: typography.bold
  },
  phoneButton: {
    width: "100%",
    maxWidth: 270,
    minHeight: 70,
    backgroundColor: colors.backgroundThird,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18
  },
  phoneButtonText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: typography.bold
  }
});
