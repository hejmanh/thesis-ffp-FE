"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

export default function RegisterCompletedView() {
  const router = useRouter();

  return (
    <div className="py-16 text-center">
      <h2 className="text-4xl font-bold text-primary">Onboarding Complete</h2>
      <p className="mt-4 text-md text-muted-foreground">
        Your profile has been saved. You can now proceed to financial
        planning tools.
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          className="h-12 rounded-full px-8 text-base"
          onClick={() => router.push("/profile")}
        >
          Start Your Financial Journey
        </Button>
      </div>
    </div>
  );
}
