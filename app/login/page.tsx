import MainLayout from "@/layouts/MainLayout";

export default function LoginPage() {
  return (
    <MainLayout>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-surface p-8 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)]">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Log In</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Login page scaffold is ready for form integration.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
