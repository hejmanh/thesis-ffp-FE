"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

export function useAutoRefresh() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authService
      .restoreSession()
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  return { ready };
}
