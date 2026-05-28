import type { OnboardingDraft } from "@/types/onboarding";

export function createEmptyOnboardingState(): OnboardingDraft {
  return {
    step1: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthYear: "",
      country: "",
      sex: "",
    },
    step2: {
      estimatedLifeExpectancy: "",
      currentSavings: "",
      preferredCurrency: "",
      desiredLifeExpectancy: "",
      beforeFfp: { u: "", mu: "", rf: "" },
      afterFfp: { u: "", mu: "", rf: "" },
      habits: {
        smoke: "",
        physical: "",
        diet: "",
        alcohol: "",
      },
    },
    stages: [],
    assets: [],
  };
}

export function mergeOnboardingState(
  parsedDraft: Partial<OnboardingDraft> | null | undefined,
): OnboardingDraft {
  const emptyState = createEmptyOnboardingState();

  if (!parsedDraft) {
    return emptyState;
  }

  return {
    step1: {
      ...emptyState.step1,
      ...parsedDraft.step1,
    },
    step2: {
      ...emptyState.step2,
      ...parsedDraft.step2,
      beforeFfp: {
        ...emptyState.step2.beforeFfp,
        ...parsedDraft.step2?.beforeFfp,
      },
      afterFfp: {
        ...emptyState.step2.afterFfp,
        ...parsedDraft.step2?.afterFfp,
      },
      habits: {
        ...emptyState.step2.habits,
        ...parsedDraft.step2?.habits,
      },
    },
    stages: parsedDraft.stages ?? emptyState.stages,
    assets: parsedDraft.assets ?? emptyState.assets,
  };
}
