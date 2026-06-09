export const classPeriods = [
  { id: "1", period: "1교시", subject: "국어", room: "404실", time: "08:40 ~ 09:30", teacher: "김선생" },
  { id: "2", period: "2교시", subject: "영어", room: "405실", time: "09:40 ~ 10:30", teacher: "이선생" },
  { id: "3", period: "3교시", subject: "수학", room: "302실", time: "10:40 ~ 11:30", teacher: "박선생" },
  { id: "4", period: "4교시", subject: "과학", room: "실험실", time: "11:40 ~ 12:30", teacher: "최선생" }
];

export const todayMeal = {
  date: "2026.06.09 (화)",
  items: [
    { id: "m1", name: "현미밥", allergyNumbers: "해당 없음", warning: "기본 식단입니다." },
    { id: "m2", name: "미역국", allergyNumbers: "5, 6", warning: "해조류 및 조미 원재료를 확인하세요." },
    { id: "m3", name: "닭다리구이", allergyNumbers: "1, 2, 5, 6, 15", warning: "양념류에 알레르기 유발 성분이 포함될 수 있습니다." },
    { id: "m4", name: "시저샐러드", allergyNumbers: "1, 2, 3, 5, 6", warning: "드레싱 성분을 확인하세요." },
    { id: "m5", name: "배추김치", allergyNumbers: "9", warning: "젓갈 성분이 포함될 수 있습니다." }
  ]
};

export const todoItems = [
  {
    id: "t1",
    title: "수학 숙제 제출",
    description: "수학 문제집 35페이지까지 풀고 제출하기.",
    due: "2026-06-10",
    status: "진행 중",
    done: false
  },
  {
    id: "t2",
    title: "영어 단어 암기",
    description: "이번 주 단어 40개 복습 후 테스트 준비.",
    due: "2026-06-09",
    status: "진행 중",
    done: false
  },
  {
    id: "t3",
    title: "과학 보고서 정리",
    description: "실험 결과 사진과 결론을 한 페이지로 정리.",
    due: "2026-06-12",
    status: "대기",
    done: false
  },
  {
    id: "t4",
    title: "가방 챙기기",
    description: "교과서, 충전기, 체육복 확인.",
    due: "2026-06-09",
    status: "완료",
    done: true
  }
];
