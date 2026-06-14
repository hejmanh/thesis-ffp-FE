"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

type Status = "pending" | "success" | "error";

export function useVerifyEmail() {
  const t = useTranslations("Auth.verifyEmail");
  const getApiErrorMessage = useApiErrorMessage();
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
        error: t("invalidLink"),
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
          error: getApiErrorMessage(err, t("failed")),
        }));
      });
  }, [getApiErrorMessage, t, verificationState.token]);

  return {
    status: verificationState.status,
    error: verificationState.error,
  };
}
