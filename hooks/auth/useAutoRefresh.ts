"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { useUserContext } from "@/providers/UserContextProvider";

export function useAutoRefresh() {
  const [ready, setReady] = useState(false);
  const { refresh, clear } = useUserContext();

  useEffect(() => {
    let mounted = true;

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
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [clear, refresh]);

  return { ready };
}
