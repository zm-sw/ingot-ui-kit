/**
 * What a screen says while it is waiting (KAN-959).
 *
 * The kit had neither a skeleton nor a progress indicator, so loading was
 * a blank area followed by the content arriving all at once and pushing
 * everything down. Both halves are bad: an empty screen is
 * indistinguishable from a broken one, and the jump costs the reader the
 * line they were looking at. The doc web wrote "Loading the demo…" as a
 * sentence instead, which says the same thing and holds none of the room.
 *
 * The half that no screenshot catches is the announcement. A skeleton is
 * thirty grey rectangles; left as they are, a screen reader walks all
 * thirty and says nothing thirty times. That is what most of this measures.
 */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotSkeleton, IngotSpinner, type IngotSkeletonShape } from "@/ingot";

describe("the skeleton", () => {
  it("is one named thing to a screen reader, not thirty grey boxes", () => {
    render(
      <IngotSkeleton shape="table" rows={4} label="Načítají se zakázky" testId="sk" />,
    );
    const block = screen.getByRole("status", { name: "Načítají se zakázky" });
    expect(block).toHaveAttribute("aria-busy", "true");

    // Every bar is hidden, and there are many of them — which is the
    // point: without `aria-hidden` a screen reader walks all twenty and
    // announces nothing twenty times.
    const bars = block.querySelectorAll("span.animate-pulse");
    expect(bars.length).toBeGreaterThan(10);
    for (const bar of bars) expect(bar).toHaveAttribute("aria-hidden", "true");

    // And nothing inside it is announced as a second status.
    expect(within(block).queryAllByRole("status")).toHaveLength(0);
  });

  it("stops pulsing where movement is switched off, and stays visible", () => {
    // The skeleton is information about shape, not an animation: movement
    // switched off does not mean the message switched off.
    render(<IngotSkeleton label="Načítá se" testId="sk" />);
    const bar = screen.getByTestId("sk").querySelector("[aria-hidden='true']");
    expect(bar?.className).toContain("animate-pulse");
    expect(bar?.className).toContain("motion-reduce:animate-none");
  });

  it("draws the number of lines it was asked for", () => {
    render(<IngotSkeleton label="Načítá se" rows={5} testId="sk" />);
    expect(
      screen.getByTestId("sk").querySelectorAll("[aria-hidden='true']"),
    ).toHaveLength(5);
  });

  it("never draws nothing, whatever number it is handed", () => {
    // A skeleton of zero lines holds no room, which is the blank area the
    // primitive exists to replace.
    for (const rows of [0, -3]) {
      const { unmount } = render(
        <IngotSkeleton label="Načítá se" rows={rows} testId="sk" />,
      );
      expect(
        screen.getByTestId("sk").querySelectorAll("[aria-hidden='true']").length,
      ).toBeGreaterThan(0);
      unmount();
    }
  });

  it("draws each shape as something different", () => {
    // The shape has to look like what replaces it — otherwise it holds
    // room for something else and the content jumps anyway.
    const html = new Map<IngotSkeletonShape, string>();
    for (const shape of ["text", "card", "table", "metrics"] as const) {
      const { unmount } = render(
        <IngotSkeleton shape={shape} label="Načítá se" testId="sk" />,
      );
      html.set(shape, screen.getByTestId("sk").innerHTML);
      unmount();
    }
    expect(new Set(html.values()).size).toBe(4);
  });

  it("gives metrics four tiles whatever rows says", () => {
    // A row of metrics is four tiles by definition; `rows` is about lines
    // and cards, and letting it through here would draw a shape no screen
    // has.
    render(<IngotSkeleton shape="metrics" rows={9} label="Načítá se" testId="sk" />);
    const tiles = screen.getByTestId("sk").firstElementChild?.children;
    expect(tiles).toHaveLength(4);
  });
});

describe("the spinner", () => {
  it("says what is happening, politely", () => {
    render(<IngotSpinner label="Ukládá se" testId="sp" />);
    const status = screen.getByRole("status", { name: "Ukládá se" });
    // Polite: a screen reader hears about it once it has finished
    // speaking, not mid-sentence.
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("hides the circle itself — the wrapper carries the name", () => {
    render(<IngotSpinner label="Ukládá se" testId="sp" />);
    const circle = screen.getByTestId("sp").firstElementChild;
    expect(circle).toHaveAttribute("aria-hidden", "true");
    expect(circle?.className).toContain("animate-spin");
  });

  it("stops spinning where movement is switched off", () => {
    // A spinner nobody asked for that never stops is exactly what that
    // setting exists to switch off.
    render(<IngotSpinner label="Ukládá se" testId="sp" />);
    expect(screen.getByTestId("sp").firstElementChild?.className).toContain(
      "motion-reduce:animate-none",
    );
  });

  it("takes its own line only when asked", () => {
    const { rerender } = render(<IngotSpinner label="Ukládá se" testId="sp" />);
    expect(screen.getByTestId("sp").className).not.toContain("justify-center");
    rerender(<IngotSpinner label="Ukládá se" block testId="sp" />);
    expect(screen.getByTestId("sp").className).toContain("justify-center");
  });
});
