"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

export function useAutoRefresh() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    authService
      .restoreSession()
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { ready };
}
