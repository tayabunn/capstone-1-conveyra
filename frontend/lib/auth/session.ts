import { cookies } from "next/headers";
import { verifySessionToken, type SessionPayload } from "./crypto";
import { findUserById } from "@/lib/db";
import type { DBUser } from "@/lib/db/types";

export const SESSION_COOKIE_NAME = "conveyra_session";

/**
 * Extracts and verifies the session from cookies or headers in Server Components / Route Handlers.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  return verifySessionToken(sessionCookie);
}

/**
 * Fetches the full DBUser for the currently authenticated session.
 */
export async function getCurrentUser(): Promise<Omit<DBUser, "passwordHash"> | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}
