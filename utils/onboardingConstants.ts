import type { OnboardingDraft } from "@/types/onboarding";

export const ONBOARDING_STORAGE_KEY = "coinfused_onboarding_payload";
export const ONBOARDING_REGISTRATION_GATE_KEY =
  "coinfused_onboarding_registration_ready";

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "VND", "JPY"];
export const HABIT_LEVELS = ["Low", "Moderate", "High"];
export const ASSET_TYPE_OPTIONS = [
  { id: 1, label: "Stock" },
  { id: 2, label: "Bond" },
  { id: 3, label: "Cash" },
  { id: 4, label: "Real Estate" },
  { id: 5, label: "Crypto" },
  { id: 6, label: "Other" },
];

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
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
