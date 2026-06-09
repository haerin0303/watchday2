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
  const { width } = useWindowDimensions();
  const isWatchPreview = width >= 380;
  const frameWidth = isWatchPreview ? Math.min(450, width) : width;
  const frameRadius = isWatchPreview ? frameWidth / 2 : 0;

  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={[styles.frame, { width: frameWidth, borderRadius: frameRadius }]}>
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
      <View style={[styles.frame, { width: frameWidth, borderRadius: frameRadius }]}>
        <View style={[styles.container, contentStyle]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
  },
  frame: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: colors.black,
    overflow: "hidden"
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 24
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 24
  }
});
