import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/Logo";
import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { colors, typography } from "@/theme/colors";

export default function LoginScreen() {
  const { error, loading, login } = useAuth();

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Logo large />
          <Text style={styles.subtitle}>선린 계정으로 시작하기</Text>
        </View>

        <View style={styles.panel}>
          <Pressable
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed, loading && styles.disabled]}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <>
                <Ionicons name="logo-google" size={18} color={colors.black} />
                <Text style={styles.googleButtonText}>Google 로그인</Text>
              </>
            )}
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : <Text style={styles.hintText}>@sunrin.hs.kr 계정만 사용할 수 있습니다.</Text>}
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    paddingTop: 44,
    paddingBottom: 32
  },
  header: {
    alignItems: "center",
    gap: 10
  },
  subtitle: {
    color: colors.soft,
    fontSize: 13,
    fontFamily: typography.medium
  },
  panel: {
    gap: 14
  },
  googleButton: {
    minHeight: 58,
    borderRadius: 999,
    backgroundColor: colors.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18
  },
  pressed: {
    opacity: 0.82
  },
  disabled: {
    opacity: 0.7
  },
  googleButtonText: {
    color: colors.black,
    fontSize: 15,
    fontFamily: typography.bold
  },
  errorText: {
    color: "#FF9D9D",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    fontFamily: typography.medium
  },
  hintText: {
    color: colors.soft,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    fontFamily: typography.medium
  }
});
