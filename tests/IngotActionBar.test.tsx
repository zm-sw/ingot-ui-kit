/**
 * The bar under a long form (KAN-957).
 *
 * Nothing in the kit did this, so screens did it themselves: either a
 * `fixed` block covering the last field — which is worse than no bar,
 * because the field it hides is the one being filled in — or nothing at
 * all, with Save at the bottom of a page nobody scrolled to.
 *
 * The design decision worth holding is `sticky` rather than `fixed`. A
 * sticky element stays in the document's flow, so it reserves its own
 * height and cannot cover anything; a fixed one needs its height measured,
 * that height added to the container, and a watch on resize — three
 * things, one of which is always wrong on the screen nobody tested. That
 * is what the first test here is about, and it is the kind of thing that
 * is silently "fixed" back by whoever finds `fixed` more obvious.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button, IngotActionBar } from "@/ingot";

const SAVE = <Button variant="accent">Uložit</Button>;

describe("the bar", () => {
  it("is sticky, so it reserves its height instead of covering the last field", () => {
    render(<IngotActionBar primary={SAVE} testId="bar" />);
    const bar = screen.getByTestId("bar");
    expect(bar.className).toContain("sticky");
    // `fixed` is the change to watch for: it looks identical until the
    // form is long enough for the bar to sit over its own last field.
    expect(bar.className).not.toContain("fixed");
  });

  it("puts what undoes far from what commits", () => {
    render(
      <IngotActionBar
        primary={SAVE}
        secondary={<Button variant="ghost">Zahodit změny</Button>}
        testId="bar"
      />,
    );
    const bar = screen.getByTestId("bar");
    const text = bar.textContent ?? "";
    // Two actions side by side get pressed wrong; the reader's hand ends
    // up on the right after the last field, so that is where Save goes.
    expect(text.indexOf("Zahodit")).toBeLessThan(text.indexOf("Uložit"));
  });

  it("says the state in words, not only with a mark", () => {
    render(
      <IngotActionBar primary={SAVE} dirty status="Neuložené změny" testId="bar" />,
    );
    expect(screen.getByText("Neuložené změny")).toBeInTheDocument();
    const dot = screen.getByTestId("bar-dirty");
    // The dot is what a skimming eye catches; the sentence beside it is
    // what a screen reader reads. Announcing "dot" would add nothing.
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it("draws no mark when nothing has changed", () => {
    render(<IngotActionBar primary={SAVE} status="Uloženo" testId="bar" />);
    expect(screen.queryByTestId("bar-dirty")).toBeNull();
    expect(screen.getByText("Uloženo")).toBeInTheDocument();
  });

  it("says nothing at all when the screen gives it nothing to say", () => {
    render(<IngotActionBar primary={SAVE} testId="bar" />);
    expect(screen.getByTestId("bar").textContent).toBe("Uložit");
  });
});

describe("the save shortcut", () => {
  it("saves on Ctrl+S when the screen asked for it", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<IngotActionBar primary={SAVE} onSave={onSave} testId="bar" />);

    await user.keyboard("{Control>}s{/Control}");
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does not touch the browser's Save when the screen did not ask", async () => {
    // Under a list the shortcut would steal Ctrl+S from a reader who
    // wanted the page, which is why it is off by default.
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    document.addEventListener("keydown", onKeyDown);
    render(<IngotActionBar primary={SAVE} testId="bar" />);

    await user.keyboard("{Control>}s{/Control}");
    expect(onKeyDown).toHaveBeenCalled();
    expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(false);
    document.removeEventListener("keydown", onKeyDown);
  });

  it("stops listening once the bar is gone", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const { unmount } = render(
      <IngotActionBar primary={SAVE} onSave={onSave} testId="bar" />,
    );
    unmount();

    await user.keyboard("{Control>}s{/Control}");
    expect(onSave).not.toHaveBeenCalled();
  });
});
