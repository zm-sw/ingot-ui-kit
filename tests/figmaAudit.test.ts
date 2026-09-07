import { describe, expect, it } from "vitest";

import { auditFrame, auditNode, contrast, tokenFor } from "@/ingot-docs/figmaAudit";
import { ROLE_THRESHOLD, tokenRole } from "@/ingot-docs/tokenRoles";

/**
 * The rules an inspector applies to a design file. What has to hold is
 * that they are the SAME rules the code is held to — a design file and a
 * product that disagree about what passes, while both look right, is the
 * failure these rules exist to prevent.
 */
describe("a colour", () => {
  it("is recognised when it is a token", () => {
    expect(tokenFor("#f1f0ed")).toBe("bg");
    expect(tokenFor("#FFFFFF")).toBe("surface");
    // Dark-theme values count too: the same frame is drawn in both.
    expect(tokenFor("#0b0a09")).toBe("bg");
  });

  it("is a finding when it is not", () => {
    const findings = auditNode({ name: "Karta", fill: "#3b82f6" });
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe("colour");
    expect(findings[0].where).toBe("Karta");
    expect(findings[0].message.cs).toContain("#3b82f6");
  });

  it("says nothing about a node whose fill and stroke are both tokens", () => {
    expect(auditNode({ name: "Karta", fill: "#ffffff", stroke: "#ddd9d3" })).toEqual(
      [],
    );
  });
});

describe("a measurement", () => {
  it("names the two steps it falls between", () => {
    const findings = auditNode({ name: "Řádek", spacing: [10] });
    expect(findings).toHaveLength(1);
    // The sentence a reader can act on: "10 px, the scale knows 8 and 12".
    expect(findings[0].message.cs).toContain("8 a 12");
    expect(findings[0].message.en).toContain("8 and 12");
  });

  it("lets every step of the scale through", () => {
    expect(
      auditNode({ name: "Řádek", spacing: [4, 8, 12, 16, 24, 32, 48, 72] }),
    ).toEqual([]);
  });

  it("treats zero as no gap rather than a gap off the scale", () => {
    expect(auditNode({ name: "Řádek", spacing: [0] })).toEqual([]);
  });

  it("holds a radius to its own scale and lets a full circle be", () => {
    expect(auditNode({ name: "Štítek", radius: 10 })).toEqual([]);
    expect(auditNode({ name: "Avatar", radius: 9999 })).toEqual([]);
    expect(auditNode({ name: "Štítek", radius: 8 })).toHaveLength(1);
  });
});

describe("a font size", () => {
  it("has to be a step of the scale", () => {
    expect(auditNode({ name: "Nadpis", fontSize: 40 })).toEqual([]);
    expect(auditNode({ name: "Text", fontSize: 14.5 })).toEqual([]);
    const findings = auditNode({ name: "Nadpis", fontSize: 42 });
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe("type");
    expect(findings[0].message.cs).toContain("h1 40");
  });
});

describe("contrast", () => {
  it("is judged against the rule the token's role really has", () => {
    // A page background has no ratio to meet. Judging it against 4.5
    // would mark the ground of every screen as a near miss — which is
    // exactly what the Tokens page used to do before roles existed.
    expect(tokenRole("bg")).toBe("surface");
    expect(ROLE_THRESHOLD.surface).toBeNull();
    expect(auditNode({ name: "Plocha", fill: "#f1f0ed", on: "#ffffff" })).toEqual([]);
  });

  it("holds ink to 4.5 and reports the ratio it found", () => {
    // --ink-5 is the lightest ink, for separators and a disabled state.
    // It is exempt as decorative, so it is not held to 4.5 either.
    expect(tokenRole("ink-5")).toBe("decorative");
    expect(auditNode({ name: "Linka", fill: "#d6d3d1", on: "#ffffff" })).toEqual([]);
  });

  it("computes the same ratio the Tokens page shows", () => {
    expect(contrast("#0c0a09", "#ffffff")).toBe(19.76);
    expect(contrast("#8d8a84", "#ffffff")).toBe(3.44);
  });

  it("stays quiet when it does not know the ground", () => {
    // Without the colour underneath there is no ratio, and a guess would
    // be worse than silence.
    expect(auditNode({ name: "Text", fill: "#0c0a09" })).toEqual([]);
  });
});

describe("a whole frame", () => {
  it("collects the findings of every node, in order", () => {
    const findings = auditFrame([
      { name: "Karta", fill: "#ffffff" },
      { name: "Řádek", spacing: [10], fill: "#3b82f6" },
      { name: "Nadpis", fontSize: 40 },
    ]);
    expect(findings.map((finding) => finding.where)).toEqual(["Řádek", "Řádek"]);
    expect(findings.map((finding) => finding.kind).sort()).toEqual([
      "colour",
      "spacing",
    ]);
  });

  it("finds nothing in a frame built from the system", () => {
    expect(
      auditFrame([
        { name: "Karta", fill: "#ffffff", stroke: "#ddd9d3", radius: 10 },
        { name: "Obsah", spacing: [16, 24] },
        { name: "Nadpis", fontSize: 26, fill: "#0c0a09", on: "#ffffff" },
      ]),
    ).toEqual([]);
  });
});
