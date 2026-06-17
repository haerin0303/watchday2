export const colors = {
  backgroundPrimary: "#131211",
  backgroundSecondary: "#181715",
  backgroundThird: "#211F1D",
  backgroundFourth: "#292624",
  textPrimary: "#F0F0EF",
  textSecondary: "#8F8984",
  borderPrimary: "#2B2927",
  brandPrimary: "#FF9933",
  brandSecondary: "#C5782B",
  brandThird: "#8B5824",

  calendarTomato: "#DE573D",
  calendarOrange: "#E26B43",
  calendarBanana: "#E6BA57",
  calendarBasil: "#4E9364",
  calendarSaige: "#58AF80",
  calendarConflower: "#5399CF",
  calendarBlueberry: "#7578C4",
  calendarRabender: "#848CC1",
  calendarGrape: "#AA62BB",
  calendarCitrus: "#D4847B",
  calendarCoal: "#808080",

  black: "#131211",
  white: "#F0F0EF",
  gold: "#FF9933",
  goldSoft: "#292624",
  orange: "#FF9933",
  surface: "#181715",
  surfaceElevated: "#211F1D",
  border: "#2B2927",
  borderSoft: "#2B2927",
  muted: "#F0F0EF",
  soft: "#8F8984"
} as const;

export const calendarEventColors = {
  written_exam: colors.calendarTomato,
  academic_eval: colors.calendarOrange,
  performance_eval: colors.calendarBanana,
  assignment: colors.calendarBasil,
  contest: colors.calendarGrape,
  school_event: colors.calendarConflower,
  field_trip: colors.calendarSaige,
  counseling: colors.calendarCitrus,
  notice: colors.calendarBlueberry,
  other: colors.calendarCoal
} as const;

export const typography = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  bold: "Pretendard-Bold"
} as const;
