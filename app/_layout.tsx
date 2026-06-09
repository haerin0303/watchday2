import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.black },
          animation: "fade_from_bottom"
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="class/index" />
        <Stack.Screen name="meal/index" />
        <Stack.Screen name="meal/allergy/[mealId]" />
        <Stack.Screen name="todo/index" />
        <Stack.Screen name="todo/[id]" />
        <Stack.Screen name="settings/index" />
      </Stack>
    </SafeAreaProvider>
  );
}
