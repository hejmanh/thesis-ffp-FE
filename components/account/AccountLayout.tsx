"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";
import CollapsibleButton from "@/components/account/CollapsibleButton";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/hooks";
import type { AccountTab } from "@/utils/types";
import { useLocaleRouter } from "@/i18n/client";
import { cn } from "@/utils/cn";

const VALID_TABS: AccountTab[] = ["personal", "financial", "results"];

function getValidTab(tab: string | null): AccountTab {
  return tab && VALID_TABS.includes(tab as AccountTab) ? (tab as AccountTab) : "financial";
}

export default function AccountLayout() {
  const router = useLocaleRouter();
  const searchParams = useSearchParams();
  const activeTab = getValidTab(searchParams.get("tab"));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const logoutPending = isLoggingOut || isNavigating;
  const { logout } = useAuth();

  const handleTabChange = useCallback(
    (tab: AccountTab) => {
      setIsSidebarOpen(false);
      router.replace(`/profile?tab=${tab}`);
    },
    [router],
  );

  useEffect(() => {
    if (!isSidebarOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  async function handleLogout() {
    if (logoutPending) return;

    setIsSidebarOpen(false);
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
      <CollapsibleButton
        isOpen={isSidebarOpen}
        controlsId="account-sidebar"
        onToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <button
        type="button"
        aria-label="Close account menu"
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <AccountSidebar
        id="account-sidebar"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isLoggingOut={logoutPending}
        isMobileOpen={isSidebarOpen}
      />
      <div className="min-w-0 flex-1">
        <AccountContent tab={activeTab} />
      </div>
    </div>
  );
}
