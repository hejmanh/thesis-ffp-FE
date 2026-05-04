export interface SessionUser {
  id: string;
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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterStep1Payload {
  email: string;
  password: string;
  birthYear: number;
  country: string;
  sex: string;
}
