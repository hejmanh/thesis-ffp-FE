import FeatureCard from "@/components/feature/FeatureCard";
import type { FeatureItem } from "@/types/feature";

interface FeatureGridProps {
  features: FeatureItem[];
  onCardClick?: () => void;
}

export default function FeatureGrid({ features, onCardClick }: FeatureGridProps) {
  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
      <div className="grid grid-cols-1 gap-4 lg:gap-5 md:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} onCardClick={onCardClick} />
        ))}
      </div>
    </section>
  );
}
