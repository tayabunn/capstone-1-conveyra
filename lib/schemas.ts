import { z } from "zod";

export const channelOptions = [
  "email",
  "slack",
  "teams",
  "sms",
  "whatsapp",
  "linkedin",
] as const;

export type ChannelOption = (typeof channelOptions)[number];

export const goalOptions = [
  "request_action",
  "make_request",
  "seek_alignment",
  "set_boundary",
  "de_escalate",
  "give_feedback",
  "ask_clarification",
  "decline_politely",
  "follow_up",
] as const;

export type GoalOption = (typeof goalOptions)[number];

export const refinementOptions = [
  "make_warmer",
  "make_firmer",
  "make_shorter",
  "make_confident",
  "remove_fluff",
] as const;

export type RefinementOption = (typeof refinementOptions)[number];

export const modelProviderOptions = [
  "auto",
  "gemini",
  "groq",
  "cerebras",
  "openrouter",
  "github",
] as const;

export type ModelProviderOption = (typeof modelProviderOptions)[number];

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
  goal: z
    .enum([
      "request_action",
      "make_request",
      "seek_alignment",
      "set_boundary",
      "de_escalate",
      "give_feedback",
      "ask_clarification",
      "decline_politely",
      "follow_up",
    ])
    .default("request_action")
    .optional(),
  channel: z
    .enum(["email", "slack", "teams", "sms", "whatsapp", "linkedin"])
    .default("email")
    .optional(),
  tone: z.enum(["professional", "friendly", "direct", "empathetic"], {
    message: "Please select a valid tone.",
  }),
  length: z.enum(["short", "medium", "detailed"], {
    message: "Please select a valid length.",
  }),
  provider: z
    .enum(modelProviderOptions)
    .default("auto")
    .optional(),
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
  goal: z
    .string()
    .optional()
    .describe("Communication objective (e.g. Set a boundary, Request action, De-escalate)."),
  channel: z
    .string()
    .optional()
    .describe("Delivery channel conventions (e.g. Email, Slack, Teams, SMS)."),
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
 * Response schema for generated message output, extended with optional structured context analysis and saved message ID
 */
export const generateMessageResponseSchema = z.object({
  message: z.string().min(1),
  approach: z.string().min(1),
  alternative: z.string().min(1),
  contextAnalysis: communicationContextOutputSchema.optional(),
  savedId: z.string().optional(),
  provider: z.string().optional(),
});


export type GenerateMessageResponse = z.infer<typeof generateMessageResponseSchema>;

/**
 * Input schema for in-place message refinement
 */
export const refineMessageSchema = z.object({
  currentMessage: z.string().min(5, "Message to refine must contain at least 5 characters."),
  instruction: z.enum([
    "make_warmer",
    "make_firmer",
    "make_shorter",
    "make_confident",
    "remove_fluff",
  ]),
  recipient: z.string().optional(),
  channel: z.string().optional(),
  context: z.string().optional(),
});

export type RefineMessageInput = z.infer<typeof refineMessageSchema>;

/**
 * Output schema for in-place message refinement
 */
export const refineMessageResponseSchema = z.object({
  refinedMessage: z.string().min(1),
  refinementRationale: z.string().min(1),
});

export type RefineMessageResponse = z.infer<typeof refineMessageResponseSchema>;
