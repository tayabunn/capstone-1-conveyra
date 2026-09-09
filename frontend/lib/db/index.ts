import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DBUser, DBMessage, CreateUserInput, CreateMessageInput } from "./types";
import { createClient } from "@/lib/supabase/server";

interface StorageData {
  users: DBUser[];
  messages: DBMessage[];
}

let inMemoryStore: StorageData = {
  users: [],
  messages: [],
};

const STORAGE_FILE = path.join(process.cwd(), ".data", "conveyra-db.json");

function loadStore(): StorageData {
  if (inMemoryStore.users.length > 0 || inMemoryStore.messages.length > 0) {
    return inMemoryStore;
  }

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      inMemoryStore = JSON.parse(raw);
    }
  } catch {
    // Fallback to empty in-memory store
  }

  return inMemoryStore;
}

function persistStore(): void {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(inMemoryStore, null, 2), "utf-8");
  } catch {
    // Read-only serverless environment fallback
  }
}

// ==========================================
// USER REPOSITORY
// ==========================================

export async function createUser(data: CreateUserInput): Promise<DBUser> {
  const store = loadStore();
  const existing = store.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    throw new Error("A user with this email address already exists.");
  }

  const now = new Date().toISOString();
  const newUser: DBUser = {
    id: crypto.randomUUID(),
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    name: data.name || data.email.split("@")[0],
    defaultTone: "professional",
    defaultLength: "medium",
    defaultChannel: "email",
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(newUser);
  persistStore();
  return newUser;
}

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const store = loadStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function findUserById(id: string): Promise<DBUser | null> {
  const store = loadStore();
  const user = store.users.find((u) => u.id === id);
  return user || null;
}

export async function updateUserPreferences(
  userId: string,
  prefs: { name?: string; defaultTone?: string; defaultLength?: string; defaultChannel?: string }
): Promise<DBUser | null> {
  const store = loadStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;

  if (prefs.name !== undefined) user.name = prefs.name;
  if (prefs.defaultTone !== undefined) user.defaultTone = prefs.defaultTone;
  if (prefs.defaultLength !== undefined) user.defaultLength = prefs.defaultLength;
  if (prefs.defaultChannel !== undefined) user.defaultChannel = prefs.defaultChannel;
  user.updatedAt = new Date().toISOString();

  persistStore();
  return user;
}

// ==========================================
// SUPABASE / POSTGRES PERSISTENCE HELPERS
// ==========================================

import type { CommunicationContextOutput } from "@/lib/schemas";

interface SupabaseMessageRow {
  id: string;
  user_id: string;
  original_thought: string;
  recipient: string;
  communication_goal: string;
  channel: string;
  tone: string;
  length: string;
  rough_draft: string | null;
  generated_message: string;
  rationale: string;
  alternative: string;
  context_analysis: CommunicationContextOutput | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

function mapRowToMessage(row: SupabaseMessageRow): DBMessage {
  return {
    id: row.id,
    userId: row.user_id,
    originalThought: row.original_thought,
    recipient: row.recipient,
    communicationGoal: row.communication_goal,
    channel: row.channel,
    tone: row.tone,
    length: row.length,
    roughDraft: row.rough_draft || undefined,
    generatedMessage: row.generated_message,
    rationale: row.rationale,
    alternative: row.alternative,
    contextAnalysis: row.context_analysis || null,
    isFavorite: row.is_favorite,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ==========================================
// MESSAGE REPOSITORY (STRICT USER-SCOPED)
// ==========================================

export async function createMessage(data: CreateMessageInput): Promise<DBMessage> {
  const now = new Date().toISOString();
  const generatedId = crypto.randomUUID();

  // 1. Try persisting to Supabase PostgreSQL
  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({
        id: generatedId,
        user_id: data.userId,
        original_thought: data.originalThought,
        recipient: data.recipient,
        communication_goal: data.communicationGoal || "Request action",
        channel: data.channel || "Email",
        tone: data.tone,
        length: data.length,
        rough_draft: data.roughDraft || null,
        generated_message: data.generatedMessage,
        rationale: data.rationale,
        alternative: data.alternative,
        context_analysis: data.contextAnalysis || null,
        is_favorite: data.isFavorite ?? false,
      })
      .select()
      .single();

    if (!error && inserted) {
      return mapRowToMessage(inserted as SupabaseMessageRow);
    }
  } catch {
    // Supabase query fallback
  }

  // 2. Fallback to resilient local store
  const store = loadStore();
  const newMessage: DBMessage = {
    id: generatedId,
    userId: data.userId,
    originalThought: data.originalThought,
    recipient: data.recipient,
    communicationGoal: data.communicationGoal || "Request action",
    channel: data.channel || "Email",
    tone: data.tone,
    length: data.length,
    roughDraft: data.roughDraft,
    generatedMessage: data.generatedMessage,
    rationale: data.rationale,
    alternative: data.alternative,
    contextAnalysis: data.contextAnalysis || null,
    isFavorite: data.isFavorite ?? false,
    createdAt: now,
    updatedAt: now,
  };

  store.messages.unshift(newMessage);
  persistStore();
  return newMessage;
}

/**
 * Returns messages belonging strictly to the authenticated user.
 */
export async function getMessagesByUserId(
  userId: string,
  options?: { onlyFavorites?: boolean; limit?: number }
): Promise<DBMessage[]> {
  // 1. Try Supabase PostgreSQL with RLS
  try {
    const supabase = await createClient();
    let query = supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (options?.onlyFavorites) {
      query = query.eq("is_favorite", true);
    }
    if (options?.limit && options.limit > 0) {
      query = query.limit(options.limit);
    }

    const { data: rows, error } = await query;
    if (!error && rows && rows.length > 0) {
      return (rows as SupabaseMessageRow[]).map(mapRowToMessage);
    }
  } catch {
    // Supabase query fallback
  }

  // 2. Fallback to resilient local store
  const store = loadStore();
  let userMessages = store.messages.filter((m) => m.userId === userId);

  if (options?.onlyFavorites) {
    userMessages = userMessages.filter((m) => m.isFavorite);
  }

  userMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (options?.limit && options.limit > 0) {
    userMessages = userMessages.slice(0, options.limit);
  }

  return userMessages;
}

/**
 * Retrieves a single message, guaranteeing user ownership.
 */
export async function getMessageById(id: string, userId: string): Promise<DBMessage | null> {
  // 1. Try Supabase PostgreSQL with strict user_id filtering
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && row) {
      return mapRowToMessage(row as SupabaseMessageRow);
    }
  } catch {
    // Supabase query fallback
  }

  // 2. Fallback to resilient local store
  const store = loadStore();
  const message = store.messages.find((m) => m.id === id && m.userId === userId);
  return message || null;
}

/**
 * Toggles favorite state with strict user ownership verification.
 */
export async function toggleFavoriteMessage(id: string, userId: string): Promise<DBMessage | null> {
  // 1. Try Supabase PostgreSQL
  try {
    const current = await getMessageById(id, userId);
    if (current) {
      const nextFavorite = !current.isFavorite;
      const supabase = await createClient();
      const { data: updated, error } = await supabase
        .from("messages")
        .update({
          is_favorite: nextFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (!error && updated) {
        return mapRowToMessage(updated as SupabaseMessageRow);
      }
    }
  } catch {
    // Supabase query fallback
  }

  // 2. Fallback to resilient local store
  const store = loadStore();
  const message = store.messages.find((m) => m.id === id && m.userId === userId);
  if (!message) return null;

  message.isFavorite = !message.isFavorite;
  message.updatedAt = new Date().toISOString();
  persistStore();
  return message;
}

/**
 * Deletes a message with strict user ownership verification.
 */
export async function deleteMessage(id: string, userId: string): Promise<boolean> {
  // 1. Try Supabase PostgreSQL
  try {
    const supabase = await createClient();
    const { error, count } = await supabase
      .from("messages")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("user_id", userId);

    if (!error && typeof count === "number" && count > 0) {
      return true;
    }
  } catch {
    // Supabase query fallback
  }

  // 2. Fallback to resilient local store
  const store = loadStore();
  const initialLength = store.messages.length;
  store.messages = store.messages.filter((m) => !(m.id === id && m.userId === userId));

  const deleted = store.messages.length < initialLength;
  if (deleted) {
    persistStore();
  }
  return deleted;
}
