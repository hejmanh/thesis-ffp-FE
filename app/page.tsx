"use client";

import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import FeatureGrid from "@/components/feature/FeatureGrid";
import HeroSection from "@/components/hero/HeroSection";
import MainLayout from "@/layouts/MainLayout";
import { FEATURES } from "@/utils/constants";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("login") === "1";
  });

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
