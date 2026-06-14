import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/providers/UserContextProvider";
import { userInfoService } from "@/services/userInfo.service";
import { useAuthStore } from "@/store/auth.store";
import { useTranslations } from "@/i18n/client";

export function useLifeExpectancyOptions() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: userContext, isLoading: isUserContextLoading } = useUserContext();
  const fields = useTranslations("Fields");
  const financialQuery = useQuery({
    queryKey: ["user-info", "financial"],
    queryFn: () => userInfoService.getFinancial(),
    enabled: isAuthenticated,
  });

  return useMemo(() => {
    const estimated = userContext?.estimatedLifeExpectancy;
    const desired =
      financialQuery.data?.financialProfile?.desiredLifeExpectancy;

    const options: Array<{ label: string; value: string }> = [];

    if (estimated != null) {
      options.push({
        label: `${fields("estimatedLifeExpectancy")}: ${estimated}`,
        value: String(estimated),
      });
    }

    if (desired != null) {
      options.push({
        label: `${fields("desiredLifeExpectancy")}: ${desired}`,
        value: String(desired),
      });
    }

    const defaultValue =
      desired != null
        ? String(desired)
        : estimated != null
          ? String(estimated)
          : "";

    return {
      options,
      defaultValue,
      isLoading: isUserContextLoading || financialQuery.isLoading,
      isReady: options.length > 0,
    };
  }, [
    financialQuery.data,
    financialQuery.isLoading,
    fields,
    isUserContextLoading,
    userContext?.estimatedLifeExpectancy,
  ]);
}
