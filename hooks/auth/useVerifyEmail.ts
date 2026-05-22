"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

type Status = "pending" | "success" | "error";

export function useVerifyEmail() {
  const [verificationState, setVerificationState] = useState<{
    token: string | null;
    status: Status;
    error: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return { token: null, status: "pending", error: null };
    }

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      return {
        token: null,
        status: "error",
        error: "Invalid verification link",
      };
    }

    return { token, status: "pending", error: null };
  });

  useEffect(() => {
    if (!verificationState.token) {
      return;
    }

    authService
      .verifyEmail(verificationState.token)
      .then(() =>
        setVerificationState((currentState) => ({
          ...currentState,
          status: "success",
        })),
      )
      .catch((err) => {
        setVerificationState((currentState) => ({
          ...currentState,
          status: "error",
          error: err instanceof Error ? err.message : "Verification failed",
        }));
      });
  }, [verificationState.token]);

  return {
    status: verificationState.status,
    error: verificationState.error,
  };
}
