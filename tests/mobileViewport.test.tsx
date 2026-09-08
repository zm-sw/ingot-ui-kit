/**
 * The mobile viewport (KAN-1087) — dynamic height and the iOS safe areas.
 *
 * Two failures that only ever appear on a phone, and that nobody sees in a
 * review of the diff:
 *
 * 1. **`vh` is not the height of the screen on iOS Safari.** It is the
 *    height the window has with the browser chrome RETRACTED, and it does
 *    not change when the chrome comes back out. So a frame at `min-h-screen`
 *    measures more than is visible, and a dialog at `max-h-[90vh]` reaches
 *    past the bottom edge — taking its sticky footer, the one holding Save,
 *    with it. `dvh` follows the chrome.
 * 2. **The safe areas are read through `env()`, which jsdom deletes.**
 *    Every value below is set as an inline style, and jsdom's CSS parser
 *    drops any declaration whose value it cannot parse — `env()` included.
 *    So `element.style.paddingTop` is the empty string here even when the
 *    component sets it, and a test rendering the component would pass just
 *    as happily with the padding removed.
 *
 * That is why the safe areas are measured over the SOURCE. It is a blunt
 * instrument, and it is the only one that fails when the padding is gone:
 * the alternative is a test that measures nothing and says so to nobody.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotAppFrame, IngotModal } from "@/ingot";

function kitSource(file: string): string {
  return readFileSync(join(process.cwd(), "src/ingot", file), "utf8");
}

describe("height follows the browser chrome, not the retracted window", () => {
  it("gives the frame a dynamic minimum height", () => {
    render(
      <IngotAppFrame testId="frame">
        <p>Obsah</p>
      </IngotAppFrame>,
    );
    const frame = screen.getByTestId("frame");
    expect(frame.className).toContain("min-h-[100dvh]");
    // `min-h-screen` is `100vh`, which is the regression to watch for: it
    // looks right everywhere except on the device it is wrong on.
    expect(frame.className).not.toContain("min-h-screen");
  });

  it("caps the dialog against the dynamic viewport", () => {
    render(
      <IngotModal title="Titulek" onClose={() => {}} closeLabel="Zavřít" testId="modal">
        <p>Obsah</p>
      </IngotModal>,
    );
    const panel = screen.getByTestId("modal-panel");
    expect(panel.className).toContain("max-h-[90dvh]");
    expect(panel.className).not.toContain("90vh");
  });
});

describe("the safe areas are read where the screen has an edge", () => {
  it("pads the top bar's surface above the notch", () => {
    expect(kitSource("IngotTopNav.tsx")).toContain(
      'paddingTop: "env(safe-area-inset-top, 0px)"',
    );
  });

  it("adds the bottom inset to the action bar's own padding", () => {
    // Added rather than replacing: with no inset the bar has to keep the
    // padding it had, or the change would be visible on every desktop.
    expect(kitSource("IngotActionBar.tsx")).toContain(
      'paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))"',
    );
  });

  it("pads the drawer on the side it slid in from", () => {
    const source = kitSource("IngotDrawer.tsx");
    expect(source).toContain('side === "left" ? "env(safe-area-inset-left, 0px)"');
    expect(source).toContain('side === "right" ? "env(safe-area-inset-right, 0px)"');
  });

  it("switches the insets on in the doc web's own document", () => {
    // `env()` returns zero without this, so the padding above would be
    // dead code on the one page that demonstrates it.
    const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
    expect(html).toContain("viewport-fit=cover");
  });
});
