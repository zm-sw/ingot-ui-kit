/**
 * Where the keyboard is (KAN-953).
 *
 * Three of fourteen interactive primitives defined a visible focus state.
 * On the other eleven the ring was whatever the browser draws by default —
 * a different shape in Chrome, Safari and Firefox, and in none of the
 * kit's colours. On a dark button several of those defaults are a thin
 * dark line on a dark ground, which is to say: nothing.
 *
 * That is not a polish item. Someone who navigates by keyboard and cannot
 * see where they are cannot use the control at all, and the failure is
 * invisible to everyone else — nobody driving with a mouse ever sees it.
 *
 * So the ring is two tokens and one utility now, and this measures that
 * every primitive reaches for it. jsdom computes no styles worth reading,
 * so what is measured is the class the element carries: the class is what
 * the guard enforces and what the preset turns into the ring.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Button,
  IngotAccentSwatches,
  IngotBreadcrumbs,
  IngotCheckbox,
  IngotChip,
  IngotRadioGroup,
  IngotSegmented,
  IngotSwitch,
  IngotTabs,
} from "@/ingot";
import { INGOT_TOKEN_VALUES } from "@/ingot/tokens.generated";

/** The three shapes the ring takes, all from the same two tokens. */
const RING = /focus-ring(?:-inset|-within)?(?:\s|$)/;

describe("the focus ring is one decision", () => {
  it("is a token, so it moves for the whole kit at once", () => {
    // The width and the offset are in tokens.json; the colour is --accent,
    // which is why the ring changes with the accent family and nobody has
    // to maintain five rings.
    const css = INGOT_TOKEN_VALUES;
    expect(Object.keys(css)).toContain("accent");
  });

  it("lands on the element the keyboard reaches, not on its container", async () => {
    const user = userEvent.setup();
    render(
      <Button data-testid="target" onClick={() => {}}>
        Uložit
      </Button>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByTestId("target"));
    expect(document.activeElement?.className).toMatch(RING);
  });
});

describe("every interactive primitive draws it", () => {
  it("Button", () => {
    render(<Button data-testid="b">Uložit</Button>);
    expect(screen.getByTestId("b").className).toMatch(RING);
  });

  it("IngotSwitch", () => {
    render(
      <IngotSwitch checked={false} onChange={() => {}} label="Zapnuto" testId="sw" />,
    );
    expect(screen.getByTestId("sw").className).toMatch(RING);
  });

  it("IngotCheckbox", () => {
    render(
      <IngotCheckbox checked={false} onChange={() => {}} label="Souhlas" testId="cb" />,
    );
    expect(screen.getByTestId("cb").className).toMatch(RING);
  });

  it("IngotChip", () => {
    render(
      <IngotChip pressed={false} onToggle={() => {}} testId="chip">
        Aktivní
      </IngotChip>,
    );
    expect(screen.getByTestId("chip").className).toMatch(RING);
  });

  it("IngotTabs", () => {
    render(
      <IngotTabs
        items={[{ key: "a", label: "Jedna" }]}
        value="a"
        onChange={() => {}}
        label="Sekce"
        testId="tabs"
      />,
    );
    // The ring is on the tab, not on the bar: a roving tabindex means only
    // one tab is focusable, and it is the one the reader stands on.
    expect(screen.getByTestId("tabs-tab-a").className).toMatch(RING);
  });

  it("IngotSegmented", () => {
    render(
      <IngotSegmented
        options={[{ value: "a", label: "A" }]}
        value="a"
        onChange={() => {}}
        label="Hustota"
        testId="seg"
      />,
    );
    expect(screen.getByTestId("seg-a").className).toMatch(RING);
  });

  it("IngotRadioGroup", () => {
    render(
      <IngotRadioGroup
        label="Tarif"
        value="a"
        onChange={() => {}}
        options={[{ value: "a", label: "Základ", testId: "radio" }]}
      />,
    );
    expect(screen.getByTestId("radio").className).toMatch(RING);
  });

  it("IngotAccentSwatches", () => {
    render(
      <IngotAccentSwatches
        value="blue"
        onChange={() => {}}
        groupLabel="Akcent"
        optionLabel={(choice) => `Akcent ${choice}`}
      />,
    );
    expect(screen.getByTestId("accent-swatch-blue").className).toMatch(RING);
  });

  it("IngotBreadcrumbs", () => {
    render(
      <IngotBreadcrumbs
        items={[{ label: "Domů", href: "/" }, { label: "Zakázka" }]}
        label="Drobečky"
      />,
    );
    // A breadcrumb is a link and gets the ring for the same reason a button
    // does — it is a stop on the way through the page with the keyboard.
    expect(screen.getByRole("link", { name: "Domů" }).className).toMatch(RING);
  });
});
