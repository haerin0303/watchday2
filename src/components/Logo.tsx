import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme/colors";

type LogoProps = {
  large?: boolean;
  small?: boolean;
};

export function Logo({ large = false, small = false }: LogoProps) {
  return (
    <View style={[styles.container, large && styles.large, small && styles.small]}>
      <Text style={[styles.wordMark, large && styles.largeText, small && styles.smallText]}>Watch</Text>
      <Text style={[styles.accent, large && styles.largeText, small && styles.smallText]}>Day</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline"
  },
  large: {
    gap: 4
  },
  small: {
    gap: 3
  },
  wordMark: {
    color: colors.white,
    fontFamily: typography.bold,
    letterSpacing: 0.8
  },
  accent: {
    color: colors.gold,
    fontFamily: typography.bold,
    letterSpacing: 0.8
  },
  largeText: {
    fontSize: 34,
    lineHeight: 38
  },
  smallText: {
    fontSize: 22,
    lineHeight: 26
  }
});
