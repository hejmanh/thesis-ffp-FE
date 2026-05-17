import type { OnboardingDraft } from "@/types/onboarding";

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "VND", "JPY"];
export const SEX_OPTIONS = ["Male", "Female", "Other"];
export const HABIT_LEVELS = ["Low", "Moderate", "High"];
export const ASSET_TYPE_OPTIONS = [
  { id: 1, label: "Stock" },
  { id: 2, label: "Bond" },
  { id: 3, label: "Cash" },
  { id: 4, label: "Real Estate" },
  { id: 5, label: "Crypto" },
  { id: 6, label: "Other" },
];
export const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "Singapore",
  "South Korea",
  "Vietnam",
  "Thailand",
  "Philippines",
  "Indonesia",
  "Malaysia",
  "Argentina",
  "New Zealand",
  "South Africa",
  "UAE",
  "Saudi Arabia",
  "Hong Kong",
  "Taiwan",
  "Switzerland",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
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
