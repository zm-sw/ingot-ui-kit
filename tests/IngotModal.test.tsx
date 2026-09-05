/**
 * Dialog shell (KAN-580) — the second Ingot primitive.
 *
 * The tests measure the **accessibility bar** from the owner decision of
 * 2026-08-25, because that bar is exactly why the shell exists: fifty
 * hand-made overlays each met it differently (or not at all). The bar
 * applies from now on to every further primitive, so it is measured here,
 * not at the consumers.
 *
 * And one more thing that is not accessibility: **``ModalDepthProvider`` is
 * inside**. Before KAN-580 every modal had to wrap it by hand and the
 * `ModalDepthContext` docstring claimed it could not be done centrally. If
 * the shell stopped doing it, `useCanQuickCreate()` inside a dialog would
 * silently return `true` at a depth where it should return `false` —
 * nothing would crash, it would just offer what must not be offered.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { useModalDepth } from "@/ingot";
import { IngotModal } from "@/ingot";

function DepthProbe() {
  return <span data-testid="depth">{useModalDepth()}</span>;
}

function Harness({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        otevřít
      </button>
      {open && (
        <IngotModal
          title="Titulek"
          closeLabel="Zavřít"
          onClose={() => setOpen(false)}
          testId="probe"
        >
          {children ?? (
            <>
              <button type="button" data-testid="first">
                první
              </button>
              <button type="button" data-testid="last">
                poslední
              </button>
            </>
          )}
        </IngotModal>
      )}
    </>
  );
}

describe("IngotModal — accessibility bar", () => {
  it("the panel is a dialog labelled by its title", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("aria-modal", "true");
    const labelledBy = panel.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)).toHaveTextContent(
      "Titulek",
    );
  });

  it("focus moves inside the dialog on open", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    // The first focusable element in DOM order is the header close button.
    // What matters is that focus is INSIDE the dialog — without that a
    // screen reader keeps reading the page under the overlay and Tab never
    // enters it.
    expect(screen.getByTestId("probe-panel")).toContainElement(
      document.activeElement as HTMLElement,
    );
    expect(document.activeElement).toBe(screen.getByTestId("probe-close"));
  });

  it("a dialog without focusable content takes focus on the panel", () => {
    render(
      <Harness>
        <p>jen text</p>
      </Harness>,
    );
    fireEvent.click(screen.getByTestId("opener"));
    // The header close button is always focusable — without it focus would
    // stay on <body> and a screen reader would start from the top of the page.
    expect(document.activeElement).toBe(screen.getByTestId("probe-close"));
  });

  it("Tab from the last element returns to the first (trap), not outside", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const last = screen.getByTestId("last");
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(document.activeElement).toBe(screen.getByTestId("probe-close"));
  });

  it("Shift+Tab from the first element goes to the last", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const first = screen.getByTestId("probe-close");
    first.focus();
    fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(screen.getByTestId("last"));
  });

  it("ESC closes", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("a click on the backdrop closes, a click in the panel does not", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("probe-panel"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.mouseDown(screen.getByTestId("probe"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("focus returns to the trigger after close", () => {
    render(<Harness />);
    const opener = screen.getByTestId("opener");
    // jsdom does not move focus on ``click``; a browser does, and that
    // focused trigger is exactly what the dialog should return to.
    opener.focus();
    fireEvent.click(opener);
    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(document.activeElement).toBe(opener);
  });

  it("the background locks on open and unlocks on close", () => {
    render(<Harness />);
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(screen.getByTestId("opener"));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });

  it("a nested dialog does not unlock the background while the outer one stands", () => {
    function Nested() {
      const [inner, setInner] = useState(true);
      return (
        <IngotModal title="vnější" closeLabel="Zavřít" onClose={vi.fn()}>
          <button type="button" onClick={() => setInner(false)}>
            zavřít vnitřní
          </button>
          {inner && (
            <IngotModal title="vnitřní" closeLabel="Zavřít" onClose={vi.fn()}>
              <p>obsah</p>
            </IngotModal>
          )}
        </IngotModal>
      );
    }
    render(<Nested />);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByText("zavřít vnitřní"));
    expect(document.body.style.overflow).toBe("hidden");
  });
});

describe("IngotModal — ModalDepthProvider is inside (KAN-580)", () => {
  it("dialog content is one level deeper without the caller wrapping it", () => {
    render(
      <Harness>
        <DepthProbe />
      </Harness>,
    );
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("depth")).toHaveTextContent("1");
  });

  it("a nested dialog adds another level", () => {
    render(
      <IngotModal title="vnější" closeLabel="Zavřít" onClose={vi.fn()}>
        <IngotModal title="vnitřní" closeLabel="Zavřít" onClose={vi.fn()}>
          <DepthProbe />
        </IngotModal>
      </IngotModal>,
    );
    expect(screen.getByTestId("depth")).toHaveTextContent("2");
  });
});
