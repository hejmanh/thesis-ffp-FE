export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    verifyEmail: "/auth/verify-email",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
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
} as const;
