import MainLayout from "@/layouts/MainLayout";

interface ScenarioPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { slug } = await params;

  return (
    <MainLayout>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-8 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)]">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Scenario: {slug.replaceAll("-", " ")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Scenario route scaffold is ready for future financial calculation logic.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
