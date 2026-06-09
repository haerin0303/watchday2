import { useMemo, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Animated, NativeScrollEvent, NativeSyntheticEvent, Platform, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { classPeriods } from "@/data/mock";
import { colors, typography } from "@/theme/colors";

export default function ClassScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 44, 344);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const current = useMemo(() => classPeriods[activeIndex] ?? classPeriods[0], [activeIndex]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, classPeriods.length - 1)));
  };

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.header}>
          <Text style={styles.title}>시간표</Text>
          <Text style={styles.timeLabel}>{current.time}</Text>
        </View>

        <Animated.FlatList
          data={classPeriods}
          horizontal
          pagingEnabled
          snapToInterval={cardWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: (width - cardWidth) / 2, alignItems: "center" }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: Platform.OS !== "web"
          })}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumEnd}
          renderItem={({ item, index }) => {
            const inputRange = [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth];
            const scale = scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: "clamp" });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.55, 1, 0.55], extrapolate: "clamp" });

            return (
              <Animated.View style={[styles.cardWrap, { width: cardWidth, opacity, transform: [{ scale }] }]}>
                <View style={styles.cardCenter}>
                  <Text style={styles.period}>{item.period}</Text>
                  <Text style={styles.subject}>{item.subject}</Text>
                  <Text style={styles.room}>{item.room}</Text>
                </View>
              </Animated.View>
            );
          }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{activeIndex + 1}교시 / 좌우 스와이프</Text>
          <View style={styles.pageDots}>
            {classPeriods.map((period, index) => (
              <View key={period.id} style={[styles.dot, index === activeIndex && styles.dotActive]} />
            ))}
          </View>
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "space-between"
  },
  header: {
    alignItems: "center",
    gap: 6
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.medium,
    letterSpacing: 0.6
  },
  timeLabel: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: typography.medium,
    marginTop: 4
  },
  cardWrap: {
    paddingHorizontal: 4,
    paddingTop: 8
  },
  cardCenter: {
    backgroundColor: "transparent",
    minHeight: 260,
    justifyContent: "center",
    alignItems: "center"
  },
  period: {
    color: colors.orange,
    fontSize: 12,
    fontFamily: typography.medium,
    marginBottom: 8
  },
  subject: {
    color: colors.orange,
    fontSize: 48,
    lineHeight: 56,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  room: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    fontFamily: typography.medium
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18
  },
  metaText: {
    color: colors.soft,
    fontSize: 12,
    fontFamily: typography.medium
  },
  footer: {
    alignItems: "center",
    gap: 10
  },
  footerText: {
    color: colors.soft,
    fontSize: 11,
    fontFamily: typography.medium,
    letterSpacing: 0.5
  },
  pageDots: {
    flexDirection: "row",
    gap: 6
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderSoft
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.gold
  }
});
