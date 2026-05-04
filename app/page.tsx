"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";
import FeatureGrid from "@/components/feature/FeatureGrid";
import HeroSection from "@/components/hero/HeroSection";
import MainLayout from "@/layouts/MainLayout";
import { FEATURES } from "@/utils/constants";

export default function Home() {
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(
    () => searchParams.get("login") === "1"
  );

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
