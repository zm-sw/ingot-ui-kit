/**
 * `IngotToolbar` (KAN-654) — bar je jen rozvržení: filtry a akce dodává
 * volající, primitivum drží mezery, zalamování a pravý konec (`end`).
 * Žádné `role="toolbar"` schválně — ta role slibuje šipkovou navigaci,
 * kterou nikdo nenapsal.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotToolbar } from "@/ingot";

describe("IngotToolbar", () => {
  it("vykreslí filtry i pravý konec", () => {
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

  it("bez end nevykresluje prázdný pravý obal", () => {
    render(
      <IngotToolbar testId="bar">
        <input aria-label="Hledat" />
      </IngotToolbar>,
    );

    expect(screen.getByTestId("bar").querySelector(".ml-auto")).toBeNull();
  });
});
