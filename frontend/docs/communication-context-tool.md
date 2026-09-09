# analyzeCommunicationContext — Server-Side AI Tool Contract & Architecture

## 1. Tool Purpose

`analyzeCommunicationContext` is a server-side AI tool designed specifically for Conveyra. Before the AI generates the final message, this tool analyzes the user's raw thought, recipient dynamic, tone, and constraints to extract structured communication signals, risks, and strategic focus points.

This ensures the generated response is not a generic rewrite, but a calibrated message tailored to the exact interpersonal dynamics.

---

## 2. Input Schema (Zod)

The tool accepts typed inputs validated using Zod:

```typescript
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
```

---

## 3. Output Schema (Zod)

The tool returns structured, validated data:

```typescript
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
```

---

## 4. Execution Flow

```text
User Input Form
      ↓
POST /api/generate-message
      ↓ (Zod Request Validation)
analyzeCommunicationContext.execute()
      ↓ (Structured Tool Signals Generated & Validated)
Claude / LLM Prompt Synthesis with Injected Signals
      ↓ (Model Generates Calibrated Message + Rationale)
Zod Final Response Validation
      ↓
Client Generative UI Render
      ├─ CommunicationContextTool (Output-Available Card)
      ├─ Suggested Message
      ├─ Strategic Rationale
      └─ Alternative Approach
```

---

## 5. Four Tool Lifecycle States

The frontend component (`CommunicationContextTool`) supports 4 distinct, meaningful states:

1. **`input-streaming`**:
   * *Question Answered:* "What is Conveyra doing right now?"
   * *UI:* Subtle animation showing active tool invocation and context preparation.
2. **`input-available`**:
   * *Question Answered:* "What did Conveyra understand from my request?"
   * *UI:* Compact chip overview of received recipient, tone, length, and prompt snippet.
3. **`output-available`**:
   * *Question Answered:* "What did Conveyra learn?"
   * *UI:* High-density structured signals card showing Communication Type, Sensitivity/Formality/Urgency badges, Potential Risks to Avoid, and Recommended Focus items.
4. **`output-error`**:
   * *Question Answered:* "What went wrong and what can I do?"
   * *UI:* Graceful error notice with an accessible "Retry Context Analysis" button.

---

## 6. Error Handling & Security

- **Strict Validation:** Every input and output is validated via Zod (`safeParse`). Malformed responses or runtime exceptions trigger the graceful `output-error` state without crashing the client application.
- **Server-Side Exclusivity:** Tool execution occurs strictly in server route handlers (`/api/generate-message`). No API keys or secrets are ever exposed to the client or browser network bundle.
- **Zero Client Secrets:** Uses server environment variables (`GEMINI_API_KEY` / `ANTHROPIC_API_KEY`) without `NEXT_PUBLIC_*` exposure.

---

## 7. Testing Strategy

1. **Tool Unit Tests (`lib/ai/tools/analyze-communication-context.test.ts`):** Verifies schema validation, metadata, boundary-setting analysis, and error handling.
2. **Component Unit Tests (`components/generator/communication-context-tool.test.tsx`):** Verifies rendering of all 4 lifecycle states, risk lists, recommendation lists, and retry button triggers.
3. **E2E Tests (`tests/e2e/generator.spec.ts`):** Validates full end-to-end user journey from input submission to context tool display, message rendering, and clipboard actions.
