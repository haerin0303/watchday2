import { colors } from "@/theme/colors";

const SUBJECT_COLORS: Record<string, string> = {
  국어: colors.calendarTomato,
  영어: colors.calendarSaige,
  수학: colors.calendarConflower,
  과학: colors.calendarOrange,
  자료구조: colors.calendarConflower,
  서버구축및운영: colors.calendarBasil
};

export const DEFAULT_SUBJECT_COLOR = colors.brandPrimary;

export function getSubjectColor(subject?: string | null) {
  if (!subject) {
    return DEFAULT_SUBJECT_COLOR;
  }

  return SUBJECT_COLORS[subject.replace(/\s/g, "")] ?? SUBJECT_COLORS[subject] ?? DEFAULT_SUBJECT_COLOR;
}
