import type { OnboardingDraft } from "@/types/onboarding";

const STORAGE_KEY = "coinfused_onboarding_payload";

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

export function loadOnboardingState(): OnboardingDraft {
  if (typeof window === "undefined") {
    return createEmptyOnboardingState();
  }

  const rawDraft = window.localStorage.getItem(STORAGE_KEY);
  if (!rawDraft) {
    return createEmptyOnboardingState();
  }

  try {
    return mergeOnboardingState(JSON.parse(rawDraft) as Partial<OnboardingDraft>);
  } catch {
    return createEmptyOnboardingState();
  }
}

export function saveOnboardingState(draft: OnboardingDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearOnboardingState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
