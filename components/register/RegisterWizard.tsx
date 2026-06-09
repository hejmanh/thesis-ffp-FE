"use client";

import AnimatedPanel from "@/components/common/AnimatedPanel";
import RegistrationProgressBar from "@/components/register/progress/RegistrationProgressBar";
import RegisterCompletedView from "@/components/register/RegisterCompletedView";
import RegisterSkipNotice from "@/components/register/RegisterSkipNotice";
import RegisterToast from "@/components/register/RegisterToast";
import Step2PersonalForm from "@/components/register/steps/Step2PersonalForm";
import Step3StagesCards from "@/components/register/steps/Step3StagesCards";
import Step4AssetsCards from "@/components/register/steps/Step4AssetsCards";
import { useRegisterWizard } from "@/components/register/useRegisterWizard";

export default function RegisterWizard() {
  const wizard = useRegisterWizard();

  const stepContent = wizard.completed ? (
    <RegisterCompletedView />
  ) : wizard.step === 1 ? (
    <Step2PersonalForm
      data={wizard.step2Data}
      estimatedLifeExpectancy={wizard.estimatedLifeExpectancy}
      currencyOptions={wizard.onboardingReferences.currencyOptions}
      smokingOptions={wizard.onboardingReferences.smokingOptions}
      physicalActivityOptions={
        wizard.onboardingReferences.physicalActivityOptions
      }
      dietQualityOptions={wizard.onboardingReferences.dietQualityOptions}
      alcoholConsumptionOptions={
        wizard.onboardingReferences.alcoholConsumptionOptions
      }
      error={wizard.error}
      referenceError={wizard.onboardingReferences.error}
      isReferenceLoading={
        wizard.onboardingReferences.isLoading || wizard.isUserContextLoading
      }
      isSubmitting={wizard.saving}
      onNext={wizard.handlePersonalNext}
      onChange={wizard.updateStep2}
    />
  ) : wizard.step === 2 ? (
    <Step3StagesCards
      stages={wizard.draft.stages}
      error={wizard.error}
      isSubmitting={wizard.saving}
      onBack={() => wizard.goToStep(1)}
      onNext={wizard.handleStagesNext}
      onChange={wizard.updateStages}
    />
  ) : (
    <Step4AssetsCards
      assets={wizard.draft.assets}
      assetTypeOptions={wizard.onboardingReferences.assetTypeOptions}
      error={wizard.error}
      referenceError={wizard.onboardingReferences.error}
      isReferenceLoading={wizard.onboardingReferences.isLoading}
      isSubmitting={wizard.saving}
      onBack={() => wizard.goToStep(2)}
      onSubmit={wizard.handleAssetsSubmit}
      onChange={wizard.updateAssets}
    />
  );

  const transitionKey = wizard.completed ? "completed" : `step-${wizard.step}`;

  return (
    <div className="relative mx-auto max-w-3xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8 lg:p-10">
      {!wizard.completed ? (
        <RegisterSkipNotice
          disabled={wizard.saving}
          onSkip={wizard.goToAccount}
        />
      ) : null}
      <RegistrationProgressBar
        steps={wizard.onboardingSteps}
        currentStep={wizard.step}
      />
      <AnimatedPanel key={transitionKey}>{stepContent}</AnimatedPanel>

      <RegisterToast message={wizard.toastMessage} />
    </div>
  );
}
