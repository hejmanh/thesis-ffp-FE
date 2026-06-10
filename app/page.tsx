"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FeatureGrid from "@/components/feature/FeatureGrid";
import HeroSection from "@/components/hero/HeroSection";
import LoginModal from "@/components/login/LoginModal";
import Scenario1Modal from "@/components/scenario/Scenario1Modal";
import Scenario2Modal from "@/components/scenario/Scenario2Modal";
import Scenario3Modal from "@/components/scenario/Scenario3Modal";
import Scenario4Modal from "@/components/scenario/Scenario4Modal";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/store/auth.store";
import { useLocalizedPath, useTranslations } from "@/i18n/client";
import type { FeatureItem } from "@/types/feature";

type ScenarioId = "01" | "02" | "03" | "04";

export default function Home() {
  const t = useTranslations("Home.features");
  const toLocalizedPath = useLocalizedPath();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null);
  const features: FeatureItem[] = [
    {
      id: "01",
      icon: "mingcute:target-line",
      title: t("reachGoal.title"),
      description: t("reachGoal.description"),
      placeholder: t("reachGoal.placeholder"),
      ctaText: t("cta"),
      href: "/scenario/reach-goal",
    },
    {
      id: "02",
      icon: "mingcute:calendar-2-line",
      title: t("timeline.title"),
      description: t("timeline.description"),
      placeholder: t("timeline.placeholder"),
      ctaText: t("cta"),
      href: "/scenario/timeline",
    },
    {
      id: "03",
      icon: "icon-park-outline:calculator",
      title: t("spending.title"),
      description: t("spending.description"),
      placeholder: t("spending.placeholder"),
      ctaText: t("cta"),
      href: "/scenario/spending",
    },
    {
      id: "04",
      icon: "mingcute:pig-money-line",
      title: t("savings.title"),
      description: t("savings.description"),
      placeholder: t("savings.placeholder"),
      ctaText: t("cta"),
      href: "/scenario/savings",
    },
  ];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("login") !== "1" || !isAuthReady || isAuthenticated) {
      return;
    }

    const timer = window.setTimeout(() => setShowLoginModal(true), 0);
    return () => window.clearTimeout(timer);
  }, [isAuthReady, isAuthenticated]);

  function handleCardClick(id: string) {
    if (!isAuthReady) {
      return;
    }

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (id !== "01" && id !== "02" && id !== "03" && id !== "04") return;
    setActiveScenario(id);
  }

  function closeScenario() {
    setActiveScenario(null);
  }

  return (
    <>
      <MainLayout onLoginClick={() => setShowLoginModal(true)}>
        <HeroSection />
        <FeatureGrid features={features} onCardClick={handleCardClick}>
          {isAuthenticated && (
            <div className="mx-auto mt-4 flex justify-center md:max-w-266">
              <Link
                href={toLocalizedPath("/profile?tab=results")}
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2 text-sm font-medium text-primary hover:underline"
              >
                <Icon icon="mdi:chart-line" className="h-4 w-4" aria-hidden="true" />
                {t("viewResults")}
              </Link>
            </div>
          )}
        </FeatureGrid>
      </MainLayout>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {isAuthenticated && activeScenario === "01" && (
         <Scenario1Modal isOpen onClose={closeScenario} />
       )}
       {isAuthenticated && activeScenario === "02" && (
         <Scenario2Modal isOpen onClose={closeScenario} />
       )}
       {isAuthenticated && activeScenario === "03" && (
         <Scenario3Modal isOpen onClose={closeScenario} />
       )}
       {isAuthenticated && activeScenario === "04" && (
         <Scenario4Modal isOpen onClose={closeScenario} />
       )}

      <footer className="border-t border-border bg-white px-4 py-4 text-center text-sm text-muted-foreground sm:px-6 sm:py-5 lg:px-8">
        <p>{t("footer")}</p>
      </footer>
    </>
  );
}
