import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import * as Linking from "expo-linking";
import { router } from "expo-router";

import { ApiError } from "@/services/api";
import {
  clearLocalSession,
  exchangeLoginCode,
  getLoginCodeFromUrl,
  getMe,
  loadSession,
  logout as clearSession,
  refreshSession,
  saveSession,
  startGoogleLogin,
  UserProfile
} from "@/services/auth";

type AuthContextValue = {
  user: UserProfile | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  completeLoginWithCode: (loginCode: string) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "인증 중 오류가 발생했습니다.";
}

function getRateLimitRetrySeconds(error: unknown) {
  if (error instanceof ApiError && error.status === 429) {
    return error.retryAfterSeconds ?? 60;
  }

  const message = getErrorMessage(error);
  const match = message.match(/retry\s+in\s+(\d+)s/i);

  return match ? Number.parseInt(match[1], 10) : null;
}

function withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = 5000) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);
  const handledUrls = useRef(new Set<string>());
  const handledCodes = useRef(new Set<string>());

  const isRateLimited = useCallback(() => {
    if (!rateLimitedUntil) {
      return false;
    }

    if (Date.now() < rateLimitedUntil) {
      const seconds = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
      setError(`요청이 너무 많습니다. ${seconds}초 뒤 다시 시도해주세요.`);
      return true;
    }

    setRateLimitedUntil(null);
    return false;
  }, [rateLimitedUntil]);

  const completeLoginWithCode = useCallback(async (loginCode: string) => {
    if (isRateLimited()) {
      return;
    }

    if (handledCodes.current.has(loginCode)) {
      console.log("[auth] login_code already handled, skipping");
      return;
    }

    handledCodes.current.add(loginCode);
    setLoading(true);

    try {
      console.log("[auth] Exchanging login_code from callback route...");
      const tokens = await withTimeout(exchangeLoginCode(loginCode), "로그인 코드 교환 시간이 초과되었습니다.", 10000);
      await saveSession(tokens);

      const me = await withTimeout(getMe(), "사용자 정보 확인 시간이 초과되었습니다.", 10000);
      setUser(me);
      setError(null);
      console.log("[auth] Login complete, navigating home");
      router.replace("/home");
    } catch (callbackError) {
      console.log("[auth] callback route login failed:", callbackError);
      await clearLocalSession();
      const retrySeconds = getRateLimitRetrySeconds(callbackError);

      if (retrySeconds) {
        setRateLimitedUntil(Date.now() + retrySeconds * 1000);
        setError(`요청이 너무 많습니다. ${retrySeconds}초 뒤 다시 시도해주세요.`);
        return;
      }

      setUser(null);
      setError(getErrorMessage(callbackError));
    } finally {
      setLoading(false);
    }
  }, [isRateLimited]);

  const completeLoginFromUrl = useCallback(async (url: string) => {
    if (handledUrls.current.has(url)) {
      console.log("[auth] Deep link already handled, skipping:", url);
      return;
    }

    handledUrls.current.add(url);

    const loginCode = getLoginCodeFromUrl(url);

    if (!loginCode) {
      throw new Error("로그인 코드가 없습니다.");
    }

    await completeLoginWithCode(loginCode);
  }, [completeLoginWithCode]);

  const restoreSession = useCallback(async () => {
    const tokens = await loadSession();

    if (!tokens) {
      setUser(null);
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch (sessionError) {
      console.log("[auth] stored access token failed, trying refresh:", sessionError);
      const refreshedTokens = await refreshSession(tokens.refresh_token);
      await saveSession(refreshedTokens);

      const me = await getMe();
      setUser(me);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const initialUrl = await withTimeout(Linking.getInitialURL(), "초기 딥링크 확인 시간이 초과되었습니다.");
        console.log("[auth] Initial deep link:", initialUrl ?? "[none]");

        if (initialUrl?.includes("login_code=")) {
          await withTimeout(completeLoginFromUrl(initialUrl), "로그인 처리 시간이 초과되었습니다.", 10000);
        } else {
          await withTimeout(restoreSession(), "세션 복원 시간이 초과되었습니다.");
        }
      } catch (bootstrapError) {
        console.log("[auth] bootstrap failed:", bootstrapError);
        try {
          await withTimeout(clearLocalSession(), "로컬 세션 정리 시간이 초과되었습니다.");
        } catch (clearError) {
          console.log("[auth] clear local session failed:", clearError);
        }
        setUser(null);
        setError(getErrorMessage(bootstrapError));
        router.replace("/login");
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [completeLoginFromUrl, restoreSession]);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      try {
        console.log("[auth] Foreground deep link event:", url);
        setLoading(true);
        await completeLoginFromUrl(url);
      } catch (callbackError) {
        await clearLocalSession();
        setUser(null);
        setError(getErrorMessage(callbackError));
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.remove();
  }, [completeLoginFromUrl]);

  const login = useCallback(async () => {
    if (isRateLimited()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const callbackUrl = await startGoogleLogin();
      await completeLoginFromUrl(callbackUrl);
    } catch (loginError) {
      await clearLocalSession();
      const retrySeconds = getRateLimitRetrySeconds(loginError);

      if (retrySeconds) {
        setRateLimitedUntil(Date.now() + retrySeconds * 1000);
        setError(`요청이 너무 많습니다. ${retrySeconds}초 뒤 다시 시도해주세요.`);
        return;
      }

      setUser(null);
      setError(getErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  }, [completeLoginFromUrl, isRateLimited]);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
    setError(null);
    router.replace("/login");
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      loading,
      error,
      completeLoginWithCode,
      login,
      logout
    }),
    [completeLoginWithCode, error, initializing, loading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return value;
}
