import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CommunicationContextTool } from "./communication-context-tool";
import type { CommunicationContextOutput } from "@/lib/schemas";

describe("CommunicationContextTool", () => {
  const sampleOutput: CommunicationContextOutput = {
    communicationType: "Boundary-setting",
    sensitivity: "high",
    formality: "professional",
    urgency: "medium",
    risks: [
      "May sound accusatory if not framed with positive intent",
      "Risk of relationship friction with client",
    ],
    recommendedFocus: [
      "Describe impact of scope changes objectively",
      "Offer practical alternative milestone",
    ],
  };

  it("renders State 1 (input-streaming) correctly", () => {
    render(<CommunicationContextTool state="input-streaming" />);
    
    expect(screen.getByTestId("state-input-streaming")).toBeInTheDocument();
    expect(screen.getByText(/Tool Calling: analyzeCommunicationContext/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyzing your communication context/i)).toBeInTheDocument();
  });

  it("renders State 2 (input-available) with received parameters", () => {
    render(
      <CommunicationContextTool
        state="input-available"
        input={{
          context: "Need to push back on sudden deadline",
          recipient: "client",
          tone: "professional",
          length: "medium",
        }}
      />
    );

    expect(screen.getByTestId("state-input-available")).toBeInTheDocument();
    expect(screen.getByText(/Context Parameters Received/i)).toBeInTheDocument();
    expect(screen.getByText(/client/i)).toBeInTheDocument();
    expect(screen.getByText(/professional/i)).toBeInTheDocument();
  });

  it("renders State 3 (output-available) with structured communication signals", () => {
    render(
      <CommunicationContextTool
        state="output-available"
        output={sampleOutput}
      />
    );

    expect(screen.getByTestId("state-output-available")).toBeInTheDocument();
    expect(screen.getByText(/Communication Context Signals/i)).toBeInTheDocument();
    expect(screen.getByText(/Boundary-setting/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText(/professional/i)).toBeInTheDocument();

    // Verify risks and recommendations lists
    expect(screen.getByText(/Potential Risks Avoided/i)).toBeInTheDocument();
    expect(screen.getByText(/May sound accusatory/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Focus/i)).toBeInTheDocument();
    expect(screen.getByText(/Describe impact of scope changes/i)).toBeInTheDocument();
  });

  it("renders State 4 (output-error) and triggers onRetry", () => {
    const handleRetry = vi.fn();
    render(
      <CommunicationContextTool
        state="output-error"
        errorMessage="Context analysis service unavailable"
        onRetry={handleRetry}
      />
    );

    expect(screen.getByTestId("state-output-error")).toBeInTheDocument();
    expect(screen.getByText(/Context Analysis Unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/Context analysis service unavailable/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Retry Context Analysis/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
