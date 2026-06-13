"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";

const FIELD_SELECTOR = [
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "button[aria-haspopup='listbox']",
].join(",");

function isFocusableField(element: HTMLElement) {
  return (
    !element.hasAttribute("disabled") &&
    element.getAttribute("aria-disabled") !== "true" &&
    element.tabIndex !== -1 &&
    element.getClientRects().length > 0
  );
}

function getFocusableFields(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FIELD_SELECTOR)).filter(
    isFocusableField,
  );
}

export function useEnterToFocusNextField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const container = containerRef.current;
      if (!container || container.contains(document.activeElement)) {
        return;
      }

      getFocusableFields(container)[0]?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleEnterKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement) || target instanceof HTMLTextAreaElement) {
      return;
    }

    if (target.closest("[role='listbox']")) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const fields = getFocusableFields(container);
    const currentIndex = fields.indexOf(target);
    const nextField = fields[currentIndex + 1];
    if (currentIndex === -1 || !nextField) {
      return;
    }

    event.preventDefault();
    nextField.focus();
  }, []);

  return { containerRef, handleEnterKeyDown };
}
