/**
 * Page hint with the bulb (KAN-659).
 *
 * The tests measure the contract from the PageHint v1.1 spec:
 *
 * - a click on the bulb adds ``.is-hinted`` to the targets and removes it
 *   again after 2400 ms (a one-shot action, not a toggle),
 * - a repeated click mid-cycle restarts the countdown,
 * - ``visible={false}`` renders nothing — layout and focus order do not
 *   change,
 * - unmount mid-cycle turns the targets off (the class lives on foreign
 *   elements, React does not clean it up itself),
 * - the reduced-motion branch is in CSS: the flash is off, the frame stays
 *   — the test guards that the rule in tokens.css does not vanish.
 *
 * Fake timers are switched on BEFORE the render, but without shifting
 * time — fake timers SHIFTED before mount schedule timers into the future.
 * Here time is only accelerated with ``advanceTimersByTime``.
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

  it("a click on the bulb highlights every target and they go dark after 2400 ms", () => {
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

  it("a repeated click mid-cycle restarts the countdown", () => {
    render(<Screen />);

    fireEvent.click(screen.getByTestId("hint-bulb"));
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByTestId("hint-bulb"));

    act(() => vi.advanceTimersByTime(2399));
    expect(screen.getByTestId("queue")).toHaveClass("is-hinted");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("queue")).not.toHaveClass("is-hinted");
  });

  it("the bulb is a button with a descriptive aria-label", () => {
    render(<Screen />);
    expect(
      screen.getByRole("button", {
        name: "Highlight what this hint is about",
      }),
    ).toBe(screen.getByTestId("hint-bulb"));
  });

  it("visible=false renders nothing", () => {
    render(<Screen visible={false} />);
    expect(screen.queryByTestId("hint")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("without targets the bulb is not rendered as a button", () => {
    render(
      <IngotPageHint title="Sklad" testId="bare">
        Naskladněte materiál čtečkou.
      </IngotPageHint>,
    );
    expect(screen.queryByTestId("bare-bulb")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("the close button calls onDismiss", () => {
    const onDismiss = vi.fn();
    render(<Screen dismissible onDismiss={onDismiss} />);

    fireEvent.click(screen.getByTestId("hint-dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("unmount mid-cycle turns the targets off", () => {
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

  it("reduced-motion branch in CSS: the flash is off, the frame stays", () => {
    const css = readFileSync(join(process.cwd(), "src/ingot/tokens.css"), "utf-8");
    // The frame is on the class statically — independent of the animation.
    expect(css).toMatch(/\.is-hinted\s*\{[^}]*outline:\s*2px solid var\(--accent\)/);
    expect(css).toMatch(/outline-offset:\s*3px/);
    // The flash lasts 2.4 s — it has to match INGOT_HINT_DURATION_MS.
    expect(css).toMatch(/animation:\s*ingot-hint-pulse\s*2\.4s/);
    // Under prefers-reduced-motion the animation is switched off.
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.is-hinted\s*\{\s*animation:\s*none/,
    );
  });
});
