export interface SessionUser {
  id: string;
  name?: string;
  email: string;
  birthYear?: number;
  country?: string;
  sex?: string;
}

export interface SessionData {
  token: string;
  user: SessionUser;
  loggedInAt: string;
}

export interface AuthUser {
  id?: string;
  name?: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: AuthUser;
  isFirstLogin: boolean;
}

export interface RefreshResponseData {
  accessToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  birthYear: number;
  countryId: number;
  sexTypeId: number;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export type EmptyResponseData = null;

export interface RegisterStep1Payload {
  name: string;
  email: string;
  password: string;
  birthYear: number;
  country: string;
  sex: string;
}
