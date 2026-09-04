import {
  communicationContextInputSchema,
  communicationContextOutputSchema,
  type CommunicationContextInput,
  type CommunicationContextOutput,
} from "@/lib/schemas";

/**
 * Heuristic and pattern analysis engine for communication context.
 * Performs deterministic contextual risk and focus evaluation server-side.
 */
export function analyzeContextData(input: CommunicationContextInput): CommunicationContextOutput {
  const text = (input.rawThought + " " + (input.draft || "")).toLowerCase();
  const recipient = input.recipient.toLowerCase();
  const tone = input.tone.toLowerCase();

  // 1. Determine Communication Type
  let communicationType = "Strategic Communication";
  if (
    text.includes("boundary") ||
    text.includes("can't") ||
    text.includes("cannot") ||
    text.includes("no") ||
    text.includes("decline") ||
    text.includes("refuse") ||
    text.includes("revision") ||
    text.includes("scope") ||
    text.includes("extra")
  ) {
    communicationType = "Boundary-setting & Scope Management";
  } else if (
    text.includes("deadline") ||
    text.includes("delay") ||
    text.includes("late") ||
    text.includes("postpone") ||
    text.includes("reschedule") ||
    text.includes("timeline")
  ) {
    communicationType = "Timeline & Schedule Realignment";
  } else if (
    text.includes("feedback") ||
    text.includes("mistake") ||
    text.includes("error") ||
    text.includes("improve") ||
    text.includes("issue") ||
    text.includes("problem")
  ) {
    communicationType = "Constructive Feedback & Course Correction";
  } else if (
    text.includes("cost") ||
    text.includes("price") ||
    text.includes("invoice") ||
    text.includes("budget") ||
    text.includes("payment") ||
    text.includes("fee")
  ) {
    communicationType = "Commercial & Scope Negotiation";
  } else if (
    text.includes("update") ||
    text.includes("status") ||
    text.includes("progress") ||
    text.includes("completed")
  ) {
    communicationType = "Executive Status & Progress Update";
  } else if (
    text.includes("help") ||
    text.includes("need") ||
    text.includes("ask") ||
    text.includes("request") ||
    text.includes("resource")
  ) {
    communicationType = "Direct Action Request";
  }

  // 2. Sensitivity Analysis
  let sensitivity: CommunicationContextOutput["sensitivity"] = "medium";
  const highSensitivityWords = [
    "angry",
    "upset",
    "fired",
    "quit",
    "hate",
    "blame",
    "hostile",
    "unreasonable",
    "frustrated",
    "ridiculous",
    "unfair",
  ];
  const hasHighSensitivity =
    highSensitivityWords.some((w) => text.includes(w)) ||
    (recipient === "client" && communicationType.includes("Boundary")) ||
    (recipient === "manager" && communicationType.includes("Feedback"));

  if (hasHighSensitivity) {
    sensitivity = "high";
  } else if (
    recipient === "friend" ||
    recipient === "family" ||
    (tone === "friendly" && !text.includes("no") && !text.includes("delay"))
  ) {
    sensitivity = "low";
  }

  // 3. Formality Calculation
  let formality: CommunicationContextOutput["formality"] = "professional";
  if (recipient === "friend" || recipient === "family" || tone === "friendly") {
    formality = "casual";
  } else if (recipient === "client" || recipient === "manager" || tone === "direct") {
    formality = tone === "direct" && recipient === "client" ? "formal" : "professional";
  }

  // 4. Urgency Calculation
  let urgency: CommunicationContextOutput["urgency"] = "medium";
  const urgentWords = ["urgent", "asap", "immediately", "today", "now", "critical", "emergency", "blocker"];
  if (urgentWords.some((w) => text.includes(w))) {
    urgency = "high";
  } else if (text.includes("whenever") || text.includes("no rush") || text.includes("someday") || text.includes("next month")) {
    urgency = "low";
  }

  // 5. Contextual Risks
  const risks: string[] = [];
  if (text.includes("can't") || text.includes("don't want") || text.includes("refuse") || text.includes("stop")) {
    risks.push("May sound defensive or confrontational if phrased without positive framing");
  }
  if (recipient === "client" || recipient === "manager") {
    risks.push("Risk of inadvertently escalating relationship friction or sounding uncooperative");
  }
  if (text.length < 50) {
    risks.push("Sparse context may cause ambiguity regarding non-negotiable constraints");
  }
  if (text.includes("sorry") || text.includes("apologize") || text.includes("my fault")) {
    risks.push("Risk of over-apologizing for reasonable operational or scope boundaries");
  }
  if (risks.length === 0) {
    risks.push("Risk of ambiguity regarding explicit ownership and deliverables");
    risks.push("Potential for misinterpretation of intended emotional tone");
  }

  // 6. Actionable Recommended Focus
  const recommendedFocus: string[] = [];
  if (communicationType.includes("Boundary") || text.includes("revision") || text.includes("scope")) {
    recommendedFocus.push("State constraints clearly without emotional justification or blame");
    recommendedFocus.push("Propose a constructive alternative path (e.g. paid add-on, next milestone)");
  } else if (communicationType.includes("Timeline") || communicationType.includes("Schedule")) {
    recommendedFocus.push("Provide the new reliable timeline with brief objective rationale");
    recommendedFocus.push("Highlight what is already completed to maintain forward momentum");
  } else if (communicationType.includes("Feedback")) {
    recommendedFocus.push("Anchor critique in observed behavior and shared goals rather than intent");
    recommendedFocus.push("Outline specific, actionable next steps for course correction");
  } else {
    recommendedFocus.push("Lead with the primary objective in the very first sentence");
    recommendedFocus.push("Close with a clear, low-friction call to action");
  }

  const result: CommunicationContextOutput = {
    communicationType,
    sensitivity,
    formality,
    urgency,
    risks,
    recommendedFocus,
  };

  // Validate with Zod before returning to ensure 100% schema guarantee
  return communicationContextOutputSchema.parse(result);
}

/**
 * Server-side AI tool execution helper
 */
export async function executeCommunicationContext(
  input: CommunicationContextInput
): Promise<CommunicationContextOutput> {
  const validatedInput = communicationContextInputSchema.parse(input);
  return analyzeContextData(validatedInput);
}

/**
 * Server-Side AI Tool Definition for analyzeCommunicationContext
 */
export const analyzeCommunicationContextTool = {
  name: "analyzeCommunicationContext" as const,
  description:
    "Analyzes the user's raw thought, recipient relationship, tone, and constraints to extract structured communication signals, risks, and strategic focus points prior to final message generation.",
  parameters: communicationContextInputSchema,
  execute: async (input: CommunicationContextInput): Promise<CommunicationContextOutput> => {
    return executeCommunicationContext(input);
  },
};
