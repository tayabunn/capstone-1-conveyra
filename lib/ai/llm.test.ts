import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractJsonFromText, generateStructuredOutput, getLLMProviders } from "./llm";

describe("LLM Engine & Json Extractor", () => {
  it("should parse clean JSON strings", () => {
    const raw = '{"message": "Hello world", "approach": "Direct"}';
    const parsed = extractJsonFromText(raw) as { message: string };
    expect(parsed.message).toBe("Hello world");
  });

  it("should extract JSON wrapped inside markdown code fences", () => {
    const raw = `\`\`\`json
{
  "message": "Executive update",
  "approach": "Clear and polite",
  "alternative": "Quick ping"
}
\`\`\``;
    const parsed = extractJsonFromText(raw) as { message: string; alternative: string };
    expect(parsed.message).toBe("Executive update");
    expect(parsed.alternative).toBe("Quick ping");
  });

  it("should extract JSON embedded in conversational text", () => {
    const raw = `Sure! Here is the JSON output requested:
    { "message": "Embedded content" }
    Hope this helps!`;
    const parsed = extractJsonFromText(raw) as { message: string };
    expect(parsed.message).toBe("Embedded content");
  });
});

describe("LLM Providers Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should detect available providers based on environment variables", () => {
    process.env.GEMINI_API_KEY = "test-gemini-key";
    process.env.GROQ_API_KEY = "test-groq-key";
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.CEREBRAS_API_KEY;

    const available = getLLMProviders().filter((p) => p.isAvailable());
    expect(available.map((p) => p.name)).toEqual(["Google Gemini 2.5 Flash", "Groq (Llama 3.3 70B)"]);
  });


  it("should fail gracefully when no provider keys are set", async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.CEREBRAS_API_KEY;

    await expect(
      generateStructuredOutput({ prompt: "Hello" })
    ).rejects.toThrow("No AI provider is configured");
  });
});
