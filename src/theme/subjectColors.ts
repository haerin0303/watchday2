const SUBJECT_COLORS: Record<string, string> = {
  국어: "#FF7A7A",
  영어: "#66D196",
  수학: "#6EC1FF",
  과학: "#FF7A7A",
  자료구조: "#6EC1FF",
  서버구축및운영: "#66D196"
};

export const DEFAULT_SUBJECT_COLOR = "#C4C4C4";

export function getSubjectColor(subject?: string | null) {
  if (!subject) {
    return DEFAULT_SUBJECT_COLOR;
  }

  return SUBJECT_COLORS[subject.replace(/\s/g, "")] ?? SUBJECT_COLORS[subject] ?? DEFAULT_SUBJECT_COLOR;
}
