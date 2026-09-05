/**
 * The floating panel and where it lands (KAN-847).
 *
 * Two halves, measured differently on purpose.
 *
 * **The arithmetic** (``placePanel``) is pure, so the flip and the shift
 * can be measured with numbers. jsdom has no layout: every rectangle it
 * reports is zero, so a test that rendered a panel and asked where it
 * ended up would pass over any bug at all.
 *
 * **The behaviour** is measured on the rendered panel, and it is the part
 * that used to be written four times over in this kit: what closes it,
 * what does NOT close it, and where focus goes afterwards. The click on
 * the anchor is the subtle one — closing there as well would make the
 * anchor's own handler reopen the panel on the very same click.
 */
import { useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotPopover } from "@/ingot";
import { PLACEMENT_GAP, placePanel } from "@/ingot/placement";

const VIEWPORT = { width: 1000, height: 800 };

describe("placePanel", () => {
  const anchor = { top: 100, left: 200, width: 120, height: 40 };
  const panel = { width: 200, height: 150 };

  it("hangs a bottom-start panel under the anchor's left edge", () => {
    const placed = placePanel({ anchor, panel, viewport: VIEWPORT });
    expect(placed).toEqual({
      top: 100 + 40 + PLACEMENT_GAP,
      left: 200,
      placement: "bottom-start",
    });
  });

  it("aligns a bottom-end panel with the anchor's right edge", () => {
    const placed = placePanel({
      anchor,
      panel,
      placement: "bottom-end",
      viewport: VIEWPORT,
    });
    expect(placed.left).toBe(200 + 120 - 200);
  });

  it("flips above the anchor when the panel would not fit below", () => {
    const low = { ...anchor, top: 700 };
    const placed = placePanel({ anchor: low, panel, viewport: VIEWPORT });
    expect(placed.placement).toBe("top-start");
    expect(placed.top).toBe(700 - 150 - PLACEMENT_GAP);
  });

  it("stays put when it fits neither way — a smaller space is not an improvement", () => {
    const tall = { width: 200, height: 790 };
    const placed = placePanel({
      anchor: { ...anchor, top: 400 },
      panel: tall,
      viewport: VIEWPORT,
    });
    expect(placed.placement).toBe("bottom-start");
  });

  it("slides along the edge instead of hanging outside the window", () => {
    const right = { ...anchor, left: 950 };
    const placed = placePanel({ anchor: right, panel, viewport: VIEWPORT });
    expect(placed.left).toBe(1000 - 200 - 8);
  });

  it("turns viewport coordinates into page coordinates", () => {
    const placed = placePanel({
      anchor,
      panel,
      viewport: VIEWPORT,
      scroll: { x: 15, y: 300 },
    });
    expect(placed.top).toBe(100 + 40 + PLACEMENT_GAP + 300);
    expect(placed.left).toBe(215);
  });
});

function Harness({ label = "Filtry" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button
        ref={anchorRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Otevřít
      </button>
      <button type="button">Jinam</button>
      <IngotPopover
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label={label}
        testId="popover"
      >
        <button type="button">Uvnitř</button>
      </IngotPopover>
    </div>
  );
}

describe("IngotPopover", () => {
  it("opens as a named group and closes on Escape, focus back on the anchor", () => {
    render(<Harness />);
    const anchor = screen.getByRole("button", { name: "Otevřít" });

    fireEvent.click(anchor);
    expect(screen.getByRole("group", { name: "Filtry" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("group", { name: "Filtry" })).toBeNull();
    expect(document.activeElement).toBe(anchor);
  });

  it("a click outside closes it", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));

    fireEvent.mouseDown(screen.getByRole("button", { name: "Jinam" }));
    expect(screen.queryByTestId("popover")).toBeNull();
  });

  it("a click inside does not", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));

    fireEvent.mouseDown(screen.getByRole("button", { name: "Uvnitř" }));
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("a click on the anchor is left to the anchor, so a toggle really toggles", () => {
    render(<Harness />);
    const anchor = screen.getByRole("button", { name: "Otevřít" });

    fireEvent.click(anchor);
    expect(screen.getByTestId("popover")).toBeInTheDocument();

    // The real sequence a browser sends: mousedown, then click. If the
    // outside-listener closed on the mousedown, the anchor's own click
    // would reopen it and the panel would never close.
    fireEvent.mouseDown(anchor);
    fireEvent.click(anchor);
    expect(screen.queryByTestId("popover")).toBeNull();
  });

  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByTestId("popover")).toBeNull();
  });

  it("portals out of the tree, so no stacking context can bury it", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));
    expect(screen.getByTestId("popover").parentElement).toBe(document.body);
  });
});
