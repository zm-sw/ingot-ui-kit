/**
 * How the kit moves (KAN-849).
 *
 * `tokens.css` had defined `--dur` and `--ease` from the start and no
 * component read them: dialogs, drawers, toasts and menus appeared in one
 * jump, and every hand-written transition picked Tailwind's own defaults
 * instead. The tokens meant nothing.
 *
 * Two things are measured, and neither of them is "it looks nice":
 *
 * 1. **Every overlay carries the kit's enter animation**, not one of its
 *    own. The class name is the contract here — one duration and one curve
 *    across the kit, both read from the tokens, so a dialog and a drawer
 *    opening on the same screen move at the same speed.
 * 2. **Reduced motion turns the movement off, not the panel.** The
 *    `motion-reduce:animate-none` variant is what does it; without it a
 *    reader who asked the system for less motion still gets a sliding
 *    panel, and dropping the panel instead would be worse than either.
 *
 * jsdom applies no stylesheet, so what a test can check is the class the
 * component emits — which is exactly the thing a refactor drops silently.
 */
import { useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotDrawer, IngotModal, IngotPopover, IngotToast, toast } from "@/ingot";
import { act } from "@testing-library/react";

function classesOf(element: HTMLElement | null): string {
  return element?.className ?? "";
}

describe("overlays enter with the kit's motion", () => {
  it("a dialog fades its backdrop and scales its panel", () => {
    render(
      <IngotModal
        onClose={() => undefined}
        title="Nová objednávka"
        closeLabel="Zavřít"
        testId="modal"
      >
        obsah
      </IngotModal>,
    );

    expect(classesOf(screen.getByTestId("modal"))).toContain("animate-ingot-fade-in");
    expect(classesOf(screen.getByTestId("modal-panel"))).toContain(
      "animate-ingot-scale-in",
    );
  });

  it("a drawer slides in from the edge it belongs to", () => {
    const { rerender } = render(
      <IngotDrawer
        onClose={() => undefined}
        title="Úprava"
        closeLabel="Zavřít"
        testId="drawer"
      >
        obsah
      </IngotDrawer>,
    );
    expect(classesOf(screen.getByTestId("drawer-panel"))).toContain(
      "animate-ingot-slide-in-right",
    );

    rerender(
      <IngotDrawer
        side="left"
        onClose={() => undefined}
        title="Úprava"
        closeLabel="Zavřít"
        testId="drawer"
      >
        obsah
      </IngotDrawer>,
    );
    expect(classesOf(screen.getByTestId("drawer-panel"))).toContain(
      "animate-ingot-slide-in-left",
    );
  });

  it("a toast rises into place", () => {
    render(<IngotToast />);
    act(() => {
      toast({ text: "Uloženo." });
    });
    expect(classesOf(screen.getByTestId("ingot-toast"))).toContain(
      "animate-ingot-slide-in-up",
    );
  });

  it("a popover fades in", () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
            Otevřít
          </button>
          <IngotPopover
            open={open}
            anchorRef={anchorRef}
            onClose={() => setOpen(false)}
            label="Filtry"
            testId="popover"
          >
            obsah
          </IngotPopover>
        </>
      );
    }
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));
    expect(classesOf(screen.getByTestId("popover"))).toContain("animate-ingot-fade-in");
  });
});

describe("reduced motion", () => {
  it.each([
    ["modal", "modal-panel"],
    ["drawer", "drawer-panel"],
  ])("%s turns the movement off, not the panel", (which, panelTestId) => {
    render(
      which === "modal" ? (
        <IngotModal
          onClose={() => undefined}
          title="Nová objednávka"
          closeLabel="Zavřít"
          testId="modal"
        >
          obsah
        </IngotModal>
      ) : (
        <IngotDrawer
          onClose={() => undefined}
          title="Úprava"
          closeLabel="Zavřít"
          testId="drawer"
        >
          obsah
        </IngotDrawer>
      ),
    );

    const panel = screen.getByTestId(panelTestId);
    // The panel is there either way; only the movement is dropped.
    expect(panel).toBeInTheDocument();
    expect(classesOf(panel)).toContain("motion-reduce:animate-none");
  });
});
