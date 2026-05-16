"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

type Status = "pending" | "success" | "error";

export function useVerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Verification failed");
        setStatus("error");
      });
  }, [token]);

  if (!token) {
    return { status: "error", error: "Invalid verification link" };
  }

  return { status, error };
}
