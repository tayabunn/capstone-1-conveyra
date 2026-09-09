import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteMessage, getMessageById } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const message = await getMessageById(id, user.id);
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ message });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteMessage(id, user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Message not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Deleted successfully" });
}
