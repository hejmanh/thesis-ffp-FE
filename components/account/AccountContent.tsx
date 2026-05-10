import PersonalInfoSection from "@/components/account/sections/PersonalInfoSection";
import FinancialSection from "@/components/account/sections/FinancialSection";
import PreferencesSection from "@/components/account/sections/PreferencesSection";
import type { AccountTab } from "@/utils/types";

interface AccountContentProps {
  tab: AccountTab;
}

export default function AccountContent({ tab }: AccountContentProps) {
  switch (tab) {
    case "personal":
      return <PersonalInfoSection />;
    case "financial":
      return <FinancialSection />;
    case "preferences":
      return <PreferencesSection />;
    default:
      return null;
  }
}
