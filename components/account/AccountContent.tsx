import PersonalInfoSection from "@/components/account/sections/PersonalInfoSection";
import FinancialSection from "@/components/account/sections/FinancialSection";
import ResultsSection from "@/components/account/sections/ResultsSection";
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
    case "results":
      return <ResultsSection />;
    default:
      return null;
  }
}
