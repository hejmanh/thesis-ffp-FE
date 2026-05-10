"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";
import AccountSidebar from "@/components/account/AccountSidebar";
import { logout } from "@/services/auth/mockAuth";
import type { AccountTab } from "@/utils/types";

export default function AccountLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AccountTab>("personal");

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      <AccountContent tab={activeTab} />
    </div>
  );
}
