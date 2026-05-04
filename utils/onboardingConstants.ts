import type { OnboardingDraft } from "@/types/onboarding";

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "VND", "JPY"];
export const SEX_OPTIONS = ["Male", "Female", "Other"];
export const HABIT_LEVELS = ["Low", "Moderate", "High"];
export const ASSET_TYPES = ["Stock", "Bond", "Cash", "Real Estate", "Crypto", "Other"];

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
  step1: {
    email: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    country: "",
    sex: "",
  },
  step2: {
    currentSavings: "",
    preferredCurrency: "USD",
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
