/**
 * Confirmation dialog (KAN-583) — the third Ingot primitive.
 *
 * Two things are measured here, and why exactly those:
 *
 * 1. **That it really runs through `IngotModal`.** If `IngotConfirm` made
 *    its own overlay again, the button tests would still pass — and the
 *    accessibility bar would quietly vanish. ESC, focus return to the
 *    trigger and the portal into `document.body` are shell properties;
 *    whether they hold here too is the only cheap proof that the shell is
 *    underneath. Hence they are measured here, not only in
 *    `IngotModal.test.tsx`.
 * 2. **Veto (KAN-422).** A greyed-out "Delete permanently" next to a reason
 *    reads to an operator as "wait a moment", so the button must not be
 *    offered at all. A test for `disabled` would not catch this regression
 *    — ABSENCE is checked.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { IngotConfirm, useConfirmVeto } from "@/ingot";

/**
 * Content of the `impact` slot that withdraws the confirmation — a probe
 * shaped like a real caller: the veto is reported from `useEffect`, not
 * from render.
 *
 * The effect doubles as a test of the setter's stable identity — if
 * `IngotConfirm` passed a new function on every render, the effect would
 * run again and again and this file would loop.
 */
function VetoingImpact({ reason }: { reason: ReactNode | null }) {
  const veto = useConfirmVeto();
  useEffect(() => {
    veto(reason);
  }, [veto, reason]);
  return <span data-testid="impact-body">dopad</span>;
}

function Harness({
  impact,
  busy,
  onConfirm = () => {},
}: {
  impact?: ReactNode;
  busy?: boolean;
  onConfirm?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        otevřít
      </button>
      {open && (
        <IngotConfirm
          title="Smazat trvale?"
          description="Tohle nejde vzít zpět."
          confirmLabel="Smazat"
          cancelLabel="Zrušit"
          closeLabel="Zavřít"
          busy={busy}
          impact={impact}
          onConfirm={onConfirm}
          onClose={() => setOpen(false)}
          testId="confirm-dialog"
        />
      )}
    </>
  );
}

describe("IngotConfirm — kostra a kontrakt", () => {
  it("the panel is a dialog labelled by its title", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("aria-modal", "true");
    const labelledBy = panel.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)).toHaveTextContent(
      "Smazat trvale?",
    );
  });

  it("confirm calls onConfirm, cancel closes", () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.click(screen.getByTestId("confirm-dialog-confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("confirm-dialog-cancel"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("busy locks both buttons", () => {
    render(<Harness busy />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(screen.getByTestId("confirm-dialog-confirm")).toBeDisabled();
    expect(screen.getByTestId("confirm-dialog-cancel")).toBeDisabled();
  });

  it("bez slotu se box dopadu nerenderuje", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(screen.queryByTestId("confirm-dialog-impact")).toBeNull();
  });
});

describe("IngotConfirm — runs through IngotModal, not through its own overlay", () => {
  it("ESC closes", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId("confirm-dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("a click on the backdrop closes, a click in the panel does not", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("confirm-dialog-panel"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("confirm-dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("focus returns to the trigger after close", () => {
    render(<Harness />);
    const opener = screen.getByTestId("opener");
    opener.focus();
    fireEvent.click(opener);
    expect(opener).not.toHaveFocus();

    fireEvent.click(screen.getByTestId("confirm-dialog-cancel"));
    expect(opener).toHaveFocus();
  });

  it("the dialog hangs on document.body, not at the call site", () => {
    const { container } = render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(container.querySelector("[role='dialog']")).toBeNull();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("IngotConfirm — veto from the impact slot (KAN-422)", () => {
  it("a veto REMOVES the confirm button and prints the reason", () => {
    render(<Harness impact={<VetoingImpact reason="Má objednávky." />} />);
    fireEvent.click(screen.getByTestId("opener"));

    // Absence, not disabled: a greyed-out button reads to an operator as
    // "wait a moment", not as "not this way".
    expect(screen.queryByTestId("confirm-dialog-confirm")).toBeNull();
    expect(screen.getByTestId("confirm-dialog-blocked")).toHaveTextContent(
      "Má objednávky.",
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    // Cancel stays — otherwise there is no way out of the dialog.
    expect(screen.getByTestId("confirm-dialog-cancel")).toBeInTheDocument();
  });

  it("a slot without a reason leaves the confirmation in place", () => {
    render(<Harness impact={<VetoingImpact reason={null} />} />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(screen.getByTestId("impact-body")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-dialog-confirm")).toBeInTheDocument();
    expect(screen.queryByTestId("confirm-dialog-blocked")).toBeNull();
  });
});
