/**
 * Rám aplikace a bloky konfiguračních obrazovek.
 *
 * Osm primitiv, která do kitu přibyla při dorovnání na design handoff.
 * Testy měří ta pravidla, která by se jinak ztratila při prvním
 * „drobném" refaktoru — tedy ta, kde je špatná varianta na pohled
 * stejně dobrá jako správná:
 *
 * - sekce lišty je **tlačítko** s ``aria-expanded``, ne odkaz s
 *   ``aria-current``: nikam sama nevede, jen rozbaluje menu,
 * - poslední drobeček **není odkaz**, i když dostane ``href``, a pod dva
 *   články se drobečky nekreslí vůbec,
 * - hotový krok je poznat **tvarem** (fajfka), ne jen zeleným záhlavím,
 * - řádková akce má **povinný popisek**, jinak je z ní pro odečítač jen
 *   „tlačítko" dvacetkrát pod sebou,
 * - klikatelná je **celá** karta varianty, ne jen kolečko,
 * - hodnota metriky je mono s ``tabular-nums``, aby čísla pod sebou
 *   seděla.
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  IngotBreadcrumbs,
  IngotMegaMenu,
  IngotMetrics,
  IngotOptionCard,
  IngotRowActions,
  IngotStepCard,
  IngotTopNav,
  IngotTopNavAccount,
  IngotUserMenu,
  IngotUserMenuRow,
  IngotUserMenuSection,
} from "@/ingot";

describe("IngotTopNav", () => {
  const SECTIONS = [
    { key: "provoz", label: "Provoz" },
    { key: "sklad", label: "Sklad" },
  ];

  it("vykreslí sekci jako tlačítko s aria-expanded, ne jako odkaz", async () => {
    const onToggle = vi.fn();
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="provoz"
        onToggleSection={onToggle}
        testId="nav"
      />,
    );

    const open = screen.getByRole("button", { name: "Provoz" });
    expect(open).toHaveAttribute("aria-expanded", "true");
    // Sekce nikam nevede, takže aria-current by lhalo.
    expect(open).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("link", { name: "Provoz" })).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Sklad" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("hlásí klik i na už otevřenou sekci — stav drží volající", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="provoz"
        onToggleSection={onToggle}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Provoz" }));
    expect(onToggle).toHaveBeenCalledWith("provoz");
  });

  it("účet nese popisek pro odečítač, ne jen iniciály", () => {
    render(<IngotTopNavAccount initials="8S" label="Menu účtu" expanded />);
    const account = screen.getByRole("button", { name: "Menu účtu" });
    expect(account).toHaveAttribute("aria-expanded", "true");
    expect(account).toHaveTextContent("8S");
  });
});

describe("IngotMegaMenu", () => {
  it("vykreslí sloupce, počty a označí otevřenou položku", () => {
    render(
      <IngotMegaMenu
        columns={[
          {
            title: "Denní provoz",
            items: [
              { href: "#a", label: "Objednávky", count: 12, current: true },
              { href: "#b", label: "Poptávky", count: 48 },
            ],
          },
        ]}
        preview={<p>Náhled</p>}
        label="Provoz"
        testId="mega"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Provoz" });
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
    // Odkaz uvnitř menu NĚKAM vede, takže tady aria-current sedí.
    expect(within(nav).getByRole("link", { name: /Objednávky/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Náhled")).toBeInTheDocument();
  });
});

describe("IngotUserMenu", () => {
  it("sváže popisek s ovládacím prvkem jen tehdy, když má id", () => {
    render(
      <IngotUserMenu label="Menu účtu" testId="user">
        <IngotUserMenuSection>
          <IngotUserMenuRow label="Jazyk" controlId="lang">
            <select id="lang" aria-label="Jazyk">
              <option>CS</option>
            </select>
          </IngotUserMenuRow>
          <IngotUserMenuRow label="Slovník">
            <span>Jednoduše</span>
          </IngotUserMenuRow>
        </IngotUserMenuSection>
      </IngotUserMenu>,
    );

    expect(screen.getByRole("group", { name: "Menu účtu" })).toBeInTheDocument();
    // S ``controlId`` je popisek ``<label>``; bez něj by menu slibovalo
    // vazbu, kterou nemá.
    expect(screen.getByText("Jazyk").tagName).toBe("LABEL");
    expect(screen.getByText("Slovník").tagName).toBe("SPAN");
  });
});

describe("IngotBreadcrumbs", () => {
  it("poslední článek nevykreslí jako odkaz, ani když dostane href", () => {
    render(
      <IngotBreadcrumbs
        items={[
          { label: "Provoz", href: "#/provoz" },
          { label: "Objednávky", href: "#/objednavky" },
        ]}
        label="Kde se nacházíte"
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("Provoz");
    const last = screen.getByText("Objednávky");
    expect(last.tagName).not.toBe("A");
    expect(last).toHaveAttribute("aria-current", "page");
  });

  it("pod dva články se nekreslí vůbec", () => {
    const { container } = render(
      <IngotBreadcrumbs items={[{ label: "Provoz" }]} label="Kde jste" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("IngotMetrics", () => {
  it("sází hodnotu mono s tabulárními číslicemi, popisek ne", () => {
    render(
      <IngotMetrics
        items={[
          { label: "Po termínu", value: 2, note: "OBJ-2411", tone: "danger" },
          { label: "Ve výrobě", value: 18 },
        ]}
        label="Přehled"
        testId="metrics"
      />,
    );

    const value = screen.getByText("2");
    expect(value).toHaveClass("font-mono");
    expect(value).toHaveClass("tabular-nums");
    // Tón je informace: kritická hodnota se obarví, ostatní ne.
    expect(value).toHaveClass("text-danger");
    expect(screen.getByText("18")).toHaveClass("text-ink");
  });

  it("obě hustoty vykreslí táž data", () => {
    const items = [{ label: "skupiny", value: 2 }];
    const { rerender } = render(
      <IngotMetrics items={items} label="Souhrn" testId="m" />,
    );
    expect(screen.getByTestId("m")).toHaveTextContent("skupiny");
    rerender(
      <IngotMetrics items={items} variant="inline" label="Souhrn" testId="m" />,
    );
    expect(screen.getByTestId("m")).toHaveTextContent("skupiny");
  });
});

describe("IngotStepCard", () => {
  it("hotový krok je poznat tvarem, ne jen barvou", () => {
    render(
      <IngotStepCard
        step="01"
        kicker="Krok 01"
        title="Země a měny"
        done
        doneLabel="Hotovo"
        testId="step"
      >
        <p>obsah</p>
      </IngotStepCard>,
    );

    // Fajfka místo čísla — a je popsaná, takže ji přečte i odečítač.
    expect(screen.getByTitle("Hotovo")).toBeInTheDocument();
    expect(screen.queryByText("01")).not.toBeInTheDocument();
  });

  it("nehotový krok ukazuje své pořadové číslo", () => {
    render(
      <IngotStepCard step="02" kicker="Krok 02" title="Skupiny" testId="step">
        <p>obsah</p>
      </IngotStepCard>,
    );
    expect(screen.getByText("02")).toBeInTheDocument();
  });
});

describe("IngotOptionCard", () => {
  it("klikatelná je celá karta, ne jen kolečko", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotOptionCard
        name="basis"
        value="weight"
        checked={false}
        onChange={onChange}
        title="Podle hmotnosti"
        description="Cena vychází z hmotnosti dílu."
        testId="option"
      />,
    );

    // Klik na vysvětlující větu, ne na radio — past, kterou karta řeší.
    await user.click(screen.getByText("Cena vychází z hmotnosti dílu."));
    expect(onChange).toHaveBeenCalledWith("weight");
  });
});

describe("IngotRowActions", () => {
  it("každá akce má popisek, takže odečítač nečte jen „tlačítko“", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <IngotRowActions
        actions={[
          { icon: "sliders", label: "Upravit vzorec", onClick: () => {} },
          {
            icon: "trash",
            label: "Smazat vzorec",
            tone: "danger",
            onClick: onDelete,
          },
        ]}
        testId="actions"
      />,
    );

    expect(screen.getByRole("button", { name: "Upravit vzorec" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Smazat vzorec" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
