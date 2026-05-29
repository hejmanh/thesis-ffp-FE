"use client";

import RegistrationProgressBar from "@/components/register/progress/RegistrationProgressBar";

const STEPS = ["Registration", "General Information", "Life Stages", "Asset"];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return <RegistrationProgressBar steps={STEPS} currentStep={currentStep} />;
}
