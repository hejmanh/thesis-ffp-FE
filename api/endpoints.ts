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
    listCountries: "/reference/countries",
    listSexTypes: "/reference/sex-types",
  },
} as const;
