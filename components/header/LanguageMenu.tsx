"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "@/i18n/client";
import {
  localeCookieName,
  localizePath,
  removeLocaleFromPathname,
  type Locale,
} from "@/i18n/routing";

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "circle-flags:us",
  vi: "circle-flags:vn",
};

export default function LanguageMenu() {
  const rawRouter = useRouter();
  const locale = useLocale();
  const t = useTranslations("Header.languageMenu");
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLocaleChange(nextLocale: Locale) {
    setIsOpen(false);

    if (nextLocale === locale) return;

    const currentPath = removeLocaleFromPathname(window.location.pathname);
    const currentHref = `${currentPath}${window.location.search}${window.location.hash}`;
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    rawRouter.push(localizePath(currentHref, nextLocale));
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t("label")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-primary-soft hover:text-primary"
      >
        <Icon icon={LOCALE_FLAGS[locale]} className="h-6 w-6" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-white py-2 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleLocaleChange("en")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-primary-soft"
          >
            <Icon icon="circle-flags:us" className="h-5 w-5" aria-hidden="true" />
            <span>{t("english")}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleLocaleChange("vi")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-primary-soft"
          >
            <Icon icon="circle-flags:vn" className="h-5 w-5" aria-hidden="true" />
            <span>{t("vietnamese")}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
