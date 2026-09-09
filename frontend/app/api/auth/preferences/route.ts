import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { updateUserPreferences } from "@/lib/db";
import { z } from "zod";

const preferencesSchema = z.object({
  name: z.string().optional(),
  defaultTone: z.string().optional(),
  defaultLength: z.string().optional(),
  defaultChannel: z.string().optional(),
});

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = preferencesSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
    }

    const updated = await updateUserPreferences(user.id, parseResult.data);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Failed to update preferences" }, { status: 500 });
  }
}
