"use client";

import { useCallback } from "react";
import { useTranslations } from "@/i18n/client";
import { ApiClientError } from "@/lib/ApiClientError";
import enMessages from "@/messages/en.json";
import type { ApiErrorDetail } from "@/shared/config/api";

const ERROR_NAMESPACE = "Errors";
const RANGE_MESSAGE_PATTERN =
  /^(.+?)\s+must be between\s+(-?\d+(?:\.\d+)?)\s+and\s+(-?\d+(?:\.\d+)?)/i;

const FIELD_KEY_ALIASES: Record<string, string> = {
  desiredle: "desiredLifeExpectancy",
  desiredlifeexpectancy: "desiredLifeExpectancy",
  estimatedle: "estimatedLifeExpectancy",
  estimatedlifeexpectancy: "estimatedLifeExpectancy",
  ffpage: "targetFfpAge",
  inputffpage: "targetFfpAge",
  lifeexpectancy: "lifeExpectancy",
  targetffpage: "targetFfpAge",
};

function normalizeFieldName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getFieldKey(value?: string): string | null {
  if (!value) {
    return null;
  }

  const normalized = normalizeFieldName(value.split(".").at(-1) ?? value);
  const aliasKey = FIELD_KEY_ALIASES[normalized];
  if (aliasKey) {
    return aliasKey;
  }

  const fields = enMessages.Fields as Record<string, string>;
  const matchingKey = Object.keys(fields).find(
    (key) =>
      normalizeFieldName(key) === normalized ||
      normalizeFieldName(fields[key]) === normalized,
  );

  return matchingKey ?? null;
}

export function useApiErrorMessage() {
  const t = useTranslations(ERROR_NAMESPACE);
  const fields = useTranslations("Fields");
  const validation = useTranslations("Validation");

  const translateDetailMessage = useCallback(
    (detail: ApiErrorDetail): string | null => {
      const rangeMatch = detail.message.match(RANGE_MESSAGE_PATTERN);
      if (!rangeMatch) {
        return null;
      }

      const [, rawField, min, max] = rangeMatch;
      const fieldKey = getFieldKey(detail.path) ?? getFieldKey(rawField);
      const fieldLabel = fieldKey ? fields(fieldKey) : rawField;
      const translated = validation("fieldRange", {
        field: fieldLabel,
        min,
        max,
      });

      return translated === "Validation.fieldRange" ? null : translated;
    },
    [fields, validation],
  );

  return useCallback(
    (error: unknown, fallback: string): string => {
      if (error instanceof ApiClientError) {
        const detailMessages = error.details
          ?.map(translateDetailMessage)
          .filter((message): message is string => Boolean(message));
        if (detailMessages && detailMessages.length > 0) {
          return detailMessages.join("; ");
        }

        const translated = t(error.code);
        if (translated !== `${ERROR_NAMESPACE}.${error.code}`) {
          return translated;
        }

        const detailCode = error.details?.find((detail) => detail.code)?.code;
        if (detailCode) {
          const detailTranslated = t(detailCode);
          if (detailTranslated !== `${ERROR_NAMESPACE}.${detailCode}`) {
            return detailTranslated;
          }
        }

        return error.message || fallback;
      }

      return error instanceof Error ? error.message : fallback;
    },
    [t, translateDetailMessage],
  );
}
