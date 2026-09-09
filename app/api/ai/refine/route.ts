import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { refineMessageSchema, refineMessageResponseSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limiter";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service configuration missing." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Rate Limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    const rateLimit = checkRateLimit(clientIp, 15, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Rate limit reached. Please wait ${rateLimit.resetSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parseResult = refineMessageSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid refinement request.", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { currentMessage, instruction, recipient, channel, context } = parseResult.data;

    let directive = "";
    switch (instruction) {
      case "make_warmer":
        directive = "Increase warmth, empathy, and positive human connection without becoming overly casual or sycophantic.";
        break;
      case "make_firmer":
        directive = "Make the tone more assertive, decisive, and clear about boundaries or expectations without sounding aggressive.";
        break;
      case "make_shorter":
        directive = "Condense this message by approximately 40-50%, keeping only essential meaning and call to action.";
        break;
      case "make_confident":
        directive = "Remove apologetic minimizing (e.g. 'just checking in', 'sorry to bother', 'no worries if not') and state points with clear confidence.";
        break;
      case "remove_fluff":
        directive = "Strip out corporate jargon, filler phrases, and boilerplate. Make it crisp, genuine, and punchy.";
        break;
    }

    const prompt = `
You are Conveyra's precision phrasing refiner. Refine the following message according to the specific directive.

CURRENT MESSAGE:
"${currentMessage}"

REFINEMENT DIRECTIVE:
${directive}

${recipient ? `RECIPIENT DYNAMIC: ${recipient}` : ""}
${channel ? `DELIVERY CHANNEL: ${channel}` : ""}
${context ? `ORIGINAL USER INTENT: ${context}` : ""}

INSTRUCTIONS:
1. Apply the refinement directive directly to the message.
2. Preserve key facts, dates, commitments, and core intent.
3. Keep the language natural and polished.
4. Provide a brief 1-sentence explanation of what was adjusted.

Respond ONLY with valid JSON matching:
{
  "refinedMessage": "The adjusted phrasing",
  "refinementRationale": "1-sentence summary of the adjustment"
}
`;

    const timeoutAbort = new AbortController();
    const timeoutId = setTimeout(() => timeoutAbort.abort(), 20_000);

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const outputText = response?.text;
    if (!outputText) {
      throw new Error("No response received from model.");
    }

    const parsedJson = JSON.parse(outputText);
    const validated = refineMessageResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Unexpected refinement response format." },
        { status: 502 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to refine message. Please try again." },
      { status: 500 }
    );
  }
}
