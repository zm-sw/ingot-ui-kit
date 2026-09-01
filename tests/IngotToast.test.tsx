/**
 * Imperativní toast (KAN-656).
 *
 * Testy měří kontrakt ze specu Toast v1.0:
 *
 * - výchozí život 4 s; toast se zpětnou akcí žije 8 s; ``duration``
 *   obojí přebíjí,
 * - „Zpět" zavolá zpětnou akci a toast zavře,
 * - ``tone="default"`` se hlásí ``polite``, ``tone="danger"``
 *   ``assertive`` — chyba operace nesmí čekat, až odečítač domluví.
 *
 * ⏰ Falešné hodiny se zapínají PŘED renderem, ale bez posunu času —
 * memory: falešné hodiny POSUNUTÉ před mountem plánují časovače do
 * budoucnosti. Tady se čas jen zrychluje ``advanceTimersByTime``.
 *
 * Fronta toastů je modulový sklad, ne stav komponenty — každý test
 * proto končí ``runAllTimers``, aby po sobě frontu vyprázdnil.
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

  it("vypíše text a po 4 s sám zmizí", () => {
    render(<IngotToast />);
    fire({ text: "Objednávka uložena." });

    expect(screen.getByText("Objednávka uložena.")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3999));
    expect(screen.getByText("Objednávka uložena.")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Objednávka uložena.")).toBeNull();
  });

  it("toast se zpětnou akcí žije 8 s", () => {
    render(<IngotToast />);
    fire({ text: "Materiál odebrán.", undo: vi.fn() });

    act(() => vi.advanceTimersByTime(4001));
    expect(screen.getByText("Materiál odebrán.")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText("Materiál odebrán.")).toBeNull();
  });

  it("duration přebíjí výchozí život i osmivteřinovku se zpětnou akcí", () => {
    render(<IngotToast />);
    fire({ text: "Krátký toast.", undo: vi.fn(), duration: 1000 });

    act(() => vi.advanceTimersByTime(1001));
    expect(screen.queryByText("Krátký toast.")).toBeNull();
  });

  it("Zpět zavolá zpětnou akci a toast zavře", () => {
    const undo = vi.fn();
    render(<IngotToast />);
    fire({ text: "Materiál odebrán.", undo });

    fireEvent.click(screen.getByRole("button", { name: "Zpět" }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Materiál odebrán.")).toBeNull();
  });

  it("undoLabel přebíjí výchozí popisek Zpět", () => {
    render(<IngotToast />);
    fire({ text: "Removed.", undo: vi.fn(), undoLabel: "Undo" });

    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("bez zpětné akce toast žádné tlačítko nemá", () => {
    render(<IngotToast />);
    fire({ text: "Objednávka uložena." });

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("výchozí tone se hlásí polite, danger assertive", () => {
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

  it("víc toastů se řadí pod sebe a mizí každý po svém", () => {
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
