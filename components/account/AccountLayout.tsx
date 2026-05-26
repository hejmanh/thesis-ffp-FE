"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/hooks";
import type { AccountTab } from "@/utils/types";

export default function AccountLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AccountTab>("financial");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const logoutPending = isLoggingOut || isNavigating;
  const { logout } = useAuth();

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
