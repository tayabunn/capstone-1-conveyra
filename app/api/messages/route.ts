import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getMessagesByUserId, createMessage } from "@/lib/db";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const onlyFavorites = searchParams.get("favorites") === "true";
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const messages = await getMessagesByUserId(user.id, { onlyFavorites, limit });
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const message = await createMessage({
      ...body,
      userId: user.id, // Strictly server-assigned user identity
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Failed to save message" }, { status: 500 });
  }
}
