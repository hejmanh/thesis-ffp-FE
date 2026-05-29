"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { userInfoService } from "@/services/userInfo.service";
import { tokenService } from "@/services/token.service";
import { useAuthStore } from "@/store/auth.store";
import type { UserContextData } from "@/types/userContext";

interface UserContextValue {
  data: UserContextData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  set: (data: UserContextData) => void;
  clear: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }
  return context;
}

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [data, setData] = useState<UserContextData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);
  const refreshSequenceRef = useRef(0);
  const sessionActive = isAuthenticated && Boolean(tokenService.get());

  const refresh = useCallback(async () => {
    if (!tokenService.get()) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshSequence = refreshSequenceRef.current + 1;
    refreshSequenceRef.current = refreshSequence;

    const requestPromise = (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await userInfoService.getMe();
        if (refreshSequenceRef.current === refreshSequence) {
          setData(result);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load user info";
        if (refreshSequenceRef.current === refreshSequence) {
          setError(message);
        }
      } finally {
        if (refreshSequenceRef.current === refreshSequence) {
          setIsLoading(false);
        }
      }
    })();

    refreshPromiseRef.current = requestPromise.finally(() => {
      if (refreshPromiseRef.current === requestPromise) {
        refreshPromiseRef.current = null;
      }
    });

    return refreshPromiseRef.current;
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!sessionActive || data || isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      void refresh();
    }, 0);

    return () => clearTimeout(timer);
  }, [data, isLoading, refresh, sessionActive]);

  const value = useMemo(
    () => ({
      data: sessionActive ? data : null,
      isLoading: sessionActive ? isLoading : false,
      error: sessionActive ? error : null,
      refresh,
      set: setData,
      clear,
    }),
    [clear, data, error, isLoading, refresh, sessionActive],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
