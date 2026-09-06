import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import { IngotModal, IngotPageHint, IngotRowActions, IngotStepCard } from "@/ingot";

/**
 * One icon button in the kit. The dialog's close cross, the page hint's
 * bulb and cross, the step card's chevron and the row actions used to be
 * five hand-drawn buttons with three sizes and three hover colours.
 */

const KIT_DIR = join(__dirname, "..", "src", "ingot");
const SHARED = ["grid", "place-items-center", "rounded", "h-7", "w-7"];

describe("icon button", () => {
  it("the five former call sites no longer write <button> themselves", () => {
    for (const file of [
      "OverlayHeader.tsx",
      "IngotPageHint.tsx",
      "IngotStepCard.tsx",
      "IngotRowActions.tsx",
    ]) {
      const src = readFileSync(join(KIT_DIR, file), "utf-8");
      expect(src, `${file} draws its own <button>`).not.toMatch(/<button\b/);
    }
  });

  it("dialog close button", () => {
    render(
      <IngotModal title="T" onClose={() => {}} closeLabel="Close" testId="m">
        <p>Body</p>
      </IngotModal>,
    );
    const close = screen.getByRole("button", { name: "Close" });
    for (const cls of SHARED) expect(close).toHaveClass(cls);
  });

  it("page hint bulb (accent) and dismiss (default)", () => {
    render(
      <IngotPageHint
        title="Hint"
        targets={["[data-x]"]}
        dismissible
        bulbLabel="Highlight"
        dismissLabel="Hide"
      >
        Text
      </IngotPageHint>,
    );
    const bulb = screen.getByRole("button", { name: "Highlight" });
    const hide = screen.getByRole("button", { name: "Hide" });
    for (const cls of SHARED) {
      expect(bulb).toHaveClass(cls);
      expect(hide).toHaveClass(cls);
    }
    expect(bulb).toHaveClass("text-accent");
    expect(hide).toHaveClass("text-ink-3");
  });

  it("step card toggle keeps aria-expanded and aria-controls", () => {
    render(
      <IngotStepCard step="1" kicker="K" title="T" collapsible toggleLabel="Toggle">
        <p>Body</p>
      </IngotStepCard>,
    );
    const toggle = screen.getByRole("button", { name: "Toggle" });
    for (const cls of SHARED) expect(toggle).toHaveClass(cls);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle.getAttribute("aria-controls")).toBeTruthy();
  });

  it("row actions: danger tone hovers red, disabled stays labelled", () => {
    render(
      <IngotRowActions
        actions={[
          { icon: "copy", label: "Copy", onClick: () => {} },
          {
            icon: "trash",
            label: "Delete",
            onClick: () => {},
            tone: "danger",
            disabled: true,
          },
        ]}
      />,
    );
    const del = screen.getByRole("button", { name: "Delete" });
    expect(del).toHaveClass("hover:text-danger");
    expect(del).toBeDisabled();
    for (const cls of SHARED) expect(del).toHaveClass(cls);
    expect(screen.getByRole("button", { name: "Copy" })).toHaveClass("hover:text-ink");
  });
});
