import MainLayout from "@/layouts/MainLayout";
import RegisterAccountForm from "@/components/register/RegisterAccountForm";

export default function RegisterPage() {
  return (
    <MainLayout hideLoginButton hideRegisterButton>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <RegisterAccountForm />
      </section>
    </MainLayout>
  );
}
