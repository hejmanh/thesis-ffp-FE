"use client";

import Card from "@/components/common/Card";
import { cn } from "@/utils/cn";
import type { AccountTab } from "@/utils/types";

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  onLogout: () => void;
}

const TABS: Array<{ label: string; value: AccountTab }> = [
  { label: "Personal Information", value: "personal" },
  { label: "Financial Profile and Planning", value: "financial" },
  { label: "Preferences", value: "preferences" },
];

export default function AccountSidebar({ activeTab, onTabChange, onLogout }: AccountSidebarProps) {
  return (
    <Card hoverable={false} className="h-fit w-full rounded-xl bg-white p-3 shadow-md lg:w-72">
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
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition"
        >
          Logout
        </button>
      </nav>
    </Card>
  );
}
