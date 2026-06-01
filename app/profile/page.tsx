import AccountLayout from "@/components/account/AccountLayout";
import MainLayout from "@/layouts/MainLayout";

export default function AccountPage() {
  return (
    <MainLayout hideRegisterButton>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <AccountLayout />
      </section>
    </MainLayout>
  );
}
