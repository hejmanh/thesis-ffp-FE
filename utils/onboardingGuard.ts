import type { SessionData } from "@/types/auth";

export function canAccessOnboardingSteps(session: SessionData | null): boolean {
  return Boolean(session?.user?.id);
}
