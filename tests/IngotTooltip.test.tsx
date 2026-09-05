/**
 * The tooltip, and what it replaces (KAN-847).
 *
 * The `title` attribute looks like a tooltip and is not one: the browser
 * decides the delay and the styling, a touch screen never shows it, and a
 * screen reader may or may not read it. `IngotRowActions` documented an
 * entire row of unlabelled icon buttons through it.
 *
 * What is measured:
 *
 * 1. **It describes, it does not name.** `aria-describedby`, so a screen
 *    reader says the button's own name and then the description — instead
 *    of the same words twice.
 * 2. **Focus shows it, and shows it at once.** A keyboard user has already
 *    said what they mean by landing there; a delay reads as nothing
 *    happening.
 * 3. **Escape hides it** while the pointer stays (WCAG 1.4.13).
 * 4. **The row actions carry no `title` any more** — the regression that
 *    would put the browser tooltip back is invisible on screen.
 */
import { fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { INGOT_TOOLTIP_DELAY_MS, IngotRowActions, IngotTooltip } from "@/ingot";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("IngotTooltip", () => {
  it("appears after the delay on hover and is tied by aria-describedby", () => {
    render(
      <IngotTooltip text="Naceňuje se z platných cen." testId="tip">
        <button type="button">Přepočítat</button>
      </IngotTooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Přepočítat" });

    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(INGOT_TOOLTIP_DELAY_MS - 1);
    });
    expect(screen.queryByRole("tooltip")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(2);
    });
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("Naceňuje se z platných cen.");
    // Describes, not names: the button keeps its own accessible name.
    expect(trigger).toHaveAttribute("aria-describedby", tip.id);
    expect(trigger).toHaveAccessibleName("Přepočítat");
  });

  it("leaving hides it", () => {
    render(
      <IngotTooltip text="Popis" testId="tip">
        <button type="button">Přepočítat</button>
      </IngotTooltip>,
    );
    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(INGOT_TOOLTIP_DELAY_MS);
    });
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("focus shows it at once — the keyboard is not a second class", () => {
    render(
      <IngotTooltip text="Popis" testId="tip">
        <button type="button">Přepočítat</button>
      </IngotTooltip>,
    );

    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("Escape hides it even while the pointer stays", () => {
    render(
      <IngotTooltip text="Popis" testId="tip">
        <button type="button">Přepočítat</button>
      </IngotTooltip>,
    );

    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("keeps the trigger's own handlers", () => {
    const onFocus = vi.fn();
    const onMouseEnter = vi.fn();
    render(
      <IngotTooltip text="Popis">
        <button type="button" onFocus={onFocus} onMouseEnter={onMouseEnter}>
          Přepočítat
        </button>
      </IngotTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole("button"));
    fireEvent.focus(screen.getByRole("button"));
    expect(onMouseEnter).toHaveBeenCalledOnce();
    expect(onFocus).toHaveBeenCalledOnce();
  });
});

describe("IngotRowActions", () => {
  it("describes its icon buttons with a tooltip, not with title", () => {
    render(
      <IngotRowActions
        actions={[
          { icon: "copy", label: "Duplikovat objednávku", onClick: vi.fn() },
          {
            icon: "trash",
            label: "Smazat objednávku",
            tone: "danger",
            onClick: vi.fn(),
          },
        ]}
        testId="actions"
      />,
    );

    const duplicate = screen.getByRole("button", { name: "Duplikovat objednávku" });
    // The browser tooltip is gone: it never shows on touch and a screen
    // reader may skip it, which for an unlabelled icon is the whole label.
    expect(duplicate).not.toHaveAttribute("title");

    fireEvent.focus(duplicate);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Duplikovat objednávku");
  });
});
