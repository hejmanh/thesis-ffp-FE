interface OnboardingAccessInput {
  isAuthenticated: boolean;
  hasAccessToken: boolean;
}

export function canAccessOnboardingSteps(input: OnboardingAccessInput): boolean {
  return input.isAuthenticated || input.hasAccessToken;
}
