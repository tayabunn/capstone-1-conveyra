import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateMessageSchema, generateMessageResponseSchema } from "@/lib/schemas";
import { z } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // 1. Ensure API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured.");
      return NextResponse.json(
        { error: "Internal server error. Please try again later." },
        { status: 500 }
      );
    }

    // 2. Parse and validate the incoming request payload
    let body;
    try {
      body = await req.json();
    } catch (e) {
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

    // 3. Construct the prompt
    const prompt = `
You are Conveyra, an expert communication assistant. Your goal is to help the user say what they mean in the right way, adapting perfectly to the situation.

CONTEXT:
${context}

RECIPIENT: ${recipient}
TONE: ${tone}
LENGTH: ${length}
${draft ? `ROUGH DRAFT: ${draft}` : ""}

INSTRUCTIONS:
1. Preserve the user's meaning exactly. Do not invent facts.
2. Adapt the phrasing to suit the ${recipient}.
3. Adopt a ${tone} tone.
4. Keep the length ${length}.
5. Use natural, human language and avoid excessive corporate jargon or "AI speak".
6. Provide an "approach" explaining why this phrasing works (keep it concise).
7. Provide an "alternative" version that takes a genuinely different but valid approach.

Respond ONLY with a valid JSON object matching this schema:
{
  "message": "The suggested message text",
  "approach": "Why this approach works",
  "alternative": "An alternative version of the message"
}
`;

    // 4. Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const aiOutputText = response.text;
    if (!aiOutputText) {
      throw new Error("No text returned from Gemini API");
    }

    // 5. Parse and validate AI output
    let aiJson;
    try {
      aiJson = JSON.parse(aiOutputText);
    } catch (e) {
      console.error("Failed to parse Gemini output as JSON", aiOutputText);
      return NextResponse.json(
        { error: "We received a malformed response from our provider. Please try again." },
        { status: 502 }
      );
    }

    const finalOutput = generateMessageResponseSchema.safeParse(aiJson);
    if (!finalOutput.success) {
      console.error("AI output did not match required schema", finalOutput.error);
      return NextResponse.json(
        { error: "We received an unexpected response format. Please try again." },
        { status: 502 }
      );
    }

    // 6. Return secure, validated response
    return NextResponse.json(finalOutput.data);

  } catch (error: any) {
    console.error("API Route Error:", error.message || error);
    
    // Handle Rate limits safely
    if (error?.status === 429 || error?.message?.includes("429")) {
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
