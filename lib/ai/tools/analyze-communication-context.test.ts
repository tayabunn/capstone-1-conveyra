import { describe, it, expect } from "vitest";
import {
  analyzeContextData,
  executeCommunicationContext,
  analyzeCommunicationContextTool,
} from "./analyze-communication-context";
import { communicationContextInputSchema } from "@/lib/schemas";

describe("analyzeCommunicationContext Tool", () => {
  it("has valid tool metadata", () => {
    expect(analyzeCommunicationContextTool.description).toBeDefined();
  });

  it("analyzes boundary-setting client requests correctly via executeCommunicationContext", async () => {
    const input = {
      rawThought: "The client keeps changing the requirements and I need to tell them we can't keep doing extra revisions for free.",
      recipient: "client",
      tone: "professional",
      length: "medium",
    };

    const result = await executeCommunicationContext(input);

    expect(result.communicationType).toMatch(/Boundary-setting/i);
    expect(result.sensitivity).toBe("high");
    expect(result.formality).toBe("professional");
    expect(result.risks.length).toBeGreaterThan(0);
    expect(result.recommendedFocus.length).toBeGreaterThan(0);
  });

  it("analyzes casual status updates to friends/family correctly", async () => {
    const input = {
      rawThought: "Just checking in to see how you are doing whenever you have time.",
      recipient: "friend",
      tone: "friendly",
      length: "short",
    };

    const result = analyzeContextData(input);
    expect(result.sensitivity).toBe("low");
    expect(result.formality).toBe("casual");
    expect(result.urgency).toBe("low");
  });

  it("throws validation error on invalid or empty input", async () => {
    const invalidInput = {
      rawThought: "Too short",
      recipient: "",
      tone: "",
      length: "",
    };

    expect(() => communicationContextInputSchema.parse(invalidInput)).toThrow();
  });
});
