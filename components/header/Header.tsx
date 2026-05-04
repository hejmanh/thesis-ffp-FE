"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { getSession, logout } from "@/services/auth/mockAuth";

interface HeaderProps {
  onLoginClick?: () => void;
  hideLoginButton?: boolean;
}

export default function Header({ onLoginClick, hideLoginButton = false }: HeaderProps) {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    function syncSession() {
      const session = getSession();
      setSessionEmail(session?.user.email ?? null);
    }
    syncSession();
    window.addEventListener("coinfused-auth-changed", syncSession);
    return () => window.removeEventListener("coinfused-auth-changed", syncSession);
  }, []);

  function handleLogout() {
    logout();
    setSessionEmail(null);
  }

  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8 xl:max-w-[1280px]">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-indigo-500 text-white sm:h-10 sm:w-10">
            $
          </span>
          <span className="text-xl font-bold tracking-tight text-primary sm:text-2xl">Coinfused</span>
        </Link>
        <nav className="flex items-center gap-3">
          {sessionEmail ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{sessionEmail}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
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
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                )
              ) : null}
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
