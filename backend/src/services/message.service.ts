import { prisma } from "../db/prisma.js";

export interface CreateMessageData {
  userId: string;
  originalThought: string;
  recipient: string;
  communicationGoal?: string;
  channel?: string;
  tone: string;
  length: string;
  roughDraft?: string;
  generatedMessage: string;
  rationale: string;
  alternative: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextAnalysis?: any;
}

export class MessageService {
  static async create(data: CreateMessageData) {
    return prisma.message.create({
      data: {
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
        contextAnalysis: data.contextAnalysis || undefined,
      },
    });
  }

  static async listUserMessages(userId: string, options?: { onlyFavorites?: boolean; limit?: number }) {
    return prisma.message.findMany({
      where: {
        userId,
        ...(options?.onlyFavorites ? { isFavorite: true } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit || 50,
    });
  }

  static async getMessage(id: string, userId: string) {
    return prisma.message.findFirst({
      where: { id, userId },
    });
  }

  static async toggleFavorite(id: string, userId: string) {
    const existing = await prisma.message.findFirst({
      where: { id, userId },
    });
    if (!existing) return null;

    return prisma.message.update({
      where: { id },
      data: { isFavorite: !existing.isFavorite },
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.message.findFirst({
      where: { id, userId },
    });
    if (!existing) return false;

    await prisma.message.delete({
      where: { id },
    });
    return true;
  }
}
