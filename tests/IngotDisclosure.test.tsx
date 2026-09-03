/**
 * Sbalitelná sekce panelu — stav drží `<details>`, ne React.
 *
 * Co se tu měří a proč zrovna to:
 *
 * 1. **Popisek NENÍ nadpis.** Vizuálně by se ta chyba nepoznala: mono
 *    verzálky vypadají stejně, ať je pod nimi `<span>` nebo `<h3>`.
 *    Rozdíl uslyší až odečítač, kterému by se rozbila osnova stránky.
 * 2. **Stav nese element.** Kdyby se rozbalování přepsalo na `useState`,
 *    test na „po kliknutí je obsah vidět" by pořád procházel — a tiše by
 *    se ztratilo hledání na stránce, tisk i `open` z markupu. Měří se
 *    proto samo `open` na `<details>`.
 * 3. **Skupina má jedno jméno pro všechny své sekce a cizí ne.**
 *    Exkluzivitu drží prohlížeč přes `name`; kolize dvou skupin na jedné
 *    stránce je přesně ta chyba, kterou nikdo nehledá, dokud se dva
 *    panely nesejdou na jedné obrazovce.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { IngotDisclosure, IngotDisclosureGroup } from "@/ingot";

describe("IngotDisclosure", () => {
  it("popisek je popisek, ne nadpis — osnova stránky zůstává na IngotSection", () => {
    render(
      <IngotDisclosure title="Doklady" count={2}>
        <p>Nabídka 2026-0412</p>
      </IngotDisclosure>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Doklady")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("stav drží element, ne React — a defaultOpen se vejde do markupu", async () => {
    const user = userEvent.setup();
    render(
      <IngotDisclosure title="Poznámky" testId="sekce">
        <p>Dodat do konce měsíce.</p>
      </IngotDisclosure>,
    );

    const details = screen.getByTestId("sekce") as HTMLDetailsElement;
    expect(details.open).toBe(false);

    await user.click(screen.getByText("Poznámky"));
    expect(details.open).toBe(true);
  });

  it("defaultOpen otevře sekci hned", () => {
    render(
      <IngotDisclosure title="Soubory" defaultOpen testId="sekce">
        <p>vykres.pdf</p>
      </IngotDisclosure>,
    );

    expect((screen.getByTestId("sekce") as HTMLDetailsElement).open).toBe(true);
  });

  it("bez count se počet nekreslí vůbec", () => {
    render(
      <IngotDisclosure title="Štítky" testId="sekce">
        <p>Žádné</p>
      </IngotDisclosure>,
    );

    expect(screen.getByTestId("sekce").querySelector("summary")).toHaveTextContent(
      "Štítky",
    );
    // count={0} je legitimní hodnota, takže se nesmí schovat spolu s undefined.
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("count={0} se ukáže — nula je informace, ne prázdno", () => {
    render(
      <IngotDisclosure title="Soubory" count={0}>
        <p>Zatím nic.</p>
      </IngotDisclosure>,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("IngotDisclosureGroup", () => {
  it("dá svým sekcím společné jméno, kterým prohlížeč drží exkluzivitu", () => {
    render(
      <IngotDisclosureGroup testId="skupina">
        <IngotDisclosure title="Osa" testId="a">
          <p>a</p>
        </IngotDisclosure>
        <IngotDisclosure title="Doklady" testId="b">
          <p>b</p>
        </IngotDisclosure>
      </IngotDisclosureGroup>,
    );

    const first = screen.getByTestId("a").getAttribute("name");
    const second = screen.getByTestId("b").getAttribute("name");

    expect(first).toBeTruthy();
    expect(second).toBe(first);
  });

  it("dvě skupiny na stránce se neproplétou", () => {
    render(
      <>
        <IngotDisclosureGroup>
          <IngotDisclosure title="Osa" testId="a">
            <p>a</p>
          </IngotDisclosure>
        </IngotDisclosureGroup>
        <IngotDisclosureGroup>
          <IngotDisclosure title="Doklady" testId="b">
            <p>b</p>
          </IngotDisclosure>
        </IngotDisclosureGroup>
      </>,
    );

    expect(screen.getByTestId("a").getAttribute("name")).not.toBe(
      screen.getByTestId("b").getAttribute("name"),
    );
  });

  it("sekce mimo skupinu jméno nedostane — samostatná se nesmí vázat na nic", () => {
    render(
      <IngotDisclosure title="Osa" testId="sama">
        <p>a</p>
      </IngotDisclosure>,
    );

    expect(screen.getByTestId("sama")).not.toHaveAttribute("name");
  });
});
