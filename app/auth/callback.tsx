import { useEffect } from "react";

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { colors, typography } from "@/theme/colors";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ login_code?: string | string[] }>();
  const { completeLoginWithCode, error } = useAuth();
  const rawLoginCode = params.login_code;
  const loginCode = Array.isArray(rawLoginCode) ? rawLoginCode[0] : rawLoginCode;

  useEffect(() => {
    console.log("[auth] Callback route login_code:", loginCode ? "[present]" : "[missing]");

    if (loginCode) {
      completeLoginWithCode(loginCode);
    }
  }, [completeLoginWithCode, loginCode]);

  return (
    <Screen>
      <View style={styles.container}>
        {!loginCode ? (
          <>
            <Text style={styles.errorText}>로그인 코드가 없습니다.</Text>
            <Pressable style={styles.button} onPress={() => router.replace("/login")}>
              <Text style={styles.buttonText}>다시 로그인</Text>
            </Pressable>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.button} onPress={() => router.replace("/login")}>
              <Text style={styles.buttonText}>다시 로그인</Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator color={colors.gold} />
            <Text style={styles.text}>로그인 처리 중</Text>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  text: {
    color: colors.soft,
    fontSize: 13,
    fontFamily: typography.medium
  },
  errorText: {
    color: colors.calendarTomato,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: typography.medium
  },
  button: {
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  buttonText: {
    color: colors.black,
    fontSize: 13,
    fontFamily: typography.bold
  }
});
