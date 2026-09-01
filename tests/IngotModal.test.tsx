/**
 * Skořápka dialogu (KAN-580) — druhé primitivum Ingotu.
 *
 * Testy měří **a11y laťku** z rozhodnutí vlastníka 2026-08-25, protože právě
 * ta je důvodem, proč shell existuje: padesát ručních overlayů ji každý
 * splňovalo jinak (nebo vůbec). Laťka platí od teď pro každé další
 * primitivum, takže se měří tady, ne u konzumentů.
 *
 * A jedna věc navíc, která není a11y: **``ModalDepthProvider`` je uvnitř**.
 * Do KAN-580 si ho každý modal musel obalit ručně a `ModalDepthContext`
 * docstring tvrdil, že centrálně to nejde. Kdyby to shell přestal dělat,
 * `useCanQuickCreate()` by uvnitř dialogu tiše vrátil `true` na hloubce, kde
 * má vracet `false` — nic by nespadlo, jen by se nabídlo, co se nabízet nemá.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { useModalDepth } from "@/ingot";
import { IngotModal } from "@/ingot";

function DepthProbe() {
  return <span data-testid="depth">{useModalDepth()}</span>;
}

function Harness({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        otevřít
      </button>
      {open && (
        <IngotModal
          title="Titulek"
          closeLabel="Zavřít"
          onClose={() => setOpen(false)}
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
        </IngotModal>
      )}
    </>
  );
}

describe("IngotModal — a11y laťka", () => {
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

  it("fokus jde po otevření dovnitř dialogu", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    // První fokusovatelný prvek v DOM pořadí je zavírací tlačítko hlavičky.
    // Podstatné je, že fokus je UVNITŘ dialogu — bez toho čte čtečka dál
    // stránku pod overlayem a Tab z ní nikdy nevstoupí dovnitř.
    expect(screen.getByTestId("probe-panel")).toContainElement(
      document.activeElement as HTMLElement,
    );
    expect(document.activeElement).toBe(screen.getByTestId("probe-close"));
  });

  it("dialog bez fokusovatelného obsahu vezme fokus na panel", () => {
    render(
      <Harness>
        <p>jen text</p>
      </Harness>,
    );
    fireEvent.click(screen.getByTestId("opener"));
    // Zavírací tlačítko hlavičky je fokusovatelné vždycky — bez něj by fokus
    // zůstal na <body> a čtečka by začínala od začátku stránky.
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

  it("kliknutí do pozadí zavírá, kliknutí do panelu ne", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("probe-panel"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.mouseDown(screen.getByTestId("probe"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("fokus se po zavření vrací na spouštěč", () => {
    render(<Harness />);
    const opener = screen.getByTestId("opener");
    // jsdom fokus při ``click`` nepřesouvá; prohlížeč ano, a právě ten
    // fokusovaný spouštěč je to, na co se dialog má vrátit.
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

  it("vnořený dialog neodemkne pozadí, dokud stojí i ten vnější", () => {
    function Nested() {
      const [inner, setInner] = useState(true);
      return (
        <IngotModal title="vnější" closeLabel="Zavřít" onClose={vi.fn()}>
          <button type="button" onClick={() => setInner(false)}>
            zavřít vnitřní
          </button>
          {inner && (
            <IngotModal title="vnitřní" closeLabel="Zavřít" onClose={vi.fn()}>
              <p>obsah</p>
            </IngotModal>
          )}
        </IngotModal>
      );
    }
    render(<Nested />);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByText("zavřít vnitřní"));
    expect(document.body.style.overflow).toBe("hidden");
  });
});

describe("IngotModal — ModalDepthProvider je uvnitř (KAN-580)", () => {
  it("obsah dialogu je o úroveň hlouběji, aniž by ho volající obaloval", () => {
    render(
      <Harness>
        <DepthProbe />
      </Harness>,
    );
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByTestId("depth")).toHaveTextContent("1");
  });

  it("vnořený dialog přidá další úroveň", () => {
    render(
      <IngotModal title="vnější" closeLabel="Zavřít" onClose={vi.fn()}>
        <IngotModal title="vnitřní" closeLabel="Zavřít" onClose={vi.fn()}>
          <DepthProbe />
        </IngotModal>
      </IngotModal>,
    );
    expect(screen.getByTestId("depth")).toHaveTextContent("2");
  });
});
