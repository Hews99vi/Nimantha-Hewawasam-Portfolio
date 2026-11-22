import { describe, expect, it } from "vitest";
import { projectTeaser } from "../lib/project-teaser";

describe("Home project excerpts", () => {
  it("keeps the opening sentence and leaves the full source unchanged", () => {
    const source = "A booking platform. Full details stay on the project page.";
    expect(projectTeaser(source)).toBe("A booking platform.");
    expect(source).toContain("Full details");
  });
  it("keeps short custom text without adding punctuation", () => {
    expect(projectTeaser("  A practical product  ")).toBe("A practical product");
    expect(projectTeaser("")).toBe("");
  });
  it("bounds long openings at a word boundary, including unbroken strings", () => {
    expect(projectTeaser("A longer opening sentence for a project", 20)).toBe("A longer opening…");
    expect(projectTeaser("x".repeat(240))).toBe("x".repeat(220) + "…");
  });
});
