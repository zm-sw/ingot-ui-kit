/**
 * `IngotStepCard` — sbalování a hotový stav.
 *
 * Proč zrovna tyhle dvě věci: obě jsou stav, který se neprojeví jinak než
 * tím, co uživatel vidí a co uslyší odečítač, takže je typecheck ani
 * smoke render nechytí. Sbalený krok, ze kterého v DOM zůstane tělo bez
 * `hidden`, vypadá v testu stejně jako rozbalený; `aria-expanded`, které
 * se nehne, projde vykreslením úplně.
 *
 * Tvrzení o VÝCHOZÍM chování (nesbalitelná karta nemá tlačítko ani `hidden`)
 * váží stejně jako ta o zapnutém: karta stojí pod celým vedeným nastavením
 * a prop, který svoje chování protlačí i k volajícím, co o něj nepožádali,
 * je regrese na všech těch obrazovkách naráz.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotStepCard } from "./IngotStepCard";

function renderCard(extra: Record<string, unknown> = {}) {
  return render(
    <IngotStepCard
      step="02"
      kicker="Krok 02"
      title="Skupiny vlastností"
      footer={<button type="button">Přidat vlastnost</button>}
      testId="card"
      {...extra}
    >
      <p>Materiály a povrchové úpravy.</p>
    </IngotStepCard>,
  );
}

const body = () => screen.getByText("Materiály a povrchové úpravy.").parentElement;

describe("IngotStepCard collapsible", () => {
  it("nesbalitelná karta nemá tlačítko a tělo neschovává", () => {
    renderCard();

    expect(screen.queryByRole("button", { name: "Sbalit krok" })).toBeNull();
    expect(body()).not.toHaveAttribute("hidden");
    expect(screen.getByText("Přidat vlastnost")).toBeInTheDocument();
  });

  it("tlačítko sbalí tělo i patičku a ohlásí to přes aria-expanded", () => {
    renderCard({ collapsible: true, toggleLabel: "Sbalit krok" });

    const toggle = screen.getByRole("button", { name: "Sbalit krok" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(body()).not.toHaveAttribute("hidden");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(body()).toHaveAttribute("hidden");
    expect(screen.queryByText("Přidat vlastnost")).toBeNull();
  });

  it("aria-controls míří na tělo, které v DOM zůstává i sbalené", () => {
    renderCard({ collapsible: true, toggleLabel: "Sbalit krok" });

    const toggle = screen.getByRole("button", { name: "Sbalit krok" });
    fireEvent.click(toggle);

    const controlled = document.getElementById(
      toggle.getAttribute("aria-controls") ?? "",
    );
    expect(controlled).toBe(body());
  });
});

describe("IngotStepCard done", () => {
  it("hotový krok se sbalí sám, nehotový zůstane otevřený", () => {
    const { unmount } = renderCard({
      collapsible: true,
      toggleLabel: "Rozbalit krok",
      done: true,
      doneLabel: "Hotovo",
    });

    expect(
      screen.getByRole("button", { name: "Rozbalit krok" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(body()).toHaveAttribute("hidden");

    unmount();
    renderCard({ collapsible: true, toggleLabel: "Sbalit krok" });

    expect(screen.getByRole("button", { name: "Sbalit krok" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("krok dokončený až na obrazovce se sbalí bez reloadu", () => {
    const { rerender } = renderCard({
      collapsible: true,
      toggleLabel: "Sbalit krok",
    });

    expect(body()).not.toHaveAttribute("hidden");

    rerender(
      <IngotStepCard
        step="02"
        kicker="Krok 02"
        title="Skupiny vlastností"
        collapsible
        toggleLabel="Sbalit krok"
        done
        doneLabel="Hotovo"
        footer={<button type="button">Přidat vlastnost</button>}
        testId="card"
      >
        <p>Materiály a povrchové úpravy.</p>
      </IngotStepCard>,
    );

    expect(body()).toHaveAttribute("hidden");
  });

  it("hotový stav nese i text pro odečítač, ne jen zelenou", () => {
    renderCard({ done: true, doneLabel: "Hotovo" });

    expect(screen.getByTitle("Hotovo")).toBeInTheDocument();
  });

  it("sbalení hotového kroku jde přepnout ručně", () => {
    renderCard({
      collapsible: true,
      toggleLabel: "Rozbalit krok",
      done: true,
      doneLabel: "Hotovo",
    });

    const toggle = screen.getByRole("button", { name: "Rozbalit krok" });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(body()).not.toHaveAttribute("hidden");
  });
});
