"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";
import AccountSidebar from "@/components/account/AccountSidebar";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { useAuthStore } from "@/store/auth.store";
import type { AccountTab } from "@/utils/types";

export default function AccountLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AccountTab>("personal");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const logoutPending = isLoggingOut || isNavigating;

  async function handleLogout() {
    if (logoutPending) return;

    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      tokenService.clear();
      useAuthStore.getState().clearUser();
    } finally {
      setIsLoggingOut(false);
      startTransition(() => {
        router.push("/");
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <AccountSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isLoggingOut={logoutPending}
      />
      <AccountContent tab={activeTab} />
    </div>
  );
}
