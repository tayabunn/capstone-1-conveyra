import { z } from "zod";

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

export const generateMessageResponseSchema = z.object({
  message: z.string().min(1),
  approach: z.string().min(1),
  alternative: z.string().min(1),
});

export type GenerateMessageResponse = z.infer<typeof generateMessageResponseSchema>;
