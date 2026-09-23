import { NextResponse } from "next/server";
import {
  generateMessageSchema,
  generateMessageResponseSchema,
  type CommunicationContextOutput,
} from "@/lib/schemas";
import { executeCommunicationContext } from "@/lib/ai/tools/analyze-communication-context";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getCurrentUser } from "@/lib/auth/session";
import { createMessage } from "@/lib/db";
import { generateStructuredOutput } from "@/lib/ai/llm";

/**
 * Configure max execution duration for Next.js Route Handler on Vercel (30 seconds)
 */
export const maxDuration = 30;

// Maximum allowed raw JSON payload size: 32 KB
const MAX_PAYLOAD_BYTES = 32 * 1024;

export async function POST(req: Request) {
  try {
    // 1. Client IP extraction & Rate Limiting Abuse Protection (10 req / min)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    const rateLimit = checkRateLimit(clientIp, 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${rateLimit.resetSeconds}s before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Payload size check
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload size too large. Please shorten your request." },
        { status: 413 }
      );
    }

    // 3. Parse and validate the incoming request payload
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const parseResult = generateMessageSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request data.", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      context,
      recipient,
      goal = "request_action",
      channel = "email",
      tone,
      length,
      provider = "auto",
      draft,
    } = parseResult.data;

    // 4. Execute Server-Side AI Tool: analyzeCommunicationContext
    let contextAnalysis: CommunicationContextOutput | undefined;
    try {
      contextAnalysis = await executeCommunicationContext({
        rawThought: context,
        recipient,
        goal,
        channel,
        tone,
        length,
        draft,
      });
    } catch (toolError: unknown) {
      console.error("Error executing analyzeCommunicationContext tool:", toolError);
      contextAnalysis = undefined;
    }

    // 5. Channel specific guidance
    let channelGuidance = "";
    if (channel === "email") {
      channelGuidance = "FORMAT AS EMAIL: Include a Subject line if helpful (e.g. 'Subject: ...'), appropriate opening greeting, structured paragraphs, and clear sign-off.";
    } else if (channel === "slack" || channel === "teams") {
      channelGuidance = "FORMAT FOR CHAT (Slack/Teams): Direct, concise, conversational, no overly formal email headers. Use bullet points if listing items.";
    } else if (channel === "sms" || channel === "whatsapp") {
      channelGuidance = "FORMAT AS SMS / MESSAGING: Short, punchy, natural, conversational, direct to the point.";
    } else if (channel === "linkedin") {
      channelGuidance = "FORMAT FOR LINKEDIN: Professional, concise, warm networking tone.";
    }

    // 6. Construct Prompt with Structured Communication Signals
    const prompt = `
You are Conveyra, an expert communication assistant. Your goal is to help the user say what they mean in the right way, adapting perfectly to the situation.

USER CONTEXT:
${context}

RECIPIENT: ${recipient}
COMMUNICATION GOAL: ${goal.replace(/_/g, " ")}
DELIVERY CHANNEL: ${channel.toUpperCase()}
REQUESTED TONE: ${tone}
REQUESTED LENGTH: ${length}
${draft ? `ROUGH DRAFT: ${draft}` : ""}

${
  contextAnalysis
    ? `
STRUCTURED CONTEXT ANALYSIS (from analyzeCommunicationContext tool):
- Communication Type: ${contextAnalysis.communicationType}
- Assessed Sensitivity: ${contextAnalysis.sensitivity}
- Required Formality: ${contextAnalysis.formality}
- Urgency: ${contextAnalysis.urgency}
- Critical Risks to Avoid: ${contextAnalysis.risks.join("; ")}
- Recommended Strategic Focus: ${contextAnalysis.recommendedFocus.join("; ")}
`
    : ""
}

INSTRUCTIONS:
1. Preserve the user's meaning exactly. Do not invent facts.
2. Adapt the phrasing to suit the ${recipient} and the assessed sensitivity.
3. Align directly with the communication goal: ${goal.replace(/_/g, " ")}.
4. ${channelGuidance}
5. Adopt a ${tone} tone matching the required formality.
6. Keep the length ${length}.
7. Use natural, human language and avoid excessive corporate jargon or "AI speak".
8. Explicitly avoid the identified communication risks.
9. Emphasize the recommended strategic focus points.
10. Provide an "approach" explaining why this phrasing works (keep it concise).
11. Provide an "alternative" version that takes a genuinely different but valid approach.

Respond ONLY with a valid JSON object matching this schema:
{
  "message": "The suggested message text",
  "approach": "Why this approach works",
  "alternative": "An alternative version of the message"
}
`;

    // 7. Call Multi-Provider Resilient LLM Engine (with 25s internal timeout)
    const timeoutAbort = new AbortController();
    const timeoutId = setTimeout(() => timeoutAbort.abort(), 25_000);

    let aiJson: { message: string; approach: string; alternative: string };
    let usedProvider = "AI Provider";
    try {
      const result = await generateStructuredOutput<{
        message: string;
        approach: string;
        alternative: string;
      }>({
        prompt,
        temperature: 0.7,
        abortSignal: timeoutAbort.signal,
        preferredProvider: provider,
      });
      aiJson = result.data;
      usedProvider = result.provider;
    } finally {
      clearTimeout(timeoutId);
    }

    // 8. Auto-persist to user account if authenticated (with graceful fallback)
    let savedId: string | undefined;
    try {
      const user = await getCurrentUser();
      if (user) {
        const savedMessage = await createMessage({
          userId: user.id,
          originalThought: context,
          recipient,
          communicationGoal: goal,
          channel,
          tone,
          length,
          roughDraft: draft,
          generatedMessage: aiJson.message,
          rationale: aiJson.approach,
          alternative: aiJson.alternative,
          contextAnalysis,
        });
        savedId = savedMessage.id;
      }
    } catch (persistErr) {
      console.error("Failed to auto-save generated message to database:", persistErr);
      // Resilience rule: do not fail generation if database save fails
    }

    const finalOutput = generateMessageResponseSchema.safeParse({
      ...aiJson,
      contextAnalysis,
      savedId,
      provider: usedProvider,
    });


    if (!finalOutput.success) {
      console.error("AI output did not match required schema", finalOutput.error);
      return NextResponse.json(
        { error: "We received an unexpected response format. Please try again." },
        { status: 502 }
      );
    }

    // 11. Return secure, validated response with tool analysis
    return NextResponse.json(finalOutput.data, {
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch (error: unknown) {
    const errorObj = error as { status?: number; message?: string; name?: string } | undefined;
    console.error("API Route Error:", errorObj?.message || error);

    // Handle Timeout / Abort
    if (errorObj?.name === "AbortError" || errorObj?.message?.includes("aborted")) {
      return NextResponse.json(
        { error: "The AI request timed out. Please try again with a shorter prompt." },
        { status: 504 }
      );
    }

    // Handle Rate limits safely
    if (errorObj?.status === 429 || errorObj?.message?.includes("429")) {
      return NextResponse.json(
        { error: "We're experiencing high traffic. Please try again in a moment." },
        { status: 429 }
      );
    }

    // Fallback error
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
