import {
  createMessage,
  getMessagesByUserId,
  getMessageById,
  toggleFavoriteMessage,
  deleteMessage,
} from "@/lib/db";
import type { CreateMessageInput, DBMessage } from "@/lib/db/types";

export class MessageService {
  static async create(data: CreateMessageInput): Promise<DBMessage> {
    return createMessage(data);
  }

  static async listUserMessages(userId: string, options?: { onlyFavorites?: boolean; limit?: number }): Promise<DBMessage[]> {
    return getMessagesByUserId(userId, options);
  }

  static async getMessage(id: string, userId: string): Promise<DBMessage | null> {
    return getMessageById(id, userId);
  }

  static async toggleFavorite(id: string, userId: string): Promise<DBMessage | null> {
    return toggleFavoriteMessage(id, userId);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    return deleteMessage(id, userId);
  }
}
