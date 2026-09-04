import { z } from "zod";

/**
 * Canonical generator input schema
 */
export const generateMessageSchema = z.object({
  context: z
    .string()
    .min(10, "Please provide a bit more detail (at least 10 characters).")
    .max(2000, "Please keep the description under 2,000 characters."),
  recipient: z.enum(["manager", "client", "colleague", "friend", "family", "other"], {
    message: "Please select a valid recipient.",
  }),
  tone: z.enum(["professional", "friendly", "direct", "empathetic"], {
    message: "Please select a valid tone.",
  }),
  length: z.enum(["short", "medium", "detailed"], {
    message: "Please select a valid length.",
  }),
  draft: z
    .string()
    .max(2000, "Please keep your draft under 2,000 characters.")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export type GenerateMessageInput = z.infer<typeof generateMessageSchema>;

/**
 * Zod Input Schema for analyzeCommunicationContext tool
 */
export const communicationContextInputSchema = z.object({
  rawThought: z
    .string()
    .min(10, "Raw thought must contain at least 10 characters.")
    .max(2000, "Raw thought must be under 2,000 characters.")
    .describe("The user's raw, unfiltered thought or situation description."),
  recipient: z
    .string()
    .min(1, "Recipient is required.")
    .describe("Target audience or relationship dynamic (e.g. manager, client, colleague, friend)."),
  tone: z
    .string()
    .min(1, "Tone is required.")
    .describe("Desired emotional resonance and demeanor (e.g. professional, direct, friendly, empathetic)."),
  length: z
    .string()
    .min(1, "Length is required.")
    .describe("Desired output length constraint (e.g. short, medium, detailed)."),
  draft: z
    .string()
    .max(2000)
    .optional()
    .describe("Optional rough draft or starting message provided by the user."),
});

export type CommunicationContextInput = z.infer<typeof communicationContextInputSchema>;

/**
 * Zod Output Schema for analyzeCommunicationContext tool
 */
export const communicationContextOutputSchema = z.object({
  communicationType: z
    .string()
    .min(1)
    .describe("Categorization of the communication intent (e.g. Boundary-setting, Status Update, Direct Request)."),
  sensitivity: z
    .enum(["low", "medium", "high"])
    .describe("The relational or emotional sensitivity of the message."),
  formality: z
    .enum(["casual", "professional", "formal"])
    .describe("Appropriate level of social formality required for the recipient."),
  urgency: z
    .enum(["low", "medium", "high"])
    .describe("Perceived time sensitivity and priority."),
  risks: z
    .array(z.string().min(1))
    .min(1)
    .describe("Identified interpersonal or professional risks to avoid in phrasing."),
  recommendedFocus: z
    .array(z.string().min(1))
    .min(1)
    .describe("Actionable focal points to prioritize in the final message."),
});

export type CommunicationContextOutput = z.infer<typeof communicationContextOutputSchema>;

/**
 * Response schema for generated message output, extended with optional structured context analysis
 */
export const generateMessageResponseSchema = z.object({
  message: z.string().min(1),
  approach: z.string().min(1),
  alternative: z.string().min(1),
  contextAnalysis: communicationContextOutputSchema.optional(),
});

export type GenerateMessageResponse = z.infer<typeof generateMessageResponseSchema>;
