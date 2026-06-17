import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { API_BASE_URL, apiRequest, getAccessToken, setAccessToken } from "@/services/api";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = Platform.OS === "web" ? "dailysunrin://auth/callback" : Linking.createURL("auth/callback");
const SESSION_KEY = "watchday.session";
const SUNRIN_EMAIL_SUFFIXES = ["@sunrin.hs.kr", "@sunrint.hs.kr"];

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
};

export type UserProfile = {
  id?: string | number;
  email?: string;
  name?: string;
  display_name?: string;
  role?: string;
  gcal_connected?: boolean;
  [key: string]: unknown;
};

let memorySession: AuthTokens | null = null;

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function unwrapPayload<T>(payload: T | { data?: T; user?: T; result?: T }): T {
  const value = payload as { data?: T; user?: T; result?: T };
  return value.data ?? value.user ?? value.result ?? (payload as T);
}

function normalizeTokens(payload: unknown): AuthTokens {
  const tokens = unwrapPayload(payload as AuthTokens | { tokens?: AuthTokens });
  const maybeWrappedTokens = (tokens as { tokens?: AuthTokens }).tokens ?? tokens;
  const value = maybeWrappedTokens as Partial<AuthTokens>;

  if (!value.access_token || !value.refresh_token || typeof value.expires_in !== "number") {
    throw new Error("토큰 응답 형식이 올바르지 않습니다.");
  }

  return {
    access_token: value.access_token,
    refresh_token: value.refresh_token,
    expires_in: value.expires_in,
    expires_at: value.expires_at ?? Date.now() + value.expires_in * 1000
  };
}

function normalizeUser(payload: unknown): UserProfile {
  return unwrapPayload(payload as UserProfile);
}

async function isSecureStoreAvailable() {
  try {
    return Platform.OS !== "web" && (await SecureStore.isAvailableAsync());
  } catch {
    return false;
  }
}

function getWebStorage() {
  const maybeGlobal = globalThis as typeof globalThis & { localStorage?: WebStorage };
  return maybeGlobal.localStorage ?? null;
}

async function readStoredSession() {
  if (await isSecureStoreAvailable()) {
    console.log("[auth] Loading session from SecureStore");
    return SecureStore.getItemAsync(SESSION_KEY);
  }

  const storage = getWebStorage();

  if (storage) {
    console.log("[auth] Loading session from localStorage fallback");
    return storage.getItem(SESSION_KEY);
  }

  console.log("[auth] Persistent storage unavailable, using memory session only");
  return memorySession ? JSON.stringify(memorySession) : null;
}

async function writeStoredSession(tokens: AuthTokens) {
  const serialized = JSON.stringify(tokens);

  if (await isSecureStoreAvailable()) {
    console.log("[auth] Saving session to SecureStore");
    await SecureStore.setItemAsync(SESSION_KEY, serialized);
    return;
  }

  const storage = getWebStorage();

  if (storage) {
    console.log("[auth] Saving session to localStorage fallback");
    storage.setItem(SESSION_KEY, serialized);
    return;
  }

  console.log("[auth] Persistent storage unavailable, session kept in memory");
}

async function removeStoredSession() {
  if (await isSecureStoreAvailable()) {
    console.log("[auth] Deleting session from SecureStore");
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }

  const storage = getWebStorage();

  if (storage) {
    console.log("[auth] Deleting session from localStorage fallback");
    storage.removeItem(SESSION_KEY);
  }
}

export function getLoginCodeFromUrl(url: string) {
  const parsed = Linking.parse(url);
  const rawCode = parsed.queryParams?.login_code;
  const loginCode = Array.isArray(rawCode) ? rawCode[0] : rawCode;
  const hasLoginCode = typeof loginCode === "string" && loginCode.length > 0;

  console.log("[auth] Received deep link:", url);
  console.log("[auth] Parsed login_code:", hasLoginCode ? "[present]" : "[missing]");

  return hasLoginCode ? loginCode : null;
}

export async function startGoogleLogin() {
  const authUrl = `${API_BASE_URL}/auth/google?platform=mobile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  console.log("[auth] OAuth start URL:", authUrl);

  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
  console.log("[auth] OAuth browser result:", result.type);

  if (result.type === "success") {
    console.log("[auth] OAuth callback URL:", result.url);
    return result.url;
  }

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new Error("로그인 창을 닫았습니다.");
  }

  throw new Error("Google 로그인 결과를 확인할 수 없습니다.");
}

export async function exchangeLoginCode(login_code: string) {
  try {
    console.log("[auth] Exchanging login_code...");
    const response = await apiRequest<unknown>("/auth/mobile/exchange", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ login_code })
    });
    const tokens = normalizeTokens(response);

    console.log("[auth] exchange success");

    return tokens;
  } catch (error) {
    console.log("[auth] exchange failed:", error);
    throw error;
  }
}

export async function saveSession(tokens: AuthTokens) {
  memorySession = tokens;
  setAccessToken(tokens.access_token);
  await writeStoredSession(tokens);
}

export async function loadSession() {
  const rawSession = await readStoredSession();

  if (!rawSession) {
    setAccessToken(null);
    console.log("[auth] Stored session not found");
    return null;
  }

  const tokens = normalizeTokens(JSON.parse(rawSession));
  memorySession = tokens;
  setAccessToken(tokens.access_token);

  return tokens;
}

export async function refreshSession(refresh_token: string) {
  try {
    const response = await apiRequest<unknown>("/auth/refresh", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ refresh_token })
    });
    const tokens = normalizeTokens(response);

    console.log("[auth] refresh success");

    return tokens;
  } catch (error) {
    console.log("[auth] refresh failed:", error);
    throw error;
  }
}

export async function clearLocalSession() {
  memorySession = null;
  setAccessToken(null);
  await removeStoredSession();
}

export async function logout() {
  try {
    if (getAccessToken()) {
      await apiRequest<null>("/auth/logout", {
        method: "POST"
      });
      console.log("[auth] logout success");
    }
  } catch (error) {
    console.log("[auth] logout failed:", error);
  } finally {
    await clearLocalSession();
  }
}

export async function getMe() {
  try {
    const user = normalizeUser(await apiRequest<unknown>("/users/me"));

    if (!user.email || !SUNRIN_EMAIL_SUFFIXES.some((suffix) => user.email?.endsWith(suffix))) {
      await clearLocalSession();
      throw new Error("선린인터넷고 이메일 계정으로만 로그인할 수 있습니다.");
    }

    console.log("[auth] /users/me success:", user.email);

    return user;
  } catch (error) {
    console.log("[auth] /users/me failed:", error);
    throw error;
  }
}
