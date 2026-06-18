import { ReactNode } from "react";

import { ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = false, contentStyle }: ScreenProps) {
  const { width, height } = useWindowDimensions();
  const frameSize = Math.min(width, height, 396);
  const frameRadius = frameSize / 2;

  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={[styles.frame, { width: frameSize, height: frameSize, borderRadius: frameRadius }]}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentStyle]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={[styles.frame, { width: frameSize, height: frameSize, borderRadius: frameRadius }]}>
        <View style={[styles.container, contentStyle]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center"
  },
  frame: {
    alignSelf: "center",
    backgroundColor: colors.black,
    overflow: "hidden"
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 42
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 42
  }
});
