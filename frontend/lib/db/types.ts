import type { CommunicationContextOutput } from "@/lib/schemas";

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  defaultTone?: string;
  defaultLength?: string;
  defaultChannel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBMessage {
  id: string;
  userId: string;
  originalThought: string;
  recipient: string;
  communicationGoal: string;
  channel: string;
  tone: string;
  length: string;
  roughDraft?: string;
  generatedMessage: string;
  rationale: string;
  alternative: string;
  contextAnalysis?: CommunicationContextOutput | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string;
}

export interface CreateMessageInput {
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
  contextAnalysis?: CommunicationContextOutput | null;
  isFavorite?: boolean;
}
