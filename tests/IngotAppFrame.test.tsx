/**
 * The frame of a whole screen (KAN-954).
 *
 * `IngotPageLayout` documented the outer frame — 1440 px, page margins —
 * as "held by the shell", and no shell existed in the kit. So every
 * application built one: the doc web wrote `max-w-7xl` by hand, which is
 * 1280, while the handoff and `IngotTopNav`'s own documentation both say
 * 1440; the reference consumer wrote nothing and ran edge to edge.
 *
 * Nothing about that is visible in one screenshot. It shows up the day two
 * products built out of the same buttons are opened side by side and are
 * not the same width — and by then the number is written in a dozen files.
 *
 * So what is measured here is that the width has ONE source, that a bar
 * spans the window while its row does not, and that the escape hatch for a
 * screen which really is a wide table exists.
 */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotAppFrame, INGOT_FRAME_ROW } from "@/ingot";

describe("the frame of a screen", () => {
  it("limits the content to the frame token, not to a number of its own", () => {
    render(
      <IngotAppFrame testId="frame">
        <p>Obsah</p>
      </IngotAppFrame>,
    );
    const content = screen.getByText("Obsah").parentElement;
    expect(content?.className).toContain("max-w-frame");
  });

  it("lets a screen that IS the data reach both edges", () => {
    // A wide table, a plan, a board. A limit there does not protect the
    // reader — it hides columns from them.
    render(
      <IngotAppFrame width="full" testId="frame">
        <p>Tabulka</p>
      </IngotAppFrame>,
    );
    expect(screen.getByText("Tabulka").parentElement?.className).not.toContain(
      "max-w-frame",
    );
  });

  it("keeps margins beside the content at both widths", () => {
    // Without them the text touches the edge of the window on a phone,
    // which is the one place the frame's width is not doing anything.
    for (const width of ["app", "full"] as const) {
      const { unmount } = render(
        <IngotAppFrame width={width}>
          <p>{width}</p>
        </IngotAppFrame>,
      );
      expect(screen.getByText(width).parentElement?.className).toMatch(/\bpx-4\b/);
      unmount();
    }
  });

  it("spans the window with the bar while its row stays in the frame", () => {
    // The bar's border has to reach both edges or the page looks cut out;
    // the things inside it have to line up with the content underneath.
    // That is the whole reason INGOT_FRAME_ROW is exported.
    render(
      <IngotAppFrame
        testId="frame"
        bar={
          <header>
            <div className={INGOT_FRAME_ROW} data-testid="bar-row">
              Lišta
            </div>
          </header>
        }
      >
        <p>Obsah</p>
      </IngotAppFrame>,
    );

    const row = screen.getByTestId("bar-row");
    expect(row.className).toContain("max-w-frame");
    // The same width the content gets — one frame, not two that happen to
    // agree today.
    expect(INGOT_FRAME_ROW).toContain("max-w-frame");
    expect(row.closest("header")?.className ?? "").not.toContain("max-w-frame");
  });

  it("sticks the bar to the window under the overlays, not over them", () => {
    render(
      <IngotAppFrame testId="frame" bar={<header data-testid="bar">Lišta</header>}>
        <p>Obsah</p>
      </IngotAppFrame>,
    );
    const wrapper = screen.getByTestId("bar").parentElement;
    expect(wrapper?.className).toContain("sticky");
    // Below the modal, the drawer and the toast: a bar an open popover
    // disappears behind is worse than one that does not stick at all.
    expect(wrapper?.className).toContain("z-30");
  });

  it("draws no bar when it is given none", () => {
    // A frame is not a shell that insists on chrome — a login screen and a
    // print view have no bar and are still screens.
    render(
      <IngotAppFrame testId="frame">
        <p>Obsah</p>
      </IngotAppFrame>,
    );
    expect(within(screen.getByTestId("frame")).queryByRole("banner")).toBeNull();
    expect(screen.getByTestId("frame").children).toHaveLength(1);
  });
});
