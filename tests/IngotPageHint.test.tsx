/**
 * Nápověda stránky se žárovkou (KAN-659).
 *
 * Testy měří kontrakt ze specu PageHint v1.1:
 *
 * - klik na žárovku přidá cílům ``.is-hinted`` a po 2400 ms ji zase
 *   odebere (jednorázová akce, ne toggle),
 * - opakovaný klik uprostřed cyklu odpočet restartuje,
 * - ``visible={false}`` nekreslí nic — rozvržení a pořadí fokusu se
 *   nemění,
 * - unmount uprostřed cyklu cíle zhasne (třída žije na cizích
 *   prvcích, React ji sám neuklidí),
 * - reduced-motion větev je v CSS: probliknutí vypnuté, rámeček
 *   zůstane — test hlídá, že pravidlo v tokens.css nezmizí.
 *
 * ⏰ Falešné hodiny se zapínají PŘED renderem, ale bez posunu času —
 * memory: falešné hodiny POSUNUTÉ před mountem plánují časovače do
 * budoucnosti. Tady se čas jen zrychluje ``advanceTimersByTime``.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { IngotPageHint } from "@/ingot";

function Screen({
  visible = true,
  onDismiss,
  dismissible = false,
}: {
  visible?: boolean;
  onDismiss?: () => void;
  dismissible?: boolean;
}) {
  return (
    <div>
      <IngotPageHint
        title="Fronta výroby"
        targets={['[data-hint-target="queue"]', '[data-hint-target="filter"]']}
        visible={visible}
        dismissible={dismissible}
        onDismiss={onDismiss}
        testId="hint"
      >
        Přetáhněte zakázku myší a změňte její pořadí.
      </IngotPageHint>
      <div data-hint-target="queue" data-testid="queue" />
      <div data-hint-target="filter" data-testid="filter" />
    </div>
  );
}

describe("IngotPageHint", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });

  it("klik na žárovku zvýrazní všechny cíle a po 2400 ms zhasnou", () => {
    render(<Screen />);

    fireEvent.click(screen.getByTestId("hint-bulb"));
    expect(screen.getByTestId("queue")).toHaveClass("is-hinted");
    expect(screen.getByTestId("filter")).toHaveClass("is-hinted");

    act(() => vi.advanceTimersByTime(2399));
    expect(screen.getByTestId("queue")).toHaveClass("is-hinted");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("queue")).not.toHaveClass("is-hinted");
    expect(screen.getByTestId("filter")).not.toHaveClass("is-hinted");
  });

  it("opakovaný klik uprostřed cyklu restartuje odpočet", () => {
    render(<Screen />);

    fireEvent.click(screen.getByTestId("hint-bulb"));
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByTestId("hint-bulb"));

    act(() => vi.advanceTimersByTime(2399));
    expect(screen.getByTestId("queue")).toHaveClass("is-hinted");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("queue")).not.toHaveClass("is-hinted");
  });

  it("žárovka je tlačítko s popisným aria-label", () => {
    render(<Screen />);
    expect(
      screen.getByRole("button", {
        name: "Zvýraznit, čeho se nápověda týká",
      }),
    ).toBe(screen.getByTestId("hint-bulb"));
  });

  it("visible=false nekreslí nic", () => {
    render(<Screen visible={false} />);
    expect(screen.queryByTestId("hint")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("bez cílů se žárovka nekreslí jako tlačítko", () => {
    render(
      <IngotPageHint title="Sklad" testId="bare">
        Naskladněte materiál čtečkou.
      </IngotPageHint>,
    );
    expect(screen.queryByTestId("bare-bulb")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("křížek zavolá onDismiss", () => {
    const onDismiss = vi.fn();
    render(<Screen dismissible onDismiss={onDismiss} />);

    fireEvent.click(screen.getByTestId("hint-dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("unmount uprostřed cyklu cíle zhasne", () => {
    const { unmount } = render(
      <>
        <IngotPageHint
          title="Fronta výroby"
          targets={['[data-hint-target="outside"]']}
          testId="hint"
        >
          Přetáhněte zakázku myší.
        </IngotPageHint>
        <div data-hint-target="outside" data-testid="outside" />
      </>,
      { container: document.body.appendChild(document.createElement("div")) },
    );
    const outside = screen.getByTestId("outside");

    fireEvent.click(screen.getByTestId("hint-bulb"));
    expect(outside).toHaveClass("is-hinted");

    unmount();
    expect(outside).not.toHaveClass("is-hinted");
  });

  it("reduced-motion větev v CSS: probliknutí vypnuté, rámeček zůstane", () => {
    const css = readFileSync(
      join(process.cwd(), "src/ingot/tokens.css"),
      "utf-8",
    );
    // Rámeček je na třídě staticky — nezávisí na animaci.
    expect(css).toMatch(/\.is-hinted\s*\{[^}]*outline:\s*2px solid var\(--accent\)/);
    expect(css).toMatch(/outline-offset:\s*3px/);
    // Probliknutí trvá 2.4 s — musí sedět s INGOT_HINT_DURATION_MS.
    expect(css).toMatch(/animation:\s*ingot-hint-pulse\s*2\.4s/);
    // Pod prefers-reduced-motion se animace vypíná.
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.is-hinted\s*\{\s*animation:\s*none/,
    );
  });
});
