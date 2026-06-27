import type { FeatureItem } from "@/types/feature";

export const FEATURES: FeatureItem[] = [
  {
    id: "01",
    icon: "mingcute:target-line",
    title: "Can I reach my Safe Retirement goal?",
    description:
      "Check if your current plan is achievable or if you're saving too little or too much.",
    placeholder: "Example: Achieve SRP by age 55",
    ctaText: "Explore Scenario",
    href: "/scenario/reach-goal",
  },
  {
    id: "02",
    icon: "mingcute:calendar-2-line",
    title: "When will I reach Safe Retirement?",
    description: "Discover the earliest age you can achieve Safe Retirement.",
    placeholder: "Example: Saving 20% of income annually",
    ctaText: "Explore Scenario",
    href: "/scenario/timeline",
  },
  {
    id: "03",
    icon: "icon-park-outline:calculator",
    title: "How much can I spend at SRP?",
    description:
      "Estimate the maximum sustainable spending you can enjoy each year after reaching Safe Retirement.",
    placeholder: "Example: Annual budget after SRP",
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
