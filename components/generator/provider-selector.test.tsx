import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProviderSelector } from "./provider-selector";

describe("ProviderSelector Component", () => {
  it("renders all AI engine options", () => {
    const onChange = vi.fn();
    render(<ProviderSelector value="auto" onChange={onChange} />);

    expect(screen.getByText("Auto (Failover)")).toBeInTheDocument();
    expect(screen.getByText("Gemini 2.5")).toBeInTheDocument();
    expect(screen.getByText("Groq Llama 3.3")).toBeInTheDocument();
    expect(screen.getByText("Cerebras")).toBeInTheDocument();
    expect(screen.getByText("OpenRouter")).toBeInTheDocument();
    expect(screen.getByText("GitHub Models")).toBeInTheDocument();
  });

  it("calls onChange when a provider button is clicked", () => {
    const onChange = vi.fn();
    render(<ProviderSelector value="auto" onChange={onChange} />);

    const groqBtn = screen.getByRole("radio", { name: /Groq Llama 3.3/i });
    fireEvent.click(groqBtn);

    expect(onChange).toHaveBeenCalledWith("groq");
  });
});
