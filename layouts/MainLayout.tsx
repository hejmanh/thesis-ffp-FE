"use client";

import type { ReactNode } from "react";
import Header from "@/components/header/Header";

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
  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={onLoginClick} hideLoginButton={hideLoginButton} hideRegisterButton={hideRegisterButton} />
      <main className="mx-auto w-full max-w-[1200px] xl:max-w-[1280px]">{children}</main>
    </div>
  );
}
