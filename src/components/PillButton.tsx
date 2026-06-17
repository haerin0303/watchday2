import { ReactNode } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme/colors";

type PillButtonProps = {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  variant?: "primary" | "ghost";
};

export function PillButton({ label, icon, onPress, variant = "primary" }: PillButtonProps) {
  if (variant === "ghost") {
    return (
      <Pressable style={[styles.base, styles.ghost]} onPress={onPress} android_ripple={{ color: colors.backgroundFourth }}>
        <View style={styles.row}>
          {icon ? <View style={styles.iconBadgeGhost}>{icon}</View> : null}
          <Text style={styles.ghostLabel}>{label}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.pressable} onPress={onPress} android_ripple={{ color: colors.brandSecondary }}>
      <LinearGradient colors={[colors.brandPrimary, colors.brandPrimary, colors.brandSecondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.15 }} style={[styles.base, styles.primary]}>
        <View style={styles.row}>
          {icon ? <View style={styles.iconBadge}>{icon}</View> : null}
          <Text style={styles.primaryLabel}>{label}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 999,
    overflow: "hidden",
    alignSelf: "stretch"
  },
  base: {
    minHeight: 90,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderWidth: 1
  },
  primary: {
    borderColor: colors.borderPrimary
  },
  ghost: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.borderPrimary
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.brandSecondary,
    alignItems: "center",
    justifyContent: "center"
  },
  iconBadgeGhost: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundThird,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 17,
    fontFamily: typography.bold,
    letterSpacing: 0.1
  },
  ghostLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: typography.bold
  }
});
