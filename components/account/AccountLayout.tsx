"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/hooks";
import type { AccountTab } from "@/utils/types";

const VALID_TABS: AccountTab[] = ["personal", "financial", "preferences", "results"];

export default function AccountLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AccountTab>("financial");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const logoutPending = isLoggingOut || isNavigating;
  const { logout } = useAuth();

  // Honour ?tab= deep-link on mount
  useEffect(() => {
    const tabParam = searchParams.get("tab") as AccountTab | null;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
