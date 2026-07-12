"use client";

import { useCallback } from "react";
import { useTranslations } from "@/i18n/client";
import { ApiClientError } from "@/lib/ApiClientError";
import enMessages from "@/messages/en.json";
import type { ApiErrorDetail } from "@/shared/config/api";

const ERROR_NAMESPACE = "Errors";
const PASSWORD_COMPLEXITY_MESSAGE_PATTERN =
  /^password must contain at least 1 letter,\s*1 number and 1 special character\.?$/i;
const RANGE_MESSAGE_PATTERN =
  /^(.+?)\s+must be between\s+(-?\d+(?:\.\d+)?)\s+and\s+(-?\d+(?:\.\d+)?)/i;
const GREATER_THAN_MESSAGE_PATTERN =
  /^(.+?)\s+must be greater than\s+(-?\d+(?:\.\d+)?)/i;
const AT_LEAST_MESSAGE_PATTERN =
  /^(.+?)\s+must be at least\s+(-?\d+(?:\.\d+)?)(?:\s+characters?)?\.?$/i;
const REQUIRED_MESSAGE_PATTERN = /^(.+?)\s+is required\.?$/i;
const VALID_NUMBER_MESSAGE_PATTERN = /^(.+?)\s+must be a valid number\.?$/i;
const VALID_INTEGER_MESSAGE_PATTERN = /^(.+?)\s+must be a valid integer\.?$/i;
const INVALID_EMAIL_MESSAGE_PATTERN = /^invalid email address\.?$/i;

const FIELD_KEY_ALIASES: Record<string, string> = {
  desiredle: "desiredLifeExpectancy",
  desiredlifeexpectancy: "desiredLifeExpectancy",
  estimatedle: "estimatedLifeExpectancy",
  estimatedlifeexpectancy: "estimatedLifeExpectancy",
  ffpage: "targetFfpAge",
  inputffpage: "targetFfpAge",
  lifeexpectancy: "lifeExpectancy",
  targetffpage: "targetFfpAge",
  presrpriskyallocation: "preSrpRiskyAllocation",
  presrpexpectedreturn: "preSrpExpectedReturn",
  presrpriskfreerate: "preSrpRiskFreeRate",
  presrpriskyassetvolatility: "preSrpRiskyAssetVolatility",
  postsrpriskyallocation: "postSrpRiskyAllocation",
  postsrpexpectedreturn: "postSrpExpectedReturn",
  postsrpriskfreerate: "postSrpRiskFreeRate",
  postsrpriskyassetvolatility: "postSrpRiskyAssetVolatility",
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

function isApiClientError(error: unknown): error is ApiClientError {
  return (
    error instanceof ApiClientError ||
    (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string" &&
      ((error as { name?: string }).name === "ApiClientError" ||
        Array.isArray((error as { details?: unknown }).details)))
  );
}

function isPasswordField(rawField: string, path?: string): boolean {
  const fieldKey = getFieldKey(path) ?? getFieldKey(rawField);
  return fieldKey === "password" || fieldKey === "newPassword";
}

export function useApiErrorMessage() {
  const t = useTranslations(ERROR_NAMESPACE);
  const fields = useTranslations("Fields");
  const validation = useTranslations("Validation");

  const resolveFieldLabel = useCallback(
    (rawField: string, path?: string): string => {
      const fieldKey = getFieldKey(path) ?? getFieldKey(rawField);
      if (!fieldKey) {
        return rawField;
      }

      const translated = fields(fieldKey);
      return translated === `Fields.${fieldKey}` ? rawField : translated;
    },
    [fields],
  );

  const translateMessage = useCallback(
    (message: string, path?: string): string | null => {
      const trimmed = message.trim();
      if (!trimmed) {
        return null;
      }

      if (INVALID_EMAIL_MESSAGE_PATTERN.test(trimmed)) {
        const translated = validation("invalidEmail");
        return translated === "Validation.invalidEmail" ? null : translated;
      }

      if (PASSWORD_COMPLEXITY_MESSAGE_PATTERN.test(trimmed)) {
        const translated = validation("passwordComplexity");
        return translated === "Validation.passwordComplexity"
          ? null
          : translated;
      }

      const rangeMatch = trimmed.match(RANGE_MESSAGE_PATTERN);
      if (rangeMatch) {
        const [, rawField, min, max] = rangeMatch;
        const translated = validation("fieldRange", {
          field: resolveFieldLabel(rawField, path),
          min,
          max,
        });
        return translated === "Validation.fieldRange" ? null : translated;
      }

      const greaterThanMatch = trimmed.match(GREATER_THAN_MESSAGE_PATTERN);
      if (greaterThanMatch) {
        const [, rawField, min] = greaterThanMatch;
        const translated = validation("fieldGreaterThan", {
          field: resolveFieldLabel(rawField, path),
          min,
        });
        return translated === "Validation.fieldGreaterThan" ? null : translated;
      }

      const atLeastMatch = trimmed.match(AT_LEAST_MESSAGE_PATTERN);
      if (atLeastMatch) {
        const [, rawField, min] = atLeastMatch;
        if (isPasswordField(rawField, path)) {
          const translated = validation("passwordMinLength", { min });
          return translated === "Validation.passwordMinLength"
            ? null
            : translated;
        }

        const translated = validation("fieldAtLeast", {
          field: resolveFieldLabel(rawField, path),
          min,
        });
        return translated === "Validation.fieldAtLeast" ? null : translated;
      }

      const requiredMatch = trimmed.match(REQUIRED_MESSAGE_PATTERN);
      if (requiredMatch) {
        const [, rawField] = requiredMatch;
        const translated = validation("fieldRequired", {
          field: resolveFieldLabel(rawField, path),
        });
        return translated === "Validation.fieldRequired" ? null : translated;
      }

      const validNumberMatch = trimmed.match(VALID_NUMBER_MESSAGE_PATTERN);
      if (validNumberMatch) {
        const [, rawField] = validNumberMatch;
        const translated = validation("fieldValidNumber", {
          field: resolveFieldLabel(rawField, path),
        });
        return translated === "Validation.fieldValidNumber" ? null : translated;
      }

      const validIntegerMatch = trimmed.match(VALID_INTEGER_MESSAGE_PATTERN);
      if (validIntegerMatch) {
        const [, rawField] = validIntegerMatch;
        const translated = validation("fieldValidInteger", {
          field: resolveFieldLabel(rawField, path),
        });
        return translated === "Validation.fieldValidInteger"
          ? null
          : translated;
      }

      return null;
    },
    [resolveFieldLabel, validation],
  );

  const resolveMessages = useCallback(
    (error: unknown, fallback: string): string[] => {
      if (isApiClientError(error)) {
        const detailMessages = error.details
          ?.map((detail) => {
            const translated = translateMessage(detail.message, detail.path);
            if (translated) {
              return translated;
            }

            const message = detail.message?.trim();
            return message && message.length > 0 ? message : null;
          })
          .filter((message): message is string => Boolean(message));

        if (detailMessages && detailMessages.length > 0) {
          return [...new Set(detailMessages)];
        }

        const knownMessage = error.message
          ? translateMessage(error.message)
          : null;
        if (knownMessage) {
          return [knownMessage];
        }

        // error.message may already join multiple English details with "; "
        if (error.message?.includes("; ")) {
          const parts = error.message
            .split(";")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => translateMessage(part) ?? part);
          if (parts.length > 0) {
            return [...new Set(parts)];
          }
        }

        const translated = t(error.code);
        if (translated !== `${ERROR_NAMESPACE}.${error.code}`) {
          return [translated];
        }

        const detailCode = error.details?.find((detail) => detail.code)?.code;
        if (detailCode) {
          const detailTranslated = t(detailCode);
          if (detailTranslated !== `${ERROR_NAMESPACE}.${detailCode}`) {
            return [detailTranslated];
          }
        }

        return [error.message || fallback];
      }

      if (error instanceof Error) {
        if (error.message.includes("; ")) {
          const parts = error.message
            .split(";")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => translateMessage(part) ?? part);
          if (parts.length > 0) {
            return [...new Set(parts)];
          }
        }

        return [translateMessage(error.message) ?? error.message];
      }

      return [fallback];
    },
    [t, translateMessage],
  );

  return useCallback(
    (error: unknown, fallback: string): string => {
      return resolveMessages(error, fallback).join("\n");
    },
    [resolveMessages],
  );
}
