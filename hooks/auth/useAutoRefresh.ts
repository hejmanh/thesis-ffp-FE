"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { useUserContext } from "@/providers/UserContextProvider";
import { useAuthStore } from "@/store/auth.store";

export function useAutoRefresh() {
  const [ready, setReady] = useState(false);
  const { refresh, clear } = useUserContext();
  const setAuthReady = useAuthStore((state) => state.setAuthReady);

  useEffect(() => {
    let mounted = true;
    setAuthReady(false);

    authService
      .restoreSession()
      .then((restored) => {
        if (!mounted) return;
        if (restored) {
          void refresh();
        } else {
          clear();
        }
      })
      .catch(() => {
        if (mounted) clear();
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
          setAuthReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [clear, refresh, setAuthReady]);

  return { ready };
}
