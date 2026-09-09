import { createUser, findUserByEmail, findUserById, updateUserPreferences } from "@/lib/db";
import { hashPassword, verifyPassword, createSessionToken } from "@/lib/auth/crypto";
import type { DBUser } from "@/lib/db/types";

export class AuthService {
  static async register(name: string | undefined, email: string, password: string):Promise<{ user: Omit<DBUser, "passwordHash">; token: string }> {
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new Error("User already exists with this email.");
    }

    const passwordHash = hashPassword(password);
    const user = await createUser({ name, email, passwordHash });
    const token = createSessionToken({ userId: user.id, email: user.email, name: user.name });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async login(email: string, password: string): Promise<{ user: Omit<DBUser, "passwordHash">; token: string }> {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password.");
    }

    const token = createSessionToken({ userId: user.id, email: user.email, name: user.name });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getProfile(userId: string): Promise<Omit<DBUser, "passwordHash"> | null> {
    const user = await findUserById(userId);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async updatePreferences(userId: string, prefs: { name?: string; defaultTone?: string; defaultLength?: string; defaultChannel?: string }) {
    return updateUserPreferences(userId, prefs);
  }
}
