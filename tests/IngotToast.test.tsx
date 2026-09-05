/**
 * Imperative toast (KAN-656).
 *
 * The tests measure the contract from the Toast v1.0 spec:
 *
 * - default lifetime 4 s; a toast with an undo action lives 8 s;
 *   ``duration`` overrides both,
 * - "Undo" calls the undo action and closes the toast,
 * - ``tone="default"`` announces ``polite``, ``tone="danger"``
 *   ``assertive`` — an operation error must not wait until the screen
 *   reader finishes talking.
 *
 * Fake timers are switched on BEFORE the render, but without shifting
 * time — fake timers SHIFTED before mount schedule timers into the future.
 * Here time is only accelerated with ``advanceTimersByTime``.
 *
 * The toast queue is a module-level store, not component state — every
 * test therefore ends with ``runAllTimers`` to empty the queue after itself.
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { IngotToast, toast } from "@/ingot";

function fire(options: Parameters<typeof toast>[0]) {
  act(() => toast(options));
}

describe("IngotToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });

  it("prints the text and disappears by itself after 4 s", () => {
    render(<IngotToast />);
    fire({ text: "Objednávka uložena." });

    expect(screen.getByText("Objednávka uložena.")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3999));
    expect(screen.getByText("Objednávka uložena.")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Objednávka uložena.")).toBeNull();
  });

  it("a toast with an undo action lives 8 s", () => {
    render(<IngotToast />);
    fire({ text: "Materiál odebrán.", undo: vi.fn() });

    act(() => vi.advanceTimersByTime(4001));
    expect(screen.getByText("Materiál odebrán.")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText("Materiál odebrán.")).toBeNull();
  });

  it("duration overrides the default lifetime and the 8 s with an undo action", () => {
    render(<IngotToast />);
    fire({ text: "Krátký toast.", undo: vi.fn(), duration: 1000 });

    act(() => vi.advanceTimersByTime(1001));
    expect(screen.queryByText("Krátký toast.")).toBeNull();
  });

  it("Undo calls the undo action and closes the toast", () => {
    const undo = vi.fn();
    render(<IngotToast />);
    fire({ text: "Materiál odebrán.", undo });

    fireEvent.click(screen.getByRole("button", { name: "Zpět" }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Materiál odebrán.")).toBeNull();
  });

  it("undoLabel overrides the default Undo label", () => {
    render(<IngotToast />);
    fire({ text: "Removed.", undo: vi.fn(), undoLabel: "Undo" });

    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("without an undo action the toast has no button", () => {
    render(<IngotToast />);
    fire({ text: "Objednávka uložena." });

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("the default tone announces polite, danger assertive", () => {
    render(<IngotToast />);
    fire({ text: "Objednávka uložena." });
    fire({ text: "Uložení se nepovedlo.", tone: "danger" });

    const saved = screen.getByText("Objednávka uložena.");
    const failed = screen.getByText("Uložení se nepovedlo.");
    expect(
      (saved.closest("[aria-live]") as HTMLElement).getAttribute("aria-live"),
    ).toBe("polite");
    expect(
      (failed.closest("[aria-live]") as HTMLElement).getAttribute("aria-live"),
    ).toBe("assertive");
  });

  it("several toasts stack and each disappears on its own", () => {
    render(<IngotToast />);
    fire({ text: "První." });
    act(() => vi.advanceTimersByTime(2000));
    fire({ text: "Druhý." });

    expect(screen.getAllByTestId("ingot-toast")).toHaveLength(2);

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText("První.")).toBeNull();
    expect(screen.getByText("Druhý.")).toBeInTheDocument();
  });
});
