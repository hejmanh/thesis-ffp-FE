"use client";

import { Icon } from "@iconify/react";
import Card from "@/components/common/Card";
import { cn } from "@/utils/cn";
import type { AccountTab } from "@/utils/types";

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const TABS: Array<{ label: string; value: AccountTab }> = [
  { label: "Account", value: "personal" },
  { label: "Personal Information", value: "financial" },
  { label: "Results", value: "results" },
  { label: "Preferences", value: "preferences" },
];

export default function AccountSidebar({
  activeTab,
  onTabChange,
  onLogout,
  isLoggingOut = false,
}: AccountSidebarProps) {
  return (
    <Card hoverable={false} className="h-fit w-full rounded-xl bg-white p-3 shadow-md lg:w-[21.25rem] lg:flex-shrink-0">
      <nav className="space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition",
              activeTab === tab.value ? "bg-primary-soft text-slate-700" : "text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors",
            isLoggingOut ? "cursor-wait opacity-70" : "hover:bg-red-50",
          )}
        >
          <span className="inline-flex items-center gap-2 transition-opacity duration-200">
            {isLoggingOut ? (
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
            ) : null}
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </span>
        </button>
      </nav>
    </Card>
  );
}
