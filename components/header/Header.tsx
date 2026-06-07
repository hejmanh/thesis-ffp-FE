"use client";

import { useState, useTransition } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks";
import Image from "next/image";
import { useUserContext } from "@/providers/UserContextProvider";

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
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: userContext } = useUserContext();
  const { logout } = useAuth();
  const displayName = userContext?.name ?? user?.email ?? "Account";
  const logoutPending = isLoggingOut || isNavigating;

  async function handleLogout() {
    if (logoutPending) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
    } finally {
      setIsLoggingOut(false);
      startTransition(() => {
        router.push("/");
      });
    }
  }

  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8 xl:max-w-[1280px]">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-90 shadow-sm sm:h-10 sm:w-10">
            <img
              src="/CoinfusedLogo.png"
              alt="Coinfused Logo"
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
                href="/profile"
                className="max-w-[6.5rem] truncate text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:max-w-none"
              >
                {displayName}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutPending}
                aria-busy={logoutPending}
                className="shrink-0 min-w-0 px-3 sm:min-w-28 sm:px-5"
              >
                <span className="inline-flex items-center gap-2 transition-opacity duration-200">
                  {logoutPending ? (
                    <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                  ) : null}
                  <span>{logoutPending ? "Logging out..." : "Logout"}</span>
                </span>
              </Button>
            </>
          ) : (
            <>
              {!hideLoginButton ? (
                onLoginClick ? (
                  <Button variant="outline" size="sm" onClick={onLoginClick}>
                    Log In
                  </Button>
                ) : (
                  <Link href="/?login=1">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                )
              ) : null}
              {!hideRegisterButton ? (
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              ) : null}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
