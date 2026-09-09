import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully." });

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase sign-out fallback
  }

  // Clear legacy cookie as well
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
