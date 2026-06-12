"use client";

import { useCallback, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/hooks";
import type { AccountTab } from "@/utils/types";
import { useLocaleRouter } from "@/i18n/client";

const VALID_TABS: AccountTab[] = ["personal", "financial", "preferences", "results"];

function getValidTab(tab: string | null): AccountTab {
  return tab && VALID_TABS.includes(tab as AccountTab) ? (tab as AccountTab) : "financial";
}

export default function AccountLayout() {
  const router = useLocaleRouter();
  const searchParams = useSearchParams();
  const activeTab = getValidTab(searchParams.get("tab"));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const logoutPending = isLoggingOut || isNavigating;
  const { logout } = useAuth();

  const handleTabChange = useCallback(
    (tab: AccountTab) => {
      router.replace(`/profile?tab=${tab}`);
    },
    [router],
  );

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
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isLoggingOut={logoutPending}
      />
      <div className="min-w-0 flex-1">
        <AccountContent tab={activeTab} />
      </div>
    </div>
  );
}
