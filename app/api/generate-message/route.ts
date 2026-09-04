import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  generateMessageSchema,
  generateMessageResponseSchema,
  type CommunicationContextOutput,
} from "@/lib/schemas";
import { executeCommunicationContext } from "@/lib/ai/tools/analyze-communication-context";
import { checkRateLimit } from "@/lib/rate-limiter";

/**
 * Configure max execution duration for Next.js Route Handler on Vercel (30 seconds)
 */
export const maxDuration = 30;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Maximum allowed raw JSON payload size: 32 KB
const MAX_PAYLOAD_BYTES = 32 * 1024;

export async function POST(req: Request) {
  try {
    // 1. Ensure API key is configured on server
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured.");
      return NextResponse.json(
        { error: "Internal server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // 2. Client IP extraction & Rate Limiting Abuse Protection (10 req / min)
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

    // 3. Payload size check
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload size too large. Please shorten your request." },
        { status: 413 }
      );
    }

    // 4. Parse and validate the incoming request payload
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

    const { context, recipient, tone, length, draft } = parseResult.data;

    // 5. Execute Server-Side AI Tool: analyzeCommunicationContext
    let contextAnalysis: CommunicationContextOutput | undefined;
    try {
      contextAnalysis = await executeCommunicationContext({
        rawThought: context,
        recipient,
        tone,
        length,
        draft,
      });
    } catch (toolError: unknown) {
      console.error("Error executing analyzeCommunicationContext tool:", toolError);
      contextAnalysis = undefined;
    }

    // 6. Construct Prompt with Structured Communication Signals
    const prompt = `
You are Conveyra, an expert communication assistant. Your goal is to help the user say what they mean in the right way, adapting perfectly to the situation.

USER CONTEXT:
${context}

RECIPIENT: ${recipient}
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
3. Adopt a ${tone} tone matching the required formality.
4. Keep the length ${length}.
5. Use natural, human language and avoid excessive corporate jargon or "AI speak".
6. Explicitly avoid the identified communication risks.
7. Emphasize the recommended strategic focus points.
8. Provide an "approach" explaining why this phrasing works (keep it concise).
9. Provide an "alternative" version that takes a genuinely different but valid approach.

Respond ONLY with a valid JSON object matching this schema:
{
  "message": "The suggested message text",
  "approach": "Why this approach works",
  "alternative": "An alternative version of the message"
}
`;

    // 7. Call LLM with tool-informed context (with 25s internal abort timeout)
    const timeoutAbort = new AbortController();
    const timeoutId = setTimeout(() => timeoutAbort.abort(), 25_000);

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const aiOutputText = response?.text;
    if (!aiOutputText) {
      throw new Error("No text returned from Gemini API");
    }

    // 8. Parse and validate AI output
    let aiJson;
    try {
      aiJson = JSON.parse(aiOutputText);
    } catch {
      console.error("Failed to parse Gemini output as JSON", aiOutputText);
      return NextResponse.json(
        { error: "We received a malformed response from our provider. Please try again." },
        { status: 502 }
      );
    }

    const finalOutput = generateMessageResponseSchema.safeParse({
      ...aiJson,
      contextAnalysis,
    });

    if (!finalOutput.success) {
      console.error("AI output did not match required schema", finalOutput.error);
      return NextResponse.json(
        { error: "We received an unexpected response format. Please try again." },
        { status: 502 }
      );
    }

    // 9. Return secure, validated response with tool analysis
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
