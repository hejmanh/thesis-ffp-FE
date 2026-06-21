"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FeatureGrid from "@/components/feature/FeatureGrid";
import HeroSection from "@/components/hero/HeroSection";
import LoginModal from "@/components/login/LoginModal";
import Scenario1Modal from "@/components/scenario/Scenario1Modal";
import Scenario2Modal from "@/components/scenario/Scenario2Modal";
import Scenario3Modal from "@/components/scenario/Scenario3Modal";
import Scenario4Modal from "@/components/scenario/Scenario4Modal";
import ConsentModal from "@/components/consent/ConsentModal";
import SurveyModal from "@/components/survey/SurveyModal";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/store/auth.store";
import { useLocalizedPath, useTranslations } from "@/i18n/client";
import { useGetConsentStatus } from "@/hooks/consent/useConsent";
import { useGetSurveyResponseStatus } from "@/hooks/survey/useSurvey";
import { useGetScenario1Output } from "@/hooks/scenario/useScenario1";
import { useGetScenario2Output } from "@/hooks/scenario/useScenario2";
import { useGetScenario3Output } from "@/hooks/scenario/useScenario3";
import { useGetScenario4Output } from "@/hooks/scenario/useScenario4";
import type { FeatureItem } from "@/types/feature";

type ScenarioId = "01" | "02" | "03" | "04";

export default function Home() {
  const t = useTranslations("Home.features");
  const tSurvey = useTranslations("Survey");
  const toLocalizedPath = useLocalizedPath();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  const consentChecked = useRef(false);
  const surveyAutoPoppedRef = useRef(false);

  const { data: consentStatus } = useGetConsentStatus();
  const { data: surveyStatus } = useGetSurveyResponseStatus();

  const { data: s1Output } = useGetScenario1Output();
  const { data: s2Output } = useGetScenario2Output();
  const { data: s3Output } = useGetScenario3Output();
  const { data: s4Output } = useGetScenario4Output();

  const surveySubmitted = surveyStatus?.submitted === true;
  const showSurveyButton = isAuthenticated && hasConsented === true && !surveySubmitted;

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

  // Open login modal when redirected with ?login=1
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("login") !== "1" || !isAuthReady || isAuthenticated) {
      return;
    }
    const timer = window.setTimeout(() => setShowLoginModal(true), 0);
    return () => window.clearTimeout(timer);
  }, [isAuthReady, isAuthenticated]);

  // Show consent modal once when hasSeen is false
  useEffect(() => {
    if (!isAuthenticated || consentChecked.current || !consentStatus) return;

    consentChecked.current = true;
    setHasConsented(consentStatus.hasConsented);

    if (!consentStatus.hasSeen) {
      setShowConsentModal(true);
    }
  }, [isAuthenticated, consentStatus]);

  // Auto-popup survey after all 4 scenarios are completed
  useEffect(() => {
    if (
      surveyAutoPoppedRef.current ||
      !isAuthenticated ||
      !hasConsented ||
      surveySubmitted ||
      !s1Output ||
      !s2Output ||
      !s3Output ||
      !s4Output
    ) {
      return;
    }

    surveyAutoPoppedRef.current = true;
    setShowSurveyModal(true);
  }, [isAuthenticated, hasConsented, surveySubmitted, s1Output, s2Output, s3Output, s4Output]);

  function handleCardClick(id: string) {
    if (!isAuthReady) return;

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

  function handleConsentResult(agreed: boolean) {
    setHasConsented(agreed);
  }

  return (
    <>
      <MainLayout onLoginClick={() => setShowLoginModal(true)}>
        <HeroSection />
        <FeatureGrid features={features} onCardClick={handleCardClick}>
          {isAuthenticated && (
            <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-4 md:max-w-266">
              <Link
                href={toLocalizedPath("/profile?tab=results")}
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2 text-sm font-medium text-primary hover:underline"
              >
                <Icon icon="mdi:chart-line" className="h-4 w-4" aria-hidden="true" />
                {t("viewResults")}
              </Link>
              {showSurveyButton && (
                <button
                  type="button"
                  onClick={() => setShowSurveyModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2 text-sm font-medium text-primary hover:underline"
                >
                  <Icon icon="mdi:clipboard-text-outline" className="h-4 w-4" aria-hidden="true" />
                  {tSurvey("takeSurvey")}
                </button>
              )}
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

      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsented={handleConsentResult}
      />

      <SurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
      />

      <footer className="border-t border-border bg-white px-4 py-4 text-center text-sm text-muted-foreground sm:px-6 sm:py-5 lg:px-8">
        <p>{t("footer")}</p>
      </footer>
    </>
  );
}
