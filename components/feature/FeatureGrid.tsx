import FeatureCard from "@/components/feature/FeatureCard";
import type { FeatureItem } from "@/types/feature";

interface FeatureGridProps {
  features: FeatureItem[];
  onCardClick?: () => void;
}

export default function FeatureGrid({ features, onCardClick }: FeatureGridProps) {
  return (
    <section className="px-6 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
      <div className="mx-auto grid grid-cols-1 gap-4 md:max-w-266 md:grid-cols-2 md:justify-items-center lg:gap-5">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} onCardClick={onCardClick} />
        ))}
      </div>
    </section>
  );
}
