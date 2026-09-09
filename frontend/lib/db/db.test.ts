import { describe, it, expect } from "vitest";
import {
  createUser,
  findUserByEmail,
  findUserById,
  createMessage,
  getMessagesByUserId,
  getMessageById,
  toggleFavoriteMessage,
  deleteMessage,
} from "./index";

describe("Database Layer & Strict User Ownership", () => {
  it("should create and find a user by email and id", async () => {
    const email = `test-${Date.now()}@conveyra.com`;
    const user = await createUser({
      email,
      passwordHash: "hash123",
      name: "Alex User",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.name).toBe("Alex User");

    const foundByEmail = await findUserByEmail(email);
    expect(foundByEmail?.id).toBe(user.id);

    const foundById = await findUserById(user.id);
    expect(foundById?.email).toBe(email);
  });

  it("should prevent creating duplicate users with the same email", async () => {
    const email = `duplicate-${Date.now()}@conveyra.com`;
    await createUser({ email, passwordHash: "h1" });

    await expect(createUser({ email, passwordHash: "h2" })).rejects.toThrow(
      "A user with this email address already exists."
    );
  });

  it("should enforce strict user ownership for messages", async () => {
    const userA = await createUser({ email: `userA-${Date.now()}@conveyra.com`, passwordHash: "h" });
    const userB = await createUser({ email: `userB-${Date.now()}@conveyra.com`, passwordHash: "h" });

    // User A creates a message
    const msgA = await createMessage({
      userId: userA.id,
      originalThought: "Need to push back on scope",
      recipient: "client",
      communicationGoal: "Set a boundary",
      channel: "Email",
      tone: "professional",
      length: "short",
      generatedMessage: "Thanks for reaching out...",
      rationale: "Clear boundary setting",
      alternative: "Alternative phrasing",
    });

    // User A can access their message
    const foundByOwner = await getMessageById(msgA.id, userA.id);
    expect(foundByOwner).not.toBeNull();
    expect(foundByOwner?.id).toBe(msgA.id);

    // User B CANNOT access User A's message (Returns null)
    const unauthorizedAccess = await getMessageById(msgA.id, userB.id);
    expect(unauthorizedAccess).toBeNull();

    // User B's list should not include User A's messages
    const userBMessages = await getMessagesByUserId(userB.id);
    expect(userBMessages.some((m) => m.id === msgA.id)).toBe(false);

    // User A toggles favorite
    const favorited = await toggleFavoriteMessage(msgA.id, userA.id);
    expect(favorited?.isFavorite).toBe(true);

    // User B CANNOT toggle favorite or delete User A's message
    const unauthorizedToggle = await toggleFavoriteMessage(msgA.id, userB.id);
    expect(unauthorizedToggle).toBeNull();

    const unauthorizedDelete = await deleteMessage(msgA.id, userB.id);
    expect(unauthorizedDelete).toBe(false);

    // User A can delete their message
    const deleted = await deleteMessage(msgA.id, userA.id);
    expect(deleted).toBe(true);
  });

  it("should filter messages by favorite state correctly", async () => {
    const user = await createUser({ email: `fav-${Date.now()}@conveyra.com`, passwordHash: "h" });

    await createMessage({
      userId: user.id,
      originalThought: "Thought 1",
      recipient: "manager",
      tone: "direct",
      length: "short",
      generatedMessage: "Msg 1",
      rationale: "Rationale 1",
      alternative: "Alt 1",
      isFavorite: false,
    });

    const msg2 = await createMessage({
      userId: user.id,
      originalThought: "Thought 2",
      recipient: "colleague",
      tone: "friendly",
      length: "medium",
      generatedMessage: "Msg 2",
      rationale: "Rationale 2",
      alternative: "Alt 2",
      isFavorite: true,
    });

    const all = await getMessagesByUserId(user.id);
    expect(all.length).toBe(2);

    const favoritesOnly = await getMessagesByUserId(user.id, { onlyFavorites: true });
    expect(favoritesOnly.length).toBe(1);
    expect(favoritesOnly[0].id).toBe(msg2.id);
  });
});
