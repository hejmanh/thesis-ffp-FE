"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import LanguageMenu from "@/components/header/LanguageMenu";
import { useAuthStore } from "@/store/auth.store";
import { useUserContext } from "@/providers/UserContextProvider";
import { useLocalizedPath, useTranslations } from "@/i18n/client";

interface HeaderProps {
  authReady?: boolean;
  onLoginClick?: () => void;
  hideLoginButton?: boolean;
  hideRegisterButton?: boolean;
}

export default function Header({
  authReady = true,
  onLoginClick,
  hideLoginButton = false,
  hideRegisterButton = false,
}: HeaderProps) {
  const toLocalizedPath = useLocalizedPath();
  const t = useTranslations("Header");
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: userContext } = useUserContext();
  const displayName = userContext?.name ?? user?.email ?? t("accountFallback");

  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8 xl:max-w-[1280px]">
        <Link href={toLocalizedPath("/")} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-90 shadow-sm sm:h-10 sm:w-10">
            <Image
              src="/CoinfusedLogo.png"
              alt="Coinfused Logo"
              width={28}
              height={28}
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            />
          </span>
          <span className="bg-gradient-to-r from-blue-600 via-primary to-indigo-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
            Coinfused
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          {!authReady ? (
            <div
              className="h-9 w-28 animate-pulse rounded-full bg-slate-200/70"
              aria-hidden="true"
            />
          ) : isAuthenticated ? (
            <>
              <Link
                href={toLocalizedPath("/profile?tab=financial")}
                className="max-w-[9rem] truncate text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:max-w-none"
              >
                {displayName}
              </Link>
              <LanguageMenu />
            </>
          ) : (
            <>
              {!hideLoginButton ? (
                onLoginClick ? (
                  <Button variant="outline" size="sm" onClick={onLoginClick}>
                    {t("login")}
                  </Button>
                ) : (
                  <Link href={toLocalizedPath("/?login=1")}>
                    <Button variant="outline" size="sm">
                      {t("login")}
                    </Button>
                  </Link>
                )
              ) : null}
              {!hideRegisterButton ? (
                <Link href={toLocalizedPath("/register")}>
                  <Button size="sm">{t("register")}</Button>
                </Link>
              ) : null}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
