"use client";

import type {
  LoginPayload,
  RegisterStep1Payload,
  SessionData,
  SessionUser,
} from "@/types/auth";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";

const SESSION_COOKIE = "coinfused_mock_session";
const USERS_KEY = "coinfused_mock_users";

interface StoredUser extends SessionUser {
  password: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createSession(user: SessionUser): SessionData {
  return {
    token: `mock_${user.id}_${Date.now()}`,
    user,
    loggedInAt: new Date().toISOString(),
  };
}

function persistSession(session: SessionData): void {
  setCookie(SESSION_COOKIE, JSON.stringify(session), 7);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("coinfused-auth-changed"));
  }
}

export async function registerStep1(payload: RegisterStep1Payload): Promise<SessionUser> {
  await sleep(700);
  const users = readUsers();
  if (users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error("This email has already been registered.");
  }
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    password: payload.password,
    birthYear: payload.birthYear,
    country: payload.country,
    sex: payload.sex,
  };
  writeUsers([...users, newUser]);
  const sessionUser: SessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    birthYear: newUser.birthYear,
    country: newUser.country,
    sex: newUser.sex,
  };
  return sessionUser;
}

export async function login(payload: LoginPayload): Promise<SessionData> {
  await sleep(600);
  const users = readUsers();
  const match = users.find(
    (user) =>
      user.email.toLowerCase() === payload.email.toLowerCase() &&
      user.password === payload.password
  );
  if (!match) {
    throw new Error("Invalid email or password.");
  }
  const sessionUser: SessionUser = {
    id: match.id,
    name: match.name,
    email: match.email,
    birthYear: match.birthYear,
    country: match.country,
    sex: match.sex,
  };
  const session = createSession(sessionUser);
  persistSession(session);
  return session;
}

export async function autoLoginByEmail(email: string): Promise<SessionData> {
  await sleep(1200);
  const users = readUsers();
  const match = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (!match) {
    throw new Error("Unable to auto-login this account.");
  }
  const sessionUser: SessionUser = {
    id: match.id,
    name: match.name,
    email: match.email,
    birthYear: match.birthYear,
    country: match.country,
    sex: match.sex,
  };
  const session = createSession(sessionUser);
  persistSession(session);
  return session;
}

export function getSession(): SessionData | null {
  const raw = getCookie(SESSION_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function logout(): void {
  deleteCookie(SESSION_COOKIE);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("coinfused-auth-changed"));
  }
}
