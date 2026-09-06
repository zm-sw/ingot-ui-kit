/**
 * `IngotChip` (KAN-944).
 *
 * A chip is the primitive most easily built wrong, because the wrong
 * version looks exactly right. Seven screens drew their own before this
 * one existed, and what those copies lost was never the pixels — it was
 * that the pill has to be a BUTTON. So what is measured here is the half a
 * screenshot cannot show:
 *
 * 1. **A chip is a control**, with a role and a pressed state, not a
 *    `<span>` a mouse happens to be able to hit.
 * 2. **The cross has a name of its own**, and it names the chip it drops.
 *    A row of chips otherwise offers a handful of buttons all called
 *    "remove".
 * 3. **Pressed is not told by colour alone** — the chip inverts, and
 *    `aria-pressed` says it in words.
 * 4. **The row has a name**, so a screen reader learns what it filters.
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { IngotChip, IngotChipGroup } from "@/ingot";

describe("IngotChip as a toggle", () => {
  it("is a button that reports its pressed state, not a piece of text", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <IngotChip pressed={false} onToggle={onToggle} testId="turning">
        Soustružení
      </IngotChip>,
    );

    // getByRole passes only for a real control. The hand-drawn copies this
    // primitive replaces were spans, and a keyboard never reached them.
    const chip = screen.getByRole("button", { name: "Soustružení" });
    expect(chip).toHaveAttribute("aria-pressed", "false");

    await user.click(chip);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("says it is on in words, not only by inverting", () => {
    render(
      <IngotChip pressed onToggle={() => undefined} testId="turning">
        Soustružení
      </IngotChip>,
    );

    const chip = screen.getByTestId("turning");
    expect(chip).toHaveAttribute("aria-pressed", "true");
    // Figure and ground swap, which survives greyscale — colour is never
    // the only carrier of the state.
    expect(chip.className).toContain("bg-ink");
    expect(chip.className).toContain("text-surface");
  });

  it("is reachable and operable from the keyboard", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <IngotChip pressed={false} onToggle={onToggle} testId="turning">
        Soustružení
      </IngotChip>,
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByTestId("turning"));
    await user.keyboard("{Enter}");
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("leaves the keyboard's reach when disabled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <IngotChip pressed={false} onToggle={onToggle} disabled testId="turning">
        Soustružení
      </IngotChip>,
    );

    await user.click(screen.getByTestId("turning"));
    expect(onToggle).not.toHaveBeenCalled();
  });
});

describe("IngotChip that can be removed", () => {
  it("gives the cross a name that says which chip it drops", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <IngotChip onRemove={onRemove} removeLabel="Odebrat: Zakázky" testId="orders">
        Zakázky
      </IngotChip>,
    );

    // Not "Odebrat" — eight chips would offer eight buttons under one name.
    const cross = screen.getByRole("button", { name: "Odebrat: Zakázky" });
    expect(cross).toBe(screen.getByTestId("orders-remove"));

    await user.click(cross);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("offers exactly one button — the text itself is not a control", () => {
    render(
      <IngotChip onRemove={() => undefined} removeLabel="Odebrat: Sklad" testId="stock">
        Sklad
      </IngotChip>,
    );

    // The chip's own element is a span: there is nothing to do to the text
    // except take it away, and a button inside a button is invalid HTML.
    expect(screen.getByTestId("stock").tagName).toBe("SPAN");
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});

describe("IngotChipGroup", () => {
  it("names the row, so the chips are not loose buttons", () => {
    render(
      <IngotChipGroup label="Filtr podle operace" testId="filters">
        <IngotChip pressed onToggle={() => undefined}>
          Soustružení
        </IngotChip>
        <IngotChip pressed={false} onToggle={() => undefined}>
          Frézování
        </IngotChip>
      </IngotChipGroup>,
    );

    const group = screen.getByRole("group", { name: "Filtr podle operace" });
    expect(within(group).getAllByRole("button")).toHaveLength(2);
  });
});
