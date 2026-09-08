/**
 * The touch target (KAN-1088).
 *
 * `Button size="md"` is 34 px, `IconButton` defaults to 28, a checkbox is
 * 16. Apple's HIG and WCAG 2.5.5 both ask for 44 x 44 on a finger, and on
 * a 390 px phone the row actions of a table and the close crosses are
 * exactly the controls people miss.
 *
 * What grows is the hit area, not the control: the visual size stays where
 * it is, so the 34 px line the filter bar stands on still holds and no
 * height becomes a major bump.
 *
 * jsdom measures no pseudo-element and no media query, so — as with the
 * focus ring — what is measured here is the CLASS each primitive carries,
 * plus the one thing that would make every such class meaningless: that
 * the preset really defines the utility behind it. A class with no CSS
 * behind it looks right in every test and does nothing on the device.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PluginAPI } from "tailwindcss/types/config";

import {
  Button,
  IngotCheckbox,
  IngotChip,
  IngotModal,
  IngotRadioGroup,
  IngotRowActions,
  IngotSwitch,
  IngotTabs,
} from "@/ingot";
import preset from "@/ingot/tailwind-preset";

/** Both shapes of the hit area, and the row that grows instead of one. */
const TOUCH = /touch-(?:target(?:-y)?|row)(?:\s|$)/;

/**
 * The utilities the preset's plugins register, flattened to one object.
 *
 * Read from the preset rather than from a built stylesheet: the preset IS
 * what a consumer installs, and a utility that exists only in the doc
 * web's own CSS would leave every class below drawing nothing in the two
 * applications that matter.
 */
function presetUtilities(): Record<string, unknown> {
  const collected: Record<string, unknown> = {};
  for (const plugin of preset.plugins) {
    (plugin as (api: PluginAPI) => void)({
      addUtilities: (utilities: Record<string, unknown>) =>
        Object.assign(collected, utilities),
    } as unknown as PluginAPI);
  }
  return collected;
}

describe("the utility exists where a consumer will look for it", () => {
  it("is registered by the package preset, not by the doc web's stylesheet", () => {
    const coarse = presetUtilities()["@media (pointer: coarse)"];
    expect(coarse).toBeDefined();
    expect(Object.keys(coarse as Record<string, unknown>)).toEqual([
      ".touch-target, .touch-target-y",
      ".touch-target::before",
      ".touch-target-y::before",
      ".touch-row",
    ]);
  });

  it("only ever adds to the hit area, never takes from it", () => {
    // In `inset` a percentage resolves against the element's own box —
    // height for top/bottom, WIDTH for left/right. Without the clamp, a
    // button wider than 44 px would have its sides pulled INWARD and the
    // target would end up narrower than the button it belongs to.
    const coarse = presetUtilities()["@media (pointer: coarse)"] as Record<
      string,
      Record<string, string>
    >;
    expect(coarse[".touch-target::before"].inset).toBe(
      "min(calc((100% - 44px) / 2), 0px)",
    );
  });

  it("costs a mouse nothing — every declaration sits under coarse", () => {
    const keys = Object.keys(presetUtilities());
    expect(keys.filter((key) => key.startsWith(".touch-"))).toEqual([]);
  });
});

describe("every control a finger reaches carries it", () => {
  it("a button grows in both axes — it has room around it", () => {
    render(<Button data-testid="btn">Uložit</Button>);
    expect(screen.getByTestId("btn").className).toContain("touch-target");
  });

  it("a row action grows only upward and downward", async () => {
    // `IngotRowActions` sets its buttons 2 px apart. A sideways hit area
    // would reach across the neighbour, and the tap would land on
    // whichever is later in the DOM — on a row holding Edit next to
    // Delete, that is not a rounding error.
    render(
      <IngotRowActions
        actions={[
          { icon: "copy", label: "Kopírovat", onClick: () => {} },
          { icon: "trash", label: "Smazat", tone: "danger", onClick: () => {} },
        ]}
        testId="actions"
      />,
    );
    const buttons = await screen.findAllByRole("button");
    for (const button of buttons) {
      expect(button.className).toContain("touch-target-y");
      expect(button.className).not.toMatch(/touch-target(?!-y)/);
    }
  });

  it("a dialog's close cross carries it too", () => {
    render(
      <IngotModal title="Titulek" onClose={() => {}} closeLabel="Zavřít" testId="modal">
        <p>Obsah</p>
      </IngotModal>,
    );
    expect(screen.getByTestId("modal-close").className).toMatch(TOUCH);
  });

  it("a switch grows in both axes", () => {
    render(<IngotSwitch checked onChange={() => {}} label="Zapnuto" testId="switch" />);
    expect(screen.getByTestId("switch").className).toContain("touch-target");
  });

  it("a checkbox grows its ROW — an input takes no pseudo-element", () => {
    // `::before` generates no box on a replaced element, so the 16 px
    // `<input>` cannot carry a hit area at all. The `<label>` wraps the
    // box and its text, so the whole 44 px row toggles.
    render(
      <IngotCheckbox checked onChange={() => {}} label="Souhlasím" testId="check" />,
    );
    const row = screen.getByTestId("check").closest("label");
    expect(row?.className).toContain("touch-row");
  });

  it("a radio grows its row, so stacked options do not cover each other", () => {
    render(
      <IngotRadioGroup
        label="Režim"
        value="a"
        onChange={() => {}}
        options={[
          { value: "a", label: "První", testId: "radio-a" },
          { value: "b", label: "Druhá" },
        ]}
      />,
    );
    expect(screen.getByTestId("radio-a").closest("label")?.className).toContain(
      "touch-row",
    );
  });

  it("a tab grows only upward and downward — tabs stand 4 px apart", () => {
    render(
      <IngotTabs
        items={[
          { key: "a", label: "První" },
          { key: "b", label: "Druhá" },
        ]}
        value="a"
        onChange={() => {}}
        testId="tabs"
      />,
    );
    expect(screen.getByTestId("tabs-tab-a").className).toContain("touch-target-y");
  });

  it("a chip's remove cross grows only upward and downward", () => {
    render(
      <IngotChip onRemove={() => {}} removeLabel="Odebrat filtr" testId="chip">
        Filtr
      </IngotChip>,
    );
    expect(screen.getByTestId("chip-remove").className).toContain("touch-target-y");
  });
});
