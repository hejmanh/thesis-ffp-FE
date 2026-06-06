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
import { FEATURES } from "@/utils/constants";

type ScenarioId = "01" | "02" | "03" | "04";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("login") !== "1") {
      return;
    }

    const timer = window.setTimeout(() => setShowLoginModal(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function handleCardClick(id: string) {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setActiveScenario(id as ScenarioId);
  }

  function closeScenario() {
    setActiveScenario(null);
  }

  return (
    <>
      <MainLayout onLoginClick={() => setShowLoginModal(true)}>
        <HeroSection />
        <FeatureGrid features={FEATURES} onCardClick={handleCardClick}>
          {isAuthenticated && (
            <div className="mx-auto mt-6 flex justify-center md:max-w-266">
              <Link
                href="/profile?tab=results"
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2 text-sm font-medium text-primary hover:underline"
              >
                <Icon icon="mdi:chart-line" className="h-4 w-4" aria-hidden="true" />
                View my results
              </Link>
            </div>
          )}
        </FeatureGrid>
      </MainLayout>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {isAuthenticated && (
        <>
          <Scenario1Modal isOpen={activeScenario === "01"} onClose={closeScenario} />
          <Scenario2Modal isOpen={activeScenario === "02"} onClose={closeScenario} />
          <Scenario3Modal isOpen={activeScenario === "03"} onClose={closeScenario} />
          <Scenario4Modal isOpen={activeScenario === "04"} onClose={closeScenario} />
        </>
      )}
    </>
  );
}
