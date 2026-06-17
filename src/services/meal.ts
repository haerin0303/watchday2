import { ApiError, apiRequest } from "@/services/api";

export type MealMenuItem = {
  id: string;
  name: string;
  allergyNumbers: string;
  warning: string;
};

export type MealData = {
  date: string;
  items: MealMenuItem[];
  existence: boolean;
  rest: boolean;
};

const NO_ALLERGY_INFO = "알레르기 정보 없음";

let cachedTodayMeal: MealData | null = null;

export function getCachedTodayMeal() {
  return cachedTodayMeal;
}

export function setCachedTodayMeal(meal: MealData) {
  cachedTodayMeal = meal;
}

export async function loadTodayMeal() {
  try {
    const response = await apiRequest<unknown>("/meal/today", { auth: false });
    const meal = parseMealResponse(response);

    setCachedTodayMeal(meal);
    return meal;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      const emptyMeal = createEmptyMeal();
      setCachedTodayMeal(emptyMeal);
      return emptyMeal;
    }

    throw error;
  }
}

export function parseMealResponse(payload: unknown): MealData {
  const data = unwrapPayload(payload);
  const meal = unwrapMeal(data);

  if (!meal || typeof meal !== "object") {
    return createEmptyMeal();
  }

  const value = meal as { date?: unknown; items?: unknown; existence?: unknown; rest?: unknown };
  const existence = value.existence !== false;
  const rest = value.rest === true;
  const items = Array.isArray(value.items) ? value.items.map(toMealMenuItem).filter((item) => item.name.length > 0) : [];

  return {
    date: formatMealDate(value.date),
    items: existence && !rest ? items : [],
    existence,
    rest
  };
}

function unwrapPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const value = payload as { ok?: boolean; success?: boolean; data?: unknown; result?: unknown };
  return value.data ?? value.result ?? payload;
}

function unwrapMeal(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const value = payload as { meal?: unknown };
  return value.meal ?? payload;
}

function createEmptyMeal(): MealData {
  return {
    date: formatMealDate(new Date()),
    items: [],
    existence: false,
    rest: true
  };
}

function toMealMenuItem(item: unknown, index: number): MealMenuItem {
  if (typeof item === "string") {
    return {
      id: `m${index + 1}`,
      name: item,
      allergyNumbers: NO_ALLERGY_INFO,
      warning: NO_ALLERGY_INFO
    };
  }

  if (!item || typeof item !== "object") {
    return {
      id: `m${index + 1}`,
      name: "",
      allergyNumbers: NO_ALLERGY_INFO,
      warning: NO_ALLERGY_INFO
    };
  }

  const value = item as { id?: unknown; upstream_id?: unknown; name?: unknown; allergy_code?: unknown };
  const name = typeof value.name === "string" ? value.name : "";
  const allergyCode = typeof value.allergy_code === "string" && value.allergy_code.trim().length > 0 ? value.allergy_code : NO_ALLERGY_INFO;

  return {
    id: String(value.id ?? value.upstream_id ?? `m${index + 1}`),
    name,
    allergyNumbers: allergyCode,
    warning: allergyCode
  };
}

function formatMealDate(date: unknown) {
  const dateText = typeof date === "string" ? date.trim() : "";
  const source = date instanceof Date ? date : dateText ? new Date(dateText.includes("T") ? dateText : `${dateText}T00:00:00`) : new Date();

  if (Number.isNaN(source.getTime())) {
    return String(date ?? "");
  }

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const month = source.getMonth() + 1;
  const day = source.getDate();

  return `${month}/${day}(${weekdays[source.getDay()]})`;
}
