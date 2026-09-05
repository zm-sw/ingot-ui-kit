/**
 * Side panel for editing (KAN-655).
 *
 * The tests measure the same accessibility bar as
 * ``tests/IngotModal.test.tsx`` — the drawer is the second overlay the bar
 * from the owner decision of 2026-08-25 applies to in full: trap, ESC,
 * focus return, scroll lock.
 *
 * On top they measure what is specific to the drawer:
 *
 * - ``dismissable={false}`` turns off ONLY the backdrop click; ESC and the
 *   close button keep working. One click beside must not throw away a
 *   half-written form.
 * - ``width`` has a hard cap of 560 px from the spec.
 * - the scroll lock SHARES its counter with ``IngotModal`` — a drawer above
 *   a dialog must not unlock the background on close.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { IngotDrawer, IngotModal, useModalDepth } from "@/ingot";

function DepthProbe() {
  return <span data-testid="depth">{useModalDepth()}</span>;
}

function Harness({
  children,
  dismissable,
  side,
  width,
}: {
  children?: React.ReactNode;
  dismissable?: boolean;
  side?: "right" | "left";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        otevřít
      </button>
      {open && (
        <IngotDrawer
          title="Titulek"
          closeLabel="Zavřít"
          onClose={() => setOpen(false)}
          dismissable={dismissable}
          side={side}
          width={width}
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
        </IngotDrawer>
      )}
    </>
  );
}

describe("IngotDrawer — accessibility bar", () => {
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

  it("focus moves inside the drawer on open", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe-panel")).toContainElement(
      document.activeElement as HTMLElement,
    );
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

  it("focus returns to the trigger after close", () => {
    render(<Harness />);
    const opener = screen.getByTestId("opener");
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
});

describe("IngotDrawer — dismissable", () => {
  it("the default drawer closes on a backdrop click, not on a panel click", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("probe-panel"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.mouseDown(screen.getByTestId("probe"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("dismissable={false} leaves a backdrop click without effect, ESC keeps working", () => {
    render(<Harness dismissable={false} />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("probe"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("IngotDrawer — geometrie", () => {
  it("the default width is 400 px", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe-panel").style.width).toBe("400px");
  });

  it("the width has a hard cap of 560 px", () => {
    render(<Harness width={900} />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe-panel").style.width).toBe("560px");
  });

  it("side decides which edge the panel stands at", () => {
    const { unmount } = render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe").className).toContain("justify-end");
    unmount();

    render(<Harness side="left" />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe").className).toContain("justify-start");
  });

  it("the action footer is outside the scrolling body, so it is always visible", () => {
    render(
      <IngotDrawer
        title="Titulek"
        closeLabel="Zavřít"
        onClose={vi.fn()}
        testId="probe"
        footer={<button type="button">Uložit</button>}
      >
        <p>obsah</p>
      </IngotDrawer>,
    );
    const footer = screen.getByTestId("probe-footer");
    const body = screen.getByText("obsah").parentElement as HTMLElement;
    expect(body.className).toContain("overflow-auto");
    expect(footer.contains(screen.getByText("Uložit"))).toBe(true);
    expect(body.contains(footer)).toBe(false);
  });
});

describe("IngotDrawer — coexistence with IngotModal", () => {
  it("a drawer above a dialog does not unlock the background while the dialog stands", () => {
    function Stacked() {
      const [drawer, setDrawer] = useState(true);
      return (
        <IngotModal title="vnější" closeLabel="Zavřít" onClose={vi.fn()}>
          <button type="button" onClick={() => setDrawer(false)}>
            zavřít drawer
          </button>
          {drawer && (
            <IngotDrawer title="vnitřní" closeLabel="Zavřít" onClose={vi.fn()}>
              <p>obsah</p>
            </IngotDrawer>
          )}
        </IngotModal>
      );
    }
    render(<Stacked />);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByText("zavřít drawer"));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("drawer content is one level deeper — ModalDepthProvider is inside", () => {
    render(
      <Harness>
        <DepthProbe />
      </Harness>,
    );
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("depth")).toHaveTextContent("1");
  });
});
