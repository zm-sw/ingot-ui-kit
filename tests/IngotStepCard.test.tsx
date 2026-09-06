/**
 * `IngotStepCard` — collapsing and the done state.
 *
 * Why exactly these two: both are state that shows only in what the user
 * sees and what a screen reader hears, so neither the typecheck nor a smoke
 * render catches them. A collapsed step whose body stays in the DOM without
 * `hidden` looks the same in a test as an expanded one; an `aria-expanded`
 * that does not move passes rendering entirely.
 *
 * Assertions about the DEFAULT behaviour (a non-collapsible card has no
 * button and no `hidden`) weigh as much as those about the enabled one: the
 * card sits under the whole guided setup, and a prop that pushes its
 * behaviour onto callers who did not ask for it is a regression on all
 * those screens at once.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotStepCard } from "@/ingot";

function renderCard(extra: Record<string, unknown> = {}) {
  return render(
    <IngotStepCard
      step="02"
      kicker="Krok 02"
      title="Skupiny vlastností"
      footer={<button type="button">Přidat vlastnost</button>}
      testId="card"
      {...extra}
    >
      <p>Materiály a povrchové úpravy.</p>
    </IngotStepCard>,
  );
}

const body = () => screen.getByText("Materiály a povrchové úpravy.").parentElement;

describe("IngotStepCard collapsible", () => {
  it("a non-collapsible card has no button and does not hide its body", () => {
    renderCard();

    expect(screen.queryByRole("button", { name: "Sbalit krok" })).toBeNull();
    expect(body()).not.toHaveAttribute("hidden");
    expect(screen.getByText("Přidat vlastnost")).toBeInTheDocument();
  });

  it("the button collapses body and footer and announces it via aria-expanded", () => {
    renderCard({ collapsible: true, toggleLabel: "Sbalit krok" });

    const toggle = screen.getByRole("button", { name: "Sbalit krok" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(body()).not.toHaveAttribute("hidden");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(body()).toHaveAttribute("hidden");
    expect(screen.queryByText("Přidat vlastnost")).toBeNull();
  });

  it("aria-controls points at the body, which stays in the DOM when collapsed", () => {
    renderCard({ collapsible: true, toggleLabel: "Sbalit krok" });

    const toggle = screen.getByRole("button", { name: "Sbalit krok" });
    fireEvent.click(toggle);

    const controlled = document.getElementById(
      toggle.getAttribute("aria-controls") ?? "",
    );
    expect(controlled).toBe(body());
  });
});

describe("IngotStepCard done", () => {
  it("a done step collapses by itself, an unfinished one stays open", () => {
    const { unmount } = renderCard({
      collapsible: true,
      toggleLabel: "Rozbalit krok",
      done: true,
      doneLabel: "Hotovo",
    });

    expect(screen.getByRole("button", { name: "Rozbalit krok" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(body()).toHaveAttribute("hidden");

    unmount();
    renderCard({ collapsible: true, toggleLabel: "Sbalit krok" });

    expect(screen.getByRole("button", { name: "Sbalit krok" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("a step finished on screen collapses without a reload", () => {
    const { rerender } = renderCard({
      collapsible: true,
      toggleLabel: "Sbalit krok",
    });

    expect(body()).not.toHaveAttribute("hidden");

    rerender(
      <IngotStepCard
        step="02"
        kicker="Krok 02"
        title="Skupiny vlastností"
        collapsible
        toggleLabel="Sbalit krok"
        done
        doneLabel="Hotovo"
        footer={<button type="button">Přidat vlastnost</button>}
        testId="card"
      >
        <p>Materiály a povrchové úpravy.</p>
      </IngotStepCard>,
    );

    expect(body()).toHaveAttribute("hidden");
  });

  it("the done state carries text for a screen reader, not only green", () => {
    renderCard({ done: true, doneLabel: "Hotovo" });

    expect(screen.getByTitle("Hotovo")).toBeInTheDocument();
  });

  it("the collapse of a done step can be toggled by hand", () => {
    renderCard({
      collapsible: true,
      toggleLabel: "Rozbalit krok",
      done: true,
      doneLabel: "Hotovo",
    });

    const toggle = screen.getByRole("button", { name: "Rozbalit krok" });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(body()).not.toHaveAttribute("hidden");
  });
});
