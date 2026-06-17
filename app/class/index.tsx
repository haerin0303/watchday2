import { useEffect, useMemo, useRef, useState } from "react";

import { PanResponder, StyleSheet, Text, View } from "react-native";

import { PageTransition } from "@/components/PageTransition";
import { Screen } from "@/components/Screen";
import { apiRequest } from "@/services/api";
import { usePhoneViewTarget } from "@/services/phoneView";
import { colors, typography } from "@/theme/colors";

type TimetablePeriod = {
  period: number | string;
  subject_short?: string;
  subject_long?: string;
  start?: string;
  end?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  classroom?: string;
  location?: string;
  lab?: string;
  kind?: string;
};

type DisplayPeriod = {
  order: number;
  period: string;
  subject: string;
  room: string;
  time: string;
  start: string;
  end: string;
};

const EMPTY_PERIOD: DisplayPeriod = {
  order: 0,
  period: "-",
  subject: "오늘 시간표가 없어요",
  room: "",
  time: "-",
  start: "",
  end: ""
};

function unwrapPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const value = payload as { ok?: boolean; success?: boolean; data?: unknown; result?: unknown };
  return value.data ?? value.result ?? payload;
}

function getTodayKey() {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const date = `${today.getDate()}`.padStart(2, "0");

  return `${today.getFullYear()}-${month}-${date}`;
}

function asPeriod(value: unknown): TimetablePeriod | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const period = value as TimetablePeriod;

  if (period.kind && period.kind !== "period") {
    return null;
  }

  const periodNumber = getPeriodNumber(period.period);

  return periodNumber === null ? null : { ...period, period: periodNumber };
}

function extractPeriods(payload: unknown) {
  const data = unwrapPayload(payload);
  const directPeriods = Array.isArray(data) ? toDisplayPeriods(data) : [];

  if (directPeriods.length > 0) {
    return directPeriods;
  }

  const days = Array.isArray(data) ? data : [data];
  const todayKey = getTodayKey();
  const today =
    days.find((day) => {
      if (!day || typeof day !== "object") {
        return false;
      }

      return String((day as { date?: unknown }).date ?? "").startsWith(todayKey);
    }) ?? days[0];

  if (!today || typeof today !== "object") {
    return [];
  }

  const day = today as { slots?: unknown[]; periods?: unknown[] };
  const source = Array.isArray(day.slots) ? day.slots : Array.isArray(day.periods) ? day.periods : [];

  return toDisplayPeriods(source);
}

function toDisplayPeriods(source: unknown[]) {
  const periods = source
    .map(asPeriod)
    .filter((period): period is TimetablePeriod => Boolean(period))
    .map(toDisplayPeriod)
    .filter((period) => period.subject.length > 0)
    .sort((a, b) => a.order - b.order);

  return Array.from(new Map(periods.map((period) => [period.order, period])).values());
}

function getPeriodNumber(period: unknown) {
  if (typeof period === "number" && Number.isFinite(period)) {
    return period;
  }

  if (typeof period === "string") {
    const parsed = Number.parseInt(period, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toDisplayPeriod(period: TimetablePeriod): DisplayPeriod {
  const periodNumber = getPeriodNumber(period.period) ?? 0;
  const subject = period.subject_short || period.subject_long || "과목 정보 없음";
  const start = period.start ?? period.start_time ?? "";
  const end = period.end ?? period.end_time ?? "";
  const room = period.room ?? period.classroom ?? period.location ?? period.lab ?? "";

  return {
    order: periodNumber,
    period: `${periodNumber}교시`,
    subject,
    room,
    time: start && end ? `${formatClockTime(start)} ~ ${formatClockTime(end)}` : "-",
    start,
    end
  };
}

function formatClockTime(time: string) {
  const match = time.match(/(\d{1,2}):(\d{2})/);

  if (!match) {
    return time;
  }

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map((part) => Number.parseInt(part, 10));
  return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : null;
}

function getInitialPeriodIndex(periods: DisplayPeriod[]) {
  if (periods.length === 0) {
    return 0;
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const ranges = periods.map((period) => ({
    start: toMinutes(period.start),
    end: toMinutes(period.end)
  }));

  const currentIndex = ranges.findIndex(({ start, end }) => start !== null && end !== null && nowMinutes >= start && nowMinutes < end);

  if (currentIndex >= 0) {
    return currentIndex;
  }

  const nextIndex = ranges.findIndex(({ start }) => start !== null && nowMinutes < start);

  return nextIndex >= 0 ? nextIndex : periods.length - 1;
}

function clampIndex(index: number, count: number) {
  if (count <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), count - 1);
}

function isHorizontalSwipe(dx: number, dy: number) {
  return Math.abs(dx) > 18 && Math.abs(dx) > Math.abs(dy);
}

export default function ClassScreen() {
  usePhoneViewTarget("timetable");

  const [periods, setPeriods] = useState<DisplayPeriod[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "empty">("loading");
  const periodCount = useRef(0);
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    periodCount.current = periods.length;
  }, [periods.length]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    let active = true;

    async function loadTimetable() {
      try {
        setStatus("loading");
        const response = await apiRequest<unknown>("/timetable/me");
        const nextPeriods = extractPeriods(response);

        if (!active) {
          return;
        }

        if (nextPeriods.length === 0) {
          setPeriods([]);
          setSelectedIndex(0);
          selectedIndexRef.current = 0;
          setStatus("empty");
          return;
        }

        const initialIndex = getInitialPeriodIndex(nextPeriods);
        setPeriods(nextPeriods);
        setSelectedIndex(initialIndex);
        selectedIndexRef.current = initialIndex;
        setStatus("ready");
      } catch (error) {
        console.log("[timetable] load failed:", error);

        if (active) {
          setPeriods([]);
          setSelectedIndex(0);
          selectedIndexRef.current = 0;
          setStatus("error");
        }
      }
    }

    loadTimetable();

    return () => {
      active = false;
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => isHorizontalSwipe(gestureState.dx, gestureState.dy),
      onMoveShouldSetPanResponderCapture: (_, gestureState) => isHorizontalSwipe(gestureState.dx, gestureState.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) < 28) {
          return;
        }

        const count = periodCount.current;

        if (count <= 1) {
          const nextIndex = clampIndex(selectedIndexRef.current, count);
          selectedIndexRef.current = nextIndex;
          setSelectedIndex(nextIndex);
          return;
        }

        const direction = gestureState.dx < 0 ? 1 : -1;
        const nextIndex = clampIndex(selectedIndexRef.current + direction, count);

        selectedIndexRef.current = nextIndex;
        setSelectedIndex(nextIndex);
      }
    })
  ).current;

  const current = useMemo(() => {
    if (status === "loading") {
      return { ...EMPTY_PERIOD, subject: "불러오는 중" };
    }

    if (status === "error") {
      return { ...EMPTY_PERIOD, subject: "시간표를 불러오지 못했어요" };
    }

    if (status === "empty") {
      return EMPTY_PERIOD;
    }

    return periods[selectedIndex] ?? EMPTY_PERIOD;
  }, [periods, selectedIndex, status]);

  return (
    <Screen contentStyle={styles.screen}>
      <PageTransition>
        <View style={styles.content} {...panResponder.panHandlers}>
          <View style={styles.centerBlock}>
            <View style={styles.headerInline}>
              <Text style={styles.title}>시간표</Text>
              <Text style={styles.timeLabel}>{current.time}</Text>
            </View>

            <Text style={styles.period}>{current.period}</Text>
            <Text style={styles.subject}>{current.subject}</Text>
            {current.room ? <Text style={styles.room}>{current.room}</Text> : null}
          </View>
        </View>
      </PageTransition>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: "center"
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
    gap: 8
  },
  headerInline: {
    alignItems: "center",
    gap: 6,
    marginBottom: 18
  },
  title: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: typography.bold,
    letterSpacing: 0.2
  },
  timeLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: typography.medium,
    letterSpacing: 0.1
  },
  centerBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -8 }]
  },
  period: {
    color: colors.brandPrimary,
    fontSize: 13,
    fontFamily: typography.medium,
    marginBottom: 10,
    letterSpacing: 0.1
  },
  subject: {
    color: colors.brandPrimary,
    fontSize: 52,
    lineHeight: 60,
    fontFamily: typography.bold,
    textAlign: "center"
  },
  room: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 10,
    fontFamily: typography.medium
  }
});
