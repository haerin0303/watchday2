import { ReactNode, useEffect, useRef } from "react";

import { Animated, Platform, StyleSheet } from "react-native";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: Platform.OS !== "web"
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: Platform.OS !== "web"
      })
    ]).start();
  }, [opacity, translateY]);

  return <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
