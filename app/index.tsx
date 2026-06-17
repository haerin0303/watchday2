import { useEffect } from "react";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/Logo";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { colors, typography } from "@/theme/colors";

export default function SplashScreen() {
  const { initializing, user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initializing) {
        router.replace(user ? "/home" : "/login");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [initializing, user]);

  return (
    <Screen>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Logo large />
        <Text style={styles.subtitle}>학교 생활을 한눈에</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  subtitle: {
    marginTop: 14,
    color: colors.soft,
    fontSize: 14,
    fontFamily: typography.medium,
    letterSpacing: 0.8
  }
});
