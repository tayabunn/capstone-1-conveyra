import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DBUser, DBMessage, CreateUserInput, CreateMessageInput } from "./types";

interface StorageData {
  users: DBUser[];
  messages: DBMessage[];
}

// In-memory / persistent file storage for zero-dependency local & serverless resilience
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
    // In serverless environments where disk is read-only, inMemoryStore handles active state
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
// MESSAGE REPOSITORY (STRICT USER-SCOPED)
// ==========================================

export async function createMessage(data: CreateMessageInput): Promise<DBMessage> {
  const store = loadStore();
  const now = new Date().toISOString();

  const newMessage: DBMessage = {
    id: crypto.randomUUID(),
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
  const store = loadStore();
  let userMessages = store.messages.filter((m) => m.userId === userId);

  if (options?.onlyFavorites) {
    userMessages = userMessages.filter((m) => m.isFavorite);
  }

  // Sort descending by creation date
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
  const store = loadStore();
  const message = store.messages.find((m) => m.id === id && m.userId === userId);
  return message || null;
}

/**
 * Toggles favorite state with strict user ownership verification.
 */
export async function toggleFavoriteMessage(id: string, userId: string): Promise<DBMessage | null> {
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
  const store = loadStore();
  const initialLength = store.messages.length;
  store.messages = store.messages.filter((m) => !(m.id === id && m.userId === userId));
  
  const deleted = store.messages.length < initialLength;
  if (deleted) {
    persistStore();
  }
  return deleted;
}
