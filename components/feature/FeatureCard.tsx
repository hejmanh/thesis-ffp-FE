import Link from "next/link";
import { Icon } from "@iconify/react";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import type { FeatureItem } from "@/types/feature";

export default function FeatureCard({
  id,
  icon,
  title,
  description,
  placeholder,
  ctaText,
  href = "#",
}: FeatureItem) {
  return (
    <Card className="p-4 sm:p-5 xl:p-6">
      <span className="mb-3 inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary sm:mb-4">
        {id}
      </span>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-[76px_1fr] xl:grid-cols-[88px_1fr]">
        <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-primary-soft xl:h-[88px] xl:w-[88px]">
          <Icon icon={icon} className="h-9 w-9 text-primary xl:h-10 xl:w-10" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 xl:text-xl">{title}</h3>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{description}</p>
          <Input className="mt-3 xl:mt-4" placeholder={placeholder} readOnly />
          <Link
            href={href}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-600 xl:mt-3"
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
