import { apiRequest } from "@/services/api";

export type TodoItem = {
  id: string;
  title: string;
  description: string;
  subject: string;
  due: string;
  period: string;
  eventType: string;
  startAt: string;
  endAt: string;
  done: boolean;
};

const TODO_EVENT_TYPES = new Set(["assignment", "performance_eval", "written_exam", "academic_eval", "school_event", "contest"]);
const DEFAULT_SUBJECT = "기타";

let cachedTodoItems: TodoItem[] = [];

export function getCachedTodoItems() {
  return cachedTodoItems;
}

export function setCachedTodoItems(items: TodoItem[]) {
  cachedTodoItems = items;
}

export async function loadTodoItems() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setDate(to.getDate() + 7);
  to.setHours(23, 59, 59, 999);

  const response = await apiRequest<unknown>(
    `/calendar/me?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`
  );
  const items = extractEvents(response)
    .map(toTodoItem)
    .filter((item): item is TodoItem => Boolean(item))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  setCachedTodoItems(items);
  return items;
}

function unwrapPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const value = payload as { ok?: boolean; success?: boolean; data?: unknown; result?: unknown; items?: unknown };
  return value.data ?? value.result ?? value.items ?? payload;
}

function extractEvents(payload: unknown) {
  const data = unwrapPayload(payload);

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const value = data as { events?: unknown; items?: unknown };

    if (Array.isArray(value.events)) {
      return value.events;
    }

    if (Array.isArray(value.items)) {
      return value.items;
    }
  }

  return [];
}

function toTodoItem(event: unknown, index: number): TodoItem | null {
  if (!event || typeof event !== "object") {
    return null;
  }

  const value = event as Record<string, unknown>;
  const eventType = getString(value.event_type);

  if (!TODO_EVENT_TYPES.has(eventType)) {
    return null;
  }

  const title = getString(value.title) || "제목 없음";
  const description = getString(value.description);
  const startAt = getString(value.start_at);
  const endAt = getString(value.end_at);
  const periodValue = getPeriod(value.timetable_period);
  const subject = getSubject(value, title);

  return {
    id: getId(value._id ?? value.id, index),
    title,
    description,
    subject,
    due: formatDateRange(startAt, endAt),
    period: periodValue,
    eventType,
    startAt,
    endAt,
    done: false
  };
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getId(value: unknown, index: number) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const objectId = value as { $oid?: unknown; oid?: unknown };
    const id = objectId.$oid ?? objectId.oid;

    if (typeof id === "string") {
      return id;
    }
  }

  return `todo-${index + 1}`;
}

function getSubject(value: Record<string, unknown>, title: string) {
  const subject =
    getString(value.subject) ||
    getString(value.subject_name) ||
    getString(value.subject_short) ||
    getString(value.subject_long) ||
    getString(value.course) ||
    getString(value.class_name) ||
    extractSubjectFromTitle(title);

  return subject || DEFAULT_SUBJECT;
}

function extractSubjectFromTitle(title: string) {
  const bracketMatch = title.match(/^\s*\[([^\]]+)\]/);

  if (bracketMatch) {
    return bracketMatch[1].trim();
  }

  const separatorMatch = title.match(/^([^:-]{2,20})\s*[:\-]/);
  return separatorMatch ? separatorMatch[1].trim() : "";
}

function getPeriod(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}교시`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.endsWith("교시") ? value : `${value}교시`;
  }

  return "";
}

function formatDateRange(startAt: string, endAt: string) {
  const start = formatDateTime(startAt);
  const end = formatDateTime(endAt);

  if (start && end && start !== end) {
    return `${start} ~ ${end}`;
  }

  return start || end || "";
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");

  return `${month}.${day} ${hour}:${minute}`;
}
