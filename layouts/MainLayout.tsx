"use client";

import { useEffect, type ReactNode } from "react";
import Header from "@/components/header/Header";
import { useAutoRefresh } from "@/hooks/auth/useAutoRefresh";
import { cn } from "@/utils/cn";

interface MainLayoutProps {
  children: ReactNode;
  onLoginClick?: () => void;
  hideLoginButton?: boolean;
  hideRegisterButton?: boolean;
  registrationBackground?: boolean;
}

export default function MainLayout({
  children,
  onLoginClick,
  hideLoginButton = false,
  hideRegisterButton = false,
  registrationBackground = false,
}: MainLayoutProps) {
  const { ready } = useAutoRefresh();

  useEffect(() => {
    if (!registrationBackground) return;

    document.body.classList.add("bg-registration-pattern");
    return () => {
      document.body.classList.remove("bg-registration-pattern");
    };
  }, [registrationBackground]);

  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-1 flex-col",
        registrationBackground ? "bg-registration-pattern" : "bg-background",
      )}
    >
      <Header
        authReady={ready}
        onLoginClick={onLoginClick}
        hideLoginButton={hideLoginButton}
        hideRegisterButton={hideRegisterButton}
      />
      <main className="mx-auto w-full max-w-[1200px] xl:max-w-[1280px]">{children}</main>
    </div>
  );
}
