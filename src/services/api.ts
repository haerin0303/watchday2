export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "https://dailysunrin.e3e.app/api";

let currentAccessToken: string | null = null;

type RequestOptions = RequestInit & {
  auth?: boolean;
};

type ErrorPayload = {
  message?: unknown;
  error?: unknown;
};

export class ApiError extends Error {
  status: number;
  retryAfterSeconds: number | null;

  constructor(message: string, status: number, retryAfterSeconds: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function getNestedMessage(error: unknown) {
  if (!error || typeof error === "string" || typeof error !== "object") {
    return null;
  }

  const payload = error as ErrorPayload;
  return typeof payload.message === "string" ? payload.message : null;
}

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
}

export function getAccessToken() {
  return currentAccessToken;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...requestOptions } = options;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;
  const requestHeaders = new Headers(headers);

  if (requestOptions.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth && currentAccessToken) {
    requestHeaders.set("Authorization", `Bearer ${currentAccessToken}`);
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers: requestHeaders
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    console.log("[api] request failed:", response.status, normalizedPath, typeof data === "string" ? data : JSON.stringify(data));

    const payload = data as ErrorPayload;
    const nestedMessage = getNestedMessage(payload?.error);
    const retryAfterHeader = response.headers.get("Retry-After");
    const retryAfterSeconds = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : null;
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : typeof payload?.error === "string"
          ? payload.error
          : nestedMessage
            ? nestedMessage
            : typeof data === "string" && data.trim().length > 0
              ? data
              : `API request failed (${response.status})`;
    throw new ApiError(message, response.status, Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : null);
  }

  return data as T;
}
