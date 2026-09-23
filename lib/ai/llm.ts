import { GoogleGenAI } from "@google/genai";

export interface LLMProviderConfig {
  id: "gemini" | "groq" | "cerebras" | "openrouter" | "github";
  name: string;
  isAvailable: () => boolean;
  generate: (params: GenerateParams) => Promise<string>;
}

export interface GenerateParams {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  abortSignal?: AbortSignal;
  preferredProvider?: "auto" | "gemini" | "groq" | "cerebras" | "openrouter" | "github";
}

/**
 * Extracts raw JSON from string even if wrapped in markdown codeblocks (```json ... ```)
 */
export function extractJsonFromText(rawText: string): unknown {
  let cleaned = rawText.trim();

  // Remove markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIdx = 0;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1 && lastBrace > startIdx) {
      cleaned = cleaned.substring(startIdx, lastBrace + 1);
    }
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    const lastBracket = cleaned.lastIndexOf("]");
    if (lastBracket !== -1 && lastBracket > startIdx) {
      cleaned = cleaned.substring(startIdx, lastBracket + 1);
    }
  }

  return JSON.parse(cleaned);
}

/**
 * Generic caller for OpenAI-compatible free LLM providers
 * (Groq, OpenRouter, Cerebras, GitHub Models)
 */
async function callOpenAICompatibleEndpoint({
  url,
  apiKey,
  model,
  prompt,
  systemPrompt,
  temperature = 0.7,
  abortSignal,
  extraHeaders = {},
}: {
  url: string;
  apiKey: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  abortSignal?: AbortSignal;
  extraHeaders?: Record<string, string>;
}): Promise<string> {
  const messages: Array<{ role: "system" | "user"; content: string }> = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      response_format: { type: "json_object" },
    }),
    signal: abortSignal,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Provider HTTP ${res.status}: ${errorText || res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Provider returned an empty response body.");
  }

  return content;
}

/**
 * Ordered list of Free LLM providers from awesome-free-llm-apis
 */
export function getLLMProviders(): LLMProviderConfig[] {
  return [
    // 1. Google Gemini API (Primary default)
    {
      id: "gemini",
      name: "Google Gemini 2.5 Flash",
      isAvailable: () => Boolean(process.env.GEMINI_API_KEY),
      generate: async ({ prompt, systemPrompt, temperature = 0.7, abortSignal }) => {
        const apiKey = process.env.GEMINI_API_KEY!;
        const ai = new GoogleGenAI({ apiKey });

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: {
            responseMimeType: "application/json",
            temperature,
          },
        });

        const text = response?.text;
        if (!text) throw new Error("Gemini returned empty text.");
        return text;
      },
    },

    // 2. Groq (Ultra-fast free inference ~300+ tok/sec - Llama 3.3 70B)
    {
      id: "groq",
      name: "Groq (Llama 3.3 70B)",
      isAvailable: () => Boolean(process.env.GROQ_API_KEY),
      generate: async (params) => {
        return callOpenAICompatibleEndpoint({
          url: "https://api.groq.com/openai/v1/chat/completions",
          apiKey: process.env.GROQ_API_KEY!,
          model: "llama-3.3-70b-versatile",
          prompt: params.prompt,
          systemPrompt: params.systemPrompt,
          temperature: params.temperature,
          abortSignal: params.abortSignal,
        });
      },
    },

    // 3. Cerebras (Free ultra-fast inference ~2000 tok/sec)
    {
      id: "cerebras",
      name: "Cerebras (Llama 3.3 70B)",
      isAvailable: () => Boolean(process.env.CEREBRAS_API_KEY),
      generate: async (params) => {
        return callOpenAICompatibleEndpoint({
          url: "https://api.cerebras.ai/v1/chat/completions",
          apiKey: process.env.CEREBRAS_API_KEY!,
          model: process.env.CEREBRAS_MODEL || "llama3.3-70b",
          prompt: params.prompt,
          systemPrompt: params.systemPrompt,
          temperature: params.temperature,
          abortSignal: params.abortSignal,
        });
      },
    },

    // 4. OpenRouter Free Tier (Llama 3.3 / Gemini Flash / DeepSeek Free)
    {
      id: "openrouter",
      name: "OpenRouter (Free Tier)",
      isAvailable: () => Boolean(process.env.OPENROUTER_API_KEY),
      generate: async (params) => {
        return callOpenAICompatibleEndpoint({
          url: "https://openrouter.ai/api/v1/chat/completions",
          apiKey: process.env.OPENROUTER_API_KEY!,
          model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
          prompt: params.prompt,
          systemPrompt: params.systemPrompt,
          temperature: params.temperature,
          abortSignal: params.abortSignal,
          extraHeaders: {
            "HTTP-Referer": "https://conveyra.app",
            "X-Title": "Conveyra",
          },
        });
      },
    },

    // 5. GitHub Models (Free with GitHub Token)
    {
      id: "github",
      name: "GitHub Models (GPT-4o mini)",
      isAvailable: () => Boolean(process.env.GITHUB_TOKEN),
      generate: async (params) => {
        return callOpenAICompatibleEndpoint({
          url: "https://models.inference.ai.azure.com/chat/completions",
          apiKey: process.env.GITHUB_TOKEN!,
          model: "gpt-4o-mini",
          prompt: params.prompt,
          systemPrompt: params.systemPrompt,
          temperature: params.temperature,
          abortSignal: params.abortSignal,
        });
      },
    },
  ];
}

/**
 * Resilient Multi-Provider Structured Output Generator
 * Tries the preferred provider first, and automatically falls back to other available providers on failure.
 */
export async function generateStructuredOutput<T = unknown>(params: GenerateParams): Promise<{
  data: T;
  provider: string;
}> {
  let providers = getLLMProviders().filter((p) => p.isAvailable());

  if (providers.length === 0) {
    throw new Error(
      "No AI provider is configured. Please set GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, CEREBRAS_API_KEY, or GITHUB_TOKEN in your environment variables."
    );
  }

  // If a specific provider was requested and available, prioritize it first
  if (params.preferredProvider && params.preferredProvider !== "auto") {
    const target = providers.find((p) => p.id === params.preferredProvider);
    if (target) {
      providers = [target, ...providers.filter((p) => p.id !== params.preferredProvider)];
    }
  }

  const errors: Array<{ provider: string; error: string }> = [];

  for (const provider of providers) {
    try {
      const rawOutput = await provider.generate(params);
      const parsed = extractJsonFromText(rawOutput) as T;
      return {
        data: parsed,
        provider: provider.name,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI Engine] Provider '${provider.name}' failed: ${msg}. Attempting next available fallback...`);
      errors.push({ provider: provider.name, error: msg });
    }
  }

  throw new Error(
    `All configured AI providers failed:\n${errors.map((e) => `• ${e.provider}: ${e.error}`).join("\n")}`
  );
}

