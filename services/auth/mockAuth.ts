"use client";

// ⚠️ MOCK AUTH - DEVELOPMENT ONLY
// This is for demo/testing purposes only. Do NOT use in production.
// In production, all authentication must be server-side with proper security.

import type {
  LoginPayload,
  RegisterStep1Payload,
  SessionData,
  SessionUser,
} from "@/types/auth";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";

const SESSION_COOKIE = "coinfused_mock_session";
const USERS_KEY = "coinfused_mock_users";

// Demo users - passwords are NOT persisted, only stored in memory during session
interface StoredUser extends SessionUser {
  // Password is NEVER stored in localStorage - only kept in-memory for this session
}

// In-memory registry to validate logins (cleared on page refresh)
const inMemoryUsers = new Map<string, { email: string; passwordHash: string }>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Read user data WITHOUT passwords from localStorage
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

// Write user data (WITHOUT passwords) to localStorage
function writeUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple hash for demo purposes (NOT production-grade)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
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
  const newUserId = crypto.randomUUID();
  const newUser: StoredUser = {
    id: newUserId,
    name: payload.name,
    email: payload.email,
    birthYear: payload.birthYear,
    country: payload.country,
    sex: payload.sex,
  };
  writeUsers([...users, newUser]);
  
  // Store password hash in-memory only (cleared on page refresh)
  inMemoryUsers.set(newUserId, {
    email: payload.email,
    passwordHash: simpleHash(payload.password),
  });

  return newUser;
}

export async function login(payload: LoginPayload): Promise<SessionData> {
  await sleep(600);
  const users = readUsers();
  const match = users.find(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase()
  );
  if (!match) {
    throw new Error("Invalid email or password.");
  }

  // Verify password against in-memory hash
  const storedHash = inMemoryUsers.get(match.id);
  if (!storedHash || storedHash.passwordHash !== simpleHash(payload.password)) {
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

export function clearAllMockData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USERS_KEY);
  inMemoryUsers.clear();
  console.warn(
    "⚠️ All mock auth data cleared. This is a development-only utility."
  );
}
