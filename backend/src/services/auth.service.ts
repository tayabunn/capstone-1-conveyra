import { prisma } from "../db/prisma.js";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return key === hash;
}

export class AuthService {
  static async register(name: string | undefined, email: string, password: string) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      throw new Error("User already exists with this email.");
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        passwordHash,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async updatePreferences(
    userId: string,
    prefs: { name?: string; defaultTone?: string; defaultLength?: string; defaultChannel?: string }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: prefs,
    });
  }
}
