/**
 * `IngotToolbar` (KAN-654) — the bar is only layout: the caller supplies
 * filters and actions, the primitive holds spacing, wrapping and the right
 * end (`end`). No `role="toolbar"` on purpose — that role promises arrow
 * navigation nobody wrote.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotToolbar } from "@/ingot";

describe("IngotToolbar", () => {
  it("renders the filters and the right end", () => {
    render(
      <IngotToolbar end={<button type="button">Přidat</button>} testId="bar">
        <input aria-label="Hledat" />
      </IngotToolbar>,
    );

    const bar = screen.getByTestId("bar");
    expect(screen.getByLabelText("Hledat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Přidat" })).toBeInTheDocument();
    expect(bar.className).toContain("flex-wrap");
  });

  it("nenese role=toolbar", () => {
    render(
      <IngotToolbar testId="bar">
        <input aria-label="Hledat" />
      </IngotToolbar>,
    );

    expect(screen.getByTestId("bar")).not.toHaveAttribute("role");
  });

  it("does not render an empty right wrapper without end", () => {
    render(
      <IngotToolbar testId="bar">
        <input aria-label="Hledat" />
      </IngotToolbar>,
    );

    expect(screen.getByTestId("bar").querySelector(".ml-auto")).toBeNull();
  });
});
