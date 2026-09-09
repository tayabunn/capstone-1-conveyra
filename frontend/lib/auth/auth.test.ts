import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "./crypto";

describe("Authentication Crypto Utilities", () => {
  it("should hash and verify passwords correctly", () => {
    const password = "superSecretPassword123!";
    const hash = hashPassword(password);

    expect(hash).toContain(":");
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("wrongPassword", hash)).toBe(false);
  });

  it("should generate and verify JWT session tokens", () => {
    const payload = {
      userId: "usr_12345",
      email: "test@conveyra.com",
      name: "Test User",
    };

    const token = createSessionToken(payload, 3600);
    expect(token).toBeDefined();
    expect(token.split(".").length).toBe(3);

    const verified = verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("usr_12345");
    expect(verified?.email).toBe("test@conveyra.com");
    expect(verified?.name).toBe("Test User");
  });

  it("should reject tampered or invalid JWT tokens", () => {
    const token = createSessionToken({ userId: "u1", email: "a@b.com" });
    const tampered = token.slice(0, -5) + "abcde";

    expect(verifySessionToken(tampered)).toBeNull();
    expect(verifySessionToken("invalid.token.structure")).toBeNull();
  });

  it("should reject expired session tokens", () => {
    // Generate a token that expired 10 seconds ago
    const expiredToken = createSessionToken({ userId: "u_expired", email: "old@conveyra.com" }, -10);
    expect(verifySessionToken(expiredToken)).toBeNull();
  });

  it("should create distinct hashes for identical passwords with unique salts", () => {
    const pwd = "identicalPassword123!";
    const hash1 = hashPassword(pwd);
    const hash2 = hashPassword(pwd);

    expect(hash1).not.toBe(hash2);
    expect(verifyPassword(pwd, hash1)).toBe(true);
    expect(verifyPassword(pwd, hash2)).toBe(true);
  });
});
