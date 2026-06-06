import type { FeatureItem } from "@/types/feature";

export const FEATURES: FeatureItem[] = [
  {
    id: "01",
    icon: "mingcute:target-line",
    title: "Can I reach my Financial Freedom goal?",
    description:
      "Check if your current plan is achievable or if you're saving too little or too much.",
    placeholder: "Example: Achieve FFP by age 55",
    ctaText: "Explore Scenario",
    href: "/scenario/reach-goal",
  },
  {
    id: "02",
    icon: "mingcute:calendar-2-line",
    title: "When will I reach Financial Freedom?",
    description: "Discover the earliest age you can achieve Financial Freedom.",
    placeholder: "Example: Saving 20% of income annually",
    ctaText: "Explore Scenario",
    href: "/scenario/timeline",
  },
  {
    id: "03",
    icon: "icon-park-outline:calculator",
    title: "How much can I spend at FFP?",
    description:
      "Estimate the maximum sustainable spending you can enjoy each year after reaching Financial Freedom",
    placeholder: "Example: Monthly budget after FFP",
    ctaText: "Explore Scenario",
    href: "/scenario/spending",
  },
  {
    id: "04",
    icon: "mingcute:pig-money-line",
    title: "How Much Should I Save to Reach My Goal?",
    description: "Calculate the required monthly savings to reach your goal on time.",
    placeholder: "Example: Savings needed per month",
    ctaText: "Explore Scenario",
    href: "/scenario/savings",
  },
];
