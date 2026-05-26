import { useMemo } from "react";
import { useFinancialPlanningReferences } from "@/hooks/reference/useFinancialPlanningReferences";
import { useUserContext } from "@/providers/UserContextProvider";

export const useOnboardingReferences = () => {
  const planningReferences = useFinancialPlanningReferences();
  const { data: userContext, isLoading, error } = useUserContext();

  return useMemo(
    () => ({
      ...planningReferences,
      estimatedLifeExpectancy:
        userContext?.estimatedLifeExpectancy == null
          ? ""
          : String(userContext.estimatedLifeExpectancy),
      isLoading: planningReferences.isLoading || isLoading,
      error: error ?? planningReferences.error,
    }),
    [error, isLoading, planningReferences, userContext],
  );
};
