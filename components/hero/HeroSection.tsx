import Badge from "@/components/common/Badge";

export default function HeroSection() {
  return (
    <section className="relative px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
      <Badge>SMART PLANNING, FREER FUTURE</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        Plan Your Financial Freedom
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Confused about your financial planning? Don&apos;t worry. Answer a few
        simple questions and get clear insights to take control of your future.
      </p>
      <div className="absolute right-6 top-12 hidden items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 shadow-md lg:flex">
        <span className="text-xs text-slate-500">AI</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
          A
        </span>
      </div>
    </section>
  );
}
