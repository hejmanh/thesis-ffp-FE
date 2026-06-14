export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    verifyEmail: "/auth/verify-email",
    resendVerificationEmail: "/auth/resend-verification-email",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    updatePassword: "/auth/update-password",
  },
  reference: {
    currencies: "/reference/currencies",
    countries: "/reference/countries",
    sexTypes: "/reference/sex-types",
    assetTypes: "/reference/asset-types",
    lifeStageRanges: "/reference/life-stage-ranges",
    smokingTypes: "/reference/smoking-types",
    physicalActivityTypes: "/reference/physical-activity-types",
    dietQualityTypes: "/reference/diet-quality-types",
    alcoholConsumptionTypes: "/reference/alcohol-consumption-types",
  },
  userInfo: {
    financial: "/user-info/financial",
    me: "/user-info/me",
    lifeStages: "/user-info/life-stages",
    assets: "/user-info/assets",
    assetByUid: (uid: string) => `/user-info/assets/${uid}`,
  },
  scenario1: {
    input: "/scenario-1/input",
    output: "/scenario-1/output",
  },
  scenario2: {
    input: "/scenario-2/input",
    output: "/scenario-2/output",
  },
  scenario3: {
    input: "/scenario-3/input",
    output: "/scenario-3/output",
  },
  scenario4: {
    input: "/scenario-4/input",
    output: "/scenario-4/output",
  },
} as const;
