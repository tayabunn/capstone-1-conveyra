import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { toggleFavoriteMessage } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const updated = await toggleFavoriteMessage(id, user.id);
  if (!updated) {
    return NextResponse.json({ error: "Message not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: updated });
}
