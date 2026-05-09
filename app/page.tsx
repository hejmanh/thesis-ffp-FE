"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeatureGrid from "@/components/feature/FeatureGrid";
import HeroSection from "@/components/hero/HeroSection";
import LoginModal from "@/components/login/LoginModal";
import MainLayout from "@/layouts/MainLayout";
import { FEATURES } from "@/utils/constants";

export default function Home() {
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      setShowLoginModal(true);
    }
  }, [searchParams]);

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
