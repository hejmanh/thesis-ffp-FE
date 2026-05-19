interface OnboardingAccessInput {
  isAuthenticated: boolean;
  hasAccessToken: boolean;
  hasRegistrationAccess?: boolean;
}

export function canAccessOnboardingSteps(input: OnboardingAccessInput): boolean {
  return (
    input.isAuthenticated ||
    input.hasAccessToken ||
    input.hasRegistrationAccess === true
  );
}
