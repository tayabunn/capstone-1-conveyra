import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResultRefinement } from "./result-refinement";

describe("ResultRefinement Component", () => {
  it("renders all 5 quick micro-refinement chips", () => {
    const onMessageRefined = vi.fn();
    render(
      <ResultRefinement
        currentMessage="Hi, please review the document by tomorrow."
        onMessageRefined={onMessageRefined}
      />
    );

    expect(screen.getByText("Make Warmer")).toBeInTheDocument();
    expect(screen.getByText("Make Firmer")).toBeInTheDocument();
    expect(screen.getByText("More Confident")).toBeInTheDocument();
    expect(screen.getByText("Shorten (50%)")).toBeInTheDocument();
    expect(screen.getByText("Remove Fluff")).toBeInTheDocument();
  });

  it("calls API and triggers onMessageRefined when a chip is clicked", async () => {
    const onMessageRefined = vi.fn();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        refinedMessage: "Hi team! Whenever you have a chance, could you review this document?",
        refinementRationale: "Added warm collaborative phrasing.",
      }),
    });

    render(
      <ResultRefinement
        currentMessage="Review document by tomorrow."
        onMessageRefined={onMessageRefined}
      />
    );

    const warmerBtn = screen.getByText("Make Warmer");
    fireEvent.click(warmerBtn);

    await waitFor(() => {
      expect(onMessageRefined).toHaveBeenCalledWith(
        "Hi team! Whenever you have a chance, could you review this document?",
        "Added warm collaborative phrasing."
      );
    });

    expect(screen.getByText("Added warm collaborative phrasing.")).toBeInTheDocument();
  });

  it("renders restore original button when hasOriginalToRestore is true", () => {
    const onRestoreOriginal = vi.fn();
    render(
      <ResultRefinement
        currentMessage="Refined text"
        onMessageRefined={vi.fn()}
        onRestoreOriginal={onRestoreOriginal}
        hasOriginalToRestore={true}
      />
    );

    const restoreBtn = screen.getByText("Restore Original Draft");
    expect(restoreBtn).toBeInTheDocument();

    fireEvent.click(restoreBtn);
    expect(onRestoreOriginal).toHaveBeenCalled();
  });
});
