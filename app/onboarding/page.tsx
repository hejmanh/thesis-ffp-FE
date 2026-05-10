import RegisterWizard from "@/components/register/RegisterWizard";
import MainLayout from "@/layouts/MainLayout";

export default function OnboardingPage() {
  return (
    <MainLayout hideLoginButton hideRegisterButton>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <RegisterWizard />
      </section>
    </MainLayout>
  );
}
