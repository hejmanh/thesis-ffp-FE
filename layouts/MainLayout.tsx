"use client";

import type { ReactNode } from "react";
import Header from "@/components/header/Header";
import { useAutoRefresh } from "@/hooks/auth/useAutoRefresh";

interface MainLayoutProps {
  children: ReactNode;
  onLoginClick?: () => void;
  hideLoginButton?: boolean;
  hideRegisterButton?: boolean;
}

export default function MainLayout({
  children,
  onLoginClick,
  hideLoginButton = false,
  hideRegisterButton = false,
}: MainLayoutProps) {
  const { ready } = useAutoRefresh();

  return (
    <div className="min-h-screen bg-background">
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
