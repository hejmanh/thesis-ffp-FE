"use client";

import { useEffect, useState } from "react";
import FeatureGrid from "@/components/feature/FeatureGrid";
import HeroSection from "@/components/hero/HeroSection";
import LoginModal from "@/components/login/LoginModal";
import MainLayout from "@/layouts/MainLayout";
import { FEATURES } from "@/utils/constants";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("login") !== "1") {
      return;
    }

    const timer = window.setTimeout(() => setShowLoginModal(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <MainLayout onLoginClick={() => setShowLoginModal(true)}>
        <HeroSection />
        <FeatureGrid features={FEATURES} onCardClick={() => setShowLoginModal(true)} />
      </MainLayout>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
