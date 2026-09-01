/**
 * Boční panel pro editaci (KAN-655).
 *
 * Testy měří stejnou a11y laťku jako ``tests/IngotModal.test.tsx`` —
 * drawer je druhý překryv, na který laťka z rozhodnutí vlastníka
 * 2026-08-25 platí celá: trap, ESC, návrat fokusu, scroll lock.
 *
 * Navíc měří, co je na draweru specifické:
 *
 * - ``dismissable={false}`` vypíná JEN klik do pozadí; ESC a křížek
 *   fungují dál. Jeden klik vedle nesmí zahodit rozepsaný formulář.
 * - ``width`` má tvrdý strop 560 px ze specu.
 * - zámek scrollu SDÍLÍ čítač s ``IngotModal`` — drawer nad dialogem
 *   nesmí při zavření odemknout pozadí.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { IngotDrawer, IngotModal, useModalDepth } from "@/ingot";

function DepthProbe() {
  return <span data-testid="depth">{useModalDepth()}</span>;
}

function Harness({
  children,
  dismissable,
  side,
  width,
}: {
  children?: React.ReactNode;
  dismissable?: boolean;
  side?: "right" | "left";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        otevřít
      </button>
      {open && (
        <IngotDrawer
          title="Titulek"
          closeLabel="Zavřít"
          onClose={() => setOpen(false)}
          dismissable={dismissable}
          side={side}
          width={width}
          testId="probe"
        >
          {children ?? (
            <>
              <button type="button" data-testid="first">
                první
              </button>
              <button type="button" data-testid="last">
                poslední
              </button>
            </>
          )}
        </IngotDrawer>
      )}
    </>
  );
}

describe("IngotDrawer — a11y laťka", () => {
  it("panel je dialog popsaný svým titulkem", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("aria-modal", "true");
    const labelledBy = panel.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)).toHaveTextContent(
      "Titulek",
    );
  });

  it("fokus jde po otevření dovnitř draweru", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe-panel")).toContainElement(
      document.activeElement as HTMLElement,
    );
    expect(document.activeElement).toBe(screen.getByTestId("probe-close"));
  });

  it("Tab z posledního prvku se vrací na první (trap), ne ven", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const last = screen.getByTestId("last");
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(document.activeElement).toBe(screen.getByTestId("probe-close"));
  });

  it("Shift+Tab z prvního prvku jde na poslední", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const first = screen.getByTestId("probe-close");
    first.focus();
    fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(screen.getByTestId("last"));
  });

  it("ESC zavírá", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("fokus se po zavření vrací na spouštěč", () => {
    render(<Harness />);
    const opener = screen.getByTestId("opener");
    opener.focus();
    fireEvent.click(opener);
    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(document.activeElement).toBe(opener);
  });

  it("pozadí se zamkne při otevření a odemkne při zavření", () => {
    render(<Harness />);
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(screen.getByTestId("opener"));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });
});

describe("IngotDrawer — dismissable", () => {
  it("výchozí drawer zavře klik do pozadí, klik do panelu ne", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("probe-panel"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.mouseDown(screen.getByTestId("probe"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("dismissable={false} nechá klik do pozadí bez účinku, ESC funguje dál", () => {
    render(<Harness dismissable={false} />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("probe"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.keyDown(screen.getByTestId("probe"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("IngotDrawer — geometrie", () => {
  it("výchozí šířka je 400 px", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe-panel").style.width).toBe("400px");
  });

  it("šířka má tvrdý strop 560 px", () => {
    render(<Harness width={900} />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe-panel").style.width).toBe("560px");
  });

  it("side řídí, u které hrany panel stojí", () => {
    const { unmount } = render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe").className).toContain("justify-end");
    unmount();

    render(<Harness side="left" />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("probe").className).toContain("justify-start");
  });

  it("patka s akcemi je mimo scrolovací tělo, takže je vždy vidět", () => {
    render(
      <IngotDrawer
        title="Titulek"
        closeLabel="Zavřít"
        onClose={vi.fn()}
        testId="probe"
        footer={<button type="button">Uložit</button>}
      >
        <p>obsah</p>
      </IngotDrawer>,
    );
    const footer = screen.getByTestId("probe-footer");
    const body = screen.getByText("obsah").parentElement as HTMLElement;
    expect(body.className).toContain("overflow-auto");
    expect(footer.contains(screen.getByText("Uložit"))).toBe(true);
    expect(body.contains(footer)).toBe(false);
  });
});

describe("IngotDrawer — soužití s IngotModal", () => {
  it("drawer nad dialogem neodemkne pozadí, dokud stojí i dialog", () => {
    function Stacked() {
      const [drawer, setDrawer] = useState(true);
      return (
        <IngotModal title="vnější" closeLabel="Zavřít" onClose={vi.fn()}>
          <button type="button" onClick={() => setDrawer(false)}>
            zavřít drawer
          </button>
          {drawer && (
            <IngotDrawer title="vnitřní" closeLabel="Zavřít" onClose={vi.fn()}>
              <p>obsah</p>
            </IngotDrawer>
          )}
        </IngotModal>
      );
    }
    render(<Stacked />);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByText("zavřít drawer"));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("obsah draweru je o úroveň hlouběji — ModalDepthProvider je uvnitř", () => {
    render(
      <Harness>
        <DepthProbe />
      </Harness>,
    );
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("depth")).toHaveTextContent("1");
  });
});
