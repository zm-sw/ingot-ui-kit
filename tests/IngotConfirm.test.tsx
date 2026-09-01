/**
 * Potvrzovací dialog (KAN-583) — třetí primitivum Ingotu.
 *
 * Dvě věci, které se tu měří, a proč zrovna ty:
 *
 * 1. **Že to opravdu jede přes `IngotModal`.** Kdyby si `IngotConfirm` overlay
 *    znovu udělal sám, testy na tlačítka by pořád procházely — a a11y laťka by
 *    tiše zmizela. ESC, návrat fokusu na spouštěč a portál do `document.body`
 *    jsou vlastnosti shellu; jestli platí i tady, je jediný levný důkaz, že
 *    pod tím shell je. Proto se měří tady, ne jen v `IngotModal.test.tsx`.
 * 2. **Veto (KAN-422).** Zašedlé „Smazat trvale" vedle důvodu čte operátor
 *    jako „ještě chvíli", proto se tlačítko nesmí nabídnout vůbec. Test na
 *    `disabled` by tuhle regresi nechytil — kontroluje se NEPŘÍTOMNOST.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { IngotConfirm, useConfirmVeto } from "@/ingot";

/**
 * Obsah `impact` slotu, který potvrzení odvolá — sonda přesně podle
 * skutečného volajícího (`UsageImpactLoader` v `ImpactSummary.tsx`):
 * veto se hlásí z `useEffect`, ne z renderu.
 *
 * Ten efekt je zároveň test na stabilní identitu setteru — kdyby
 * `IngotConfirm` předával novou funkci při každém renderu, efekt by se
 * pouštěl pořád dokola a tenhle soubor by se zacyklil.
 */
function VetoingImpact({ reason }: { reason: ReactNode | null }) {
  const veto = useConfirmVeto();
  useEffect(() => {
    veto(reason);
  }, [veto, reason]);
  return <span data-testid="impact-body">dopad</span>;
}

function Harness({
  impact,
  busy,
  onConfirm = () => {},
}: {
  impact?: ReactNode;
  busy?: boolean;
  onConfirm?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        otevřít
      </button>
      {open && (
        <IngotConfirm
          title="Smazat trvale?"
          description="Tohle nejde vzít zpět."
          confirmLabel="Smazat"
          cancelLabel="Zrušit"
          closeLabel="Zavřít"
          busy={busy}
          impact={impact}
          onConfirm={onConfirm}
          onClose={() => setOpen(false)}
          testId="confirm-dialog"
        />
      )}
    </>
  );
}

describe("IngotConfirm — kostra a kontrakt", () => {
  it("panel je dialog popsaný svým titulkem", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("aria-modal", "true");
    const labelledBy = panel.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)).toHaveTextContent(
      "Smazat trvale?",
    );
  });

  it("potvrzení volá onConfirm, zrušení zavírá", () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.click(screen.getByTestId("confirm-dialog-confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("confirm-dialog-cancel"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("busy zamkne obě tlačítka", () => {
    render(<Harness busy />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(screen.getByTestId("confirm-dialog-confirm")).toBeDisabled();
    expect(screen.getByTestId("confirm-dialog-cancel")).toBeDisabled();
  });

  it("bez slotu se box dopadu nerenderuje", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(screen.queryByTestId("confirm-dialog-impact")).toBeNull();
  });
});

describe("IngotConfirm — jede přes IngotModal, ne přes vlastní overlay", () => {
  it("ESC zavírá", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId("confirm-dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("kliknutí do pozadí zavírá, kliknutí do panelu ne", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    fireEvent.mouseDown(screen.getByTestId("confirm-dialog-panel"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("confirm-dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("po zavření se fokus vrací na spouštěč", () => {
    render(<Harness />);
    const opener = screen.getByTestId("opener");
    opener.focus();
    fireEvent.click(opener);
    expect(opener).not.toHaveFocus();

    fireEvent.click(screen.getByTestId("confirm-dialog-cancel"));
    expect(opener).toHaveFocus();
  });

  it("dialog visí na document.body, ne v místě volání", () => {
    const { container } = render(<Harness />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(container.querySelector("[role='dialog']")).toBeNull();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("IngotConfirm — veto z dopadového slotu (KAN-422)", () => {
  it("veto potvrzovací tlačítko SUNDÁ a vypíše důvod", () => {
    render(<Harness impact={<VetoingImpact reason="Má objednávky." />} />);
    fireEvent.click(screen.getByTestId("opener"));

    // Nepřítomnost, ne disabled: zašedlé tlačítko čte operátor jako
    // „ještě chvíli", ne jako „tudy ne".
    expect(screen.queryByTestId("confirm-dialog-confirm")).toBeNull();
    expect(screen.getByTestId("confirm-dialog-blocked")).toHaveTextContent(
      "Má objednávky.",
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    // Zrušit zůstává — jinak z dialogu nevede cesta ven.
    expect(screen.getByTestId("confirm-dialog-cancel")).toBeInTheDocument();
  });

  it("slot bez důvodu potvrzení nechává", () => {
    render(<Harness impact={<VetoingImpact reason={null} />} />);
    fireEvent.click(screen.getByTestId("opener"));

    expect(screen.getByTestId("impact-body")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-dialog-confirm")).toBeInTheDocument();
    expect(screen.queryByTestId("confirm-dialog-blocked")).toBeNull();
  });
});
