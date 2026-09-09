import { cookies } from "next/headers";
import { verifySessionToken, type SessionPayload } from "./crypto";
import { findUserById } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export const SESSION_COOKIE_NAME = "conveyra_session";

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  defaultTone?: string;
  defaultLength?: string;
  defaultChannel?: string;
}

/**
 * Extracts and verifies the session from cookies or headers in Server Components / Route Handlers.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  // 1. Check Supabase Auth via SSR
  try {
    const supabase = await createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.email) {
      return {
        userId: user.id,
        email: user.email,
        name: (user.user_metadata?.name as string) || user.email.split("@")[0],
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      };
    }
  } catch {
    // Supabase auth check fallback
  }

  // 2. Fallback to custom session cookie
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  return verifySessionToken(sessionCookie);
}

/**
 * Fetches the user object for the currently authenticated session.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getSession();
  if (!session) return null;

  // Attempt to enrich with DB user profile if available
  try {
    const dbUser = await findUserById(session.userId);
    if (dbUser) {
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name || session.name || undefined,
        createdAt: dbUser.createdAt,
        defaultTone: dbUser.defaultTone || "professional",
        defaultLength: dbUser.defaultLength || "medium",
        defaultChannel: dbUser.defaultChannel || "email",
      };
    }
  } catch {
    // Database query fallback
  }

  // Return standard authenticated user object from session
  return {
    id: session.userId,
    email: session.email,
    name: session.name || session.email.split("@")[0],
    createdAt: new Date().toISOString(),
    defaultTone: "professional",
    defaultLength: "medium",
    defaultChannel: "email",
  };
}
