/**
 * Skořápka doc webu Ingotu (KAN-581).
 *
 * Guard `ingot-doc-pages` kontroluje SOUBORY — že primitivum má stránku,
 * že stránka má modul a že modul importuje z `@/ingot`. Co guard z principu
 * neuvidí, je jestli se to celé vůbec vykreslí; „stránka existuje" a
 * „stránka se namountuje" jsou dvě různá tvrzení.
 *
 * Proto tyhle testy:
 *
 * 1. **Menu má tolik položek, kolik je primitiv** — a bere je z registru,
 *    takže nové primitivum se v menu objeví samo.
 * 2. **Ukázka se doopravdy vykreslí.** Renderuje se skutečná komponenta,
 *    ne popis komponenty.
 * 3. 🪤 **Kotva v pravém sloupci nesmí přehodit stránku.** Router jede na
 *    hashi (`#/IngotModal`), ale „Co je na stránce" kotví na `#ukazka`
 *    uvnitř téže stránky. První verze brala i takový hash jako routu, takže
 *    proklik na kotvu shodil obsah zpátky na první primitivum.
 *
 * KAN-624 přidal obsah, KAN-625 stránky bez komponenty, KAN-626 výpis kódu:
 *
 * 4. **Sekce s obsahem opravdu nesou obsah.** `useWhen` / `avoidWhen` /
 *    `a11y` / `i18n` jsou povinná pole, takže stránku bez nich odmítne
 *    `tsc` — ale prázdné pole (`[]`) typecheck PUSTÍ. Typ umí vynutit, že
 *    sekce existuje; že v ní něco je, musí vynutit test.
 * 5. **Pravý sloupec odkazuje na sekce, které na stránce jsou.**
 * 6. **Úvod je výchozí obrazovka** a neznámý hash na něj padá.
 * 7. **Průvodci se nesmí přimíchat mezi komponenty** ani v DOM.
 * 8. 🪤 **Výpis kódu musí pocházet ze skutečného modulu.** `?raw` vrátí CELÝ
 *    soubor, takže v něm musí být i importy a hlavička funkce.
 *
 * KAN-627 přidal jazyky a motiv:
 *
 * 9. **Každý přeložitelný text existuje ve VŠECH jazycích a je neprázdný.**
 *    `Record<DocLang, …>` vynutí, že klíč je; že za ním něco je, ne.
 * 10. 🪤 **Nabídnou se jen jazyky, které platforma zapnula A doc web pro ně
 *     má text.** Přepnout na prázdnou stránku je horší než ten jazyk
 *     nenabídnout — a když API neodpoví, drží se to, co bundle nese.
 * 11. **Motiv nasazuje `.dark` na `<html>`** a volba přežije reload.
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CHROME } from "@/ingot-docs/chrome";
import { DocsApp } from "@/ingot-docs/DocsApp";
import { DOC_LANGS, type DocLang } from "@/ingot-docs/lang";
import { displayName } from "@/ingot-docs/naming";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import { ACCENT_CHOICES } from "@/lib/accent";

const LANG_KEY = "forgmatic.ingot-docs.lang";
const THEME_KEY = "forgmatic.theme";
const ACCENT_KEY = "forgmatic.accent";

/** Odpověď ``/public/languages`` — pokaždé NOVÁ, tělo se nedá číst dvakrát. */
function languagesResponse(codes: readonly string[]): Response {
  return new Response(
    JSON.stringify({
      languages: codes.map((code) => ({
        code,
        label: code.toUpperCase(),
        is_default: code === "cs",
        source: "builtin",
      })),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("DocsApp", () => {
  beforeEach(() => {
    window.location.hash = "";
    // Jazyk se pinuje schválně: jsdom hlásí navigator.language "en-US",
    // takže bez toho by výchozí jazyk závisel na prostředí, ne na testu.
    window.localStorage.setItem(LANG_KEY, "cs");
    window.localStorage.removeItem(THEME_KEY);
    window.localStorage.removeItem(ACCENT_KEY);
    document.documentElement.classList.remove("dark");
    delete document.documentElement.dataset.accent;
    // Většina testů o jazyky nejde; ať nesahají na síť vůbec.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(languagesResponse(["cs", "en"]))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("vypíše do menu každé primitivum z registru", () => {
    render(<DocsApp />);
    // Komponenty jsou vnořené pod rozcestníkem ve skupině „Systém“.
    const nav = screen.getByRole("navigation", { name: CHROME.groupSystem.cs });
    for (const page of INGOT_DOC_PAGES) {
      // V menu stojí jméno bez prefixu; plné jméno drží adresa.
      expect(within(nav).getByText(displayName(page.name))).toBeInTheDocument();
    }
  });

  it("vykreslí živou ukázku vybraného primitiva, ne jen její popis", () => {
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    expect(
      screen.getByRole("heading", { level: 1, name: "EmptyState" }),
    ).toBeInTheDocument();
    // Skutečný IngotEmptyState, ne text o něm: jeho vlastní testid.
    expect(screen.getByTestId("docs-empty")).toBeInTheDocument();
    expect(screen.getByText("Zatím tu nic není")).toBeInTheDocument();
  });

  it.each(INGOT_DOC_PAGES.map((page) => [page.name, page] as const))(
    "%s má v každém jazyce a v každé povinné sekci aspoň jednu položku",
    (_name, page) => {
      // Record<DocLang, …> vynutí, že KLÍČ je. Že za ním něco je, ne —
      // a prázdná sekce je přesně ta polovina pravdy, kvůli které se
      // v tomhle repu smazaly hlavičky specifikací.
      // Statusy a verze živí badge vedle nadpisu — stránka bez nich by
      // tiše slibovala stabilitu, kterou nikdo nevyhlásil.
      expect(["stable", "beta"]).toContain(page.status);
      expect(page.version).toMatch(/^\d+\.\d+$/);
      // Selektor a tokeny jsou smlouva pro review: čím prvek jmenovat
      // a co rozbije změna tokenu.
      expect(page.tag.trim().length).toBeGreaterThan(0);
      expect(page.tokens.length).toBeGreaterThan(0);
      for (const lang of DOC_LANGS) {
        expect(page.summary[lang].trim().length).toBeGreaterThan(0);
        expect(page.useWhen[lang].length).toBeGreaterThan(0);
        expect(page.avoidWhen[lang].length).toBeGreaterThan(0);
        expect(page.a11y[lang].length).toBeGreaterThan(0);
        expect(page.i18n[lang].length).toBeGreaterThan(0);
        if (page.limits) expect(page.limits[lang].length).toBeGreaterThan(0);
        for (const row of page.props) {
          expect(row.note[lang]).toBeTruthy();
        }
        for (const group of page.extraProps ?? []) {
          expect(group.note[lang]).toBeTruthy();
          for (const row of group.props) expect(row.note[lang]).toBeTruthy();
        }
      }
    },
  );

  it.each(INGOT_GUIDE_PAGES.map((guide) => [guide.slug, guide] as const))(
    "průvodce %s má text ve všech jazycích",
    (_slug, guide) => {
      for (const lang of DOC_LANGS) {
        expect(guide.title[lang].trim().length).toBeGreaterThan(0);
        expect(guide.summary[lang].trim().length).toBeGreaterThan(0);
        expect(guide.sections.length).toBeGreaterThan(0);
        for (const section of guide.sections) {
          expect(section.title[lang].trim().length).toBeGreaterThan(0);
          expect(section.body[lang]).toBeTruthy();
        }
      }
    },
  );

  it("vykreslí sekce s obsahem a odkáže na ně z pravého sloupce", () => {
    window.location.hash = "#/IngotTable";
    render(<DocsApp />);

    for (const title of [
      CHROME.demo.cs,
      CHROME.useWhen.cs,
      CHROME.avoidWhen.cs,
      CHROME.props.cs,
      CHROME.a11y.cs,
      CHROME.tokens.cs,
      CHROME.i18n.cs,
      // IngotTable je jediná stránka s nepovinnou sekcí `limits`.
      CHROME.limits.cs,
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }

    // Pravý sloupec se odvozuje z téhož pole, které vykreslilo obsah —
    // každá kotva tedy musí mířit na sekci, která na stránce doopravdy je.
    const aside = screen.getByRole("complementary", {
      name: CHROME.onThisPage.cs,
    });
    const anchors = within(aside).getAllByRole("link");
    expect(anchors).toHaveLength(8);
    for (const anchor of anchors) {
      const id = anchor.getAttribute("href")?.slice(1);
      expect(id).toBeTruthy();
      expect(document.getElementById(id as string)).not.toBeNull();
    }
  });

  it("vypíše u IngotTable i vlastnosti typu IngotColumn", () => {
    window.location.hash = "#/IngotTable";
    render(<DocsApp />);

    // `cell` a `cellClassName` nežijí na IngotTable, ale na IngotColumn.
    const extra = screen.getByTestId("docs-props-ingotcolumn-row");
    expect(within(extra).getByText("cell")).toBeInTheDocument();
    expect(within(extra).getByText("cellClassName")).toBeInTheDocument();
  });

  it("bez hashe otevře úvod, ne první primitivum v registru", () => {
    render(<DocsApp />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: INGOT_GUIDE_PAGES[0].title.cs,
      }),
    ).toBeInTheDocument();
  });

  it("neznámý hash padá na úvod, ne na první komponentu", () => {
    window.location.hash = "#/NeexistujiciStranka";
    render(<DocsApp />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: INGOT_GUIDE_PAGES[0].title.cs,
      }),
    ).toBeInTheDocument();
  });

  it("vykreslí stránku Překlady jako samostatnou stránku bez komponenty", () => {
    window.location.hash = "#/preklady";
    render(<DocsApp />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Překlady" }),
    ).toBeInTheDocument();
    // Stránka bez komponenty NEMÁ ukázku ani tabulku vlastností — to je
    // celý důvod, proč je to vlastní typ, a ne další IngotDocPage.
    expect(
      screen.queryByRole("heading", { level: 2, name: CHROME.demo.cs }),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("docs-props")).not.toBeInTheDocument();
  });

  it("rozdělí menu do skupin a každého průvodce dá právě do jedné", () => {
    render(<DocsApp />);

    const navs = [
      CHROME.groupSystem.cs,
      CHROME.groupApp.cs,
      CHROME.groupRules.cs,
    ].map((name) => screen.getByRole("navigation", { name }));

    // Dohromady musí sedět počet: každý průvodce v jedné skupině plus
    // komponenty vnořené pod rozcestníkem.
    const links = navs.flatMap((nav) => within(nav).getAllByRole("link"));
    expect(links).toHaveLength(
      INGOT_GUIDE_PAGES.length + INGOT_DOC_PAGES.length,
    );
    for (const guide of INGOT_GUIDE_PAGES) {
      expect(screen.getAllByTestId(`docs-nav-${guide.slug}`)).toHaveLength(1);
    }
  });

  it("čísluje průvodce podle pořadí v registru, ne ručně", () => {
    render(<DocsApp />);
    INGOT_GUIDE_PAGES.forEach((guide, index) => {
      expect(screen.getByTestId(`docs-nav-${guide.slug}`)).toHaveTextContent(
        String(index).padStart(2, "0"),
      );
    });
  });

  it("vnoří komponenty pod rozcestník, ne vedle něj", () => {
    render(<DocsApp />);

    // Podseznam visí na položce rozcestníku — vnoření je struktura,
    // takže musí být poznat i z DOM, ne jen z odsazení.
    const catalogue = screen.getByTestId("docs-nav-komponenty");
    const sublist = catalogue.closest("li")?.querySelector("ul");
    expect(sublist).not.toBeNull();
    expect(within(sublist as HTMLElement).getAllByRole("link")).toHaveLength(
      INGOT_DOC_PAGES.length,
    );
  });

  it("žádný slug průvodce nekoliduje se jménem primitiva", () => {
    const names = new Set(INGOT_DOC_PAGES.map((page) => page.name));
    for (const guide of INGOT_GUIDE_PAGES) {
      expect(names.has(guide.slug)).toBe(false);
    }
    const slugs = INGOT_GUIDE_PAGES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("ukazuje náhled a zdroj přepíná taby Náhled/Kód", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    // Výchozí pohled je náhled na stagi; zdroj se nevykresluje.
    expect(screen.getByTestId("docs-demo-stage")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-source")).not.toBeInTheDocument();

    const codeTab = screen.getByRole("tab", { name: CHROME.codeTab.cs });
    expect(codeTab).toHaveAttribute("aria-selected", "false");

    await user.click(codeTab);

    expect(codeTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("docs-source")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-demo-stage")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: CHROME.previewTab.cs }));
    expect(screen.getByTestId("docs-demo-stage")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-source")).not.toBeInTheDocument();
  });

  it("zkopíruje zdroj ukázky do schránky tlačítkem Kopírovat", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    await user.click(screen.getByTestId("docs-copy"));

    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotEmptyState");
    expect(await window.navigator.clipboard.readText()).toBe(
      page!.demoSource,
    );
    // Potvrzení se ukáže v popisku tlačítka a po chvíli zase zmizí.
    expect(screen.getByTestId("docs-copy")).toHaveTextContent(
      CHROME.copiedCode.cs,
    );
  });

  it("vypíše sekci Tokeny se seznamem tokenů komponenty", () => {
    window.location.hash = "#/IngotBadge";
    render(<DocsApp />);

    expect(
      screen.getByRole("heading", { level: 2, name: CHROME.tokens.cs }),
    ).toBeInTheDocument();
    const list = screen.getByTestId("docs-tokens");
    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotBadge");
    for (const token of page!.tokens) {
      expect(within(list).getByText(token)).toBeInTheDocument();
    }
  });

  it("ukazuje vedle nadpisu selektor prvku", () => {
    window.location.hash = "#/IngotBadge";
    render(<DocsApp />);
    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotBadge");
    expect(screen.getByTestId("docs-tag")).toHaveTextContent(page!.tag);
  });

  it("ukazuje vedle nadpisu badge stavu a verze", () => {
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotEmptyState");
    const statusLabel =
      page!.status === "stable" ? CHROME.statusStable.cs : CHROME.statusBeta.cs;
    expect(screen.getByTestId("docs-status")).toHaveTextContent(statusLabel);
    expect(screen.getByTestId("docs-version")).toHaveTextContent(
      `v${page!.version}`,
    );
  });

  it("průvodce badge stavu ani verze nemá", () => {
    window.location.hash = "#/uvod";
    render(<DocsApp />);
    expect(screen.queryByTestId("docs-status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("docs-version")).not.toBeInTheDocument();
  });

  // --- prev/next patička ----------------------------------------------

  it("první stránka nemá Předchozí a poslední nemá Další", () => {
    window.location.hash = `#/${INGOT_GUIDE_PAGES[0].slug}`;
    const { unmount } = render(<DocsApp />);
    expect(screen.queryByTestId("docs-prev")).not.toBeInTheDocument();
    expect(screen.getByTestId("docs-next")).toBeInTheDocument();
    unmount();

    const last = INGOT_DOC_PAGES[INGOT_DOC_PAGES.length - 1];
    window.location.hash = `#/${last.name}`;
    render(<DocsApp />);
    expect(screen.getByTestId("docs-prev")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-next")).not.toBeInTheDocument();
  });

  it("patička vede z posledního průvodce na první komponentu", () => {
    const lastGuide = INGOT_GUIDE_PAGES[INGOT_GUIDE_PAGES.length - 1];
    window.location.hash = `#/${lastGuide.slug}`;
    render(<DocsApp />);

    const next = screen.getByTestId("docs-next");
    expect(next).toHaveAttribute("href", `#/${INGOT_DOC_PAGES[0].name}`);
    const prev = screen.getByTestId("docs-prev");
    expect(prev).toHaveAttribute(
      "href",
      `#/${INGOT_GUIDE_PAGES[INGOT_GUIDE_PAGES.length - 2].slug}`,
    );
  });

  it.each(INGOT_DOC_PAGES.map((page) => [page.name, page] as const))(
    "%s vypisuje zdroj ukázky ze SKUTEČNÉHO modulu, ne z ručního řetězce",
    (name, page) => {
      // ?raw import vrátí CELÝ soubor, takže v něm musí být i jeho importy
      // a hlavička funkce — ne jen kus JSX, který se dá opsat.
      expect(page.demoSource).toContain('from "@/ingot"');
      expect(page.demoSource).toContain("export function Demo()");
      expect(page.demoSource).toContain(name);
    },
  );

  it("nechá stránku být, když hash míří na kotvu uvnitř ní", () => {
    window.location.hash = "#/IngotModal";
    render(<DocsApp />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Modal" }),
    ).toBeInTheDocument();

    window.location.hash = "#ukazka";
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    expect(
      screen.getByRole("heading", { level: 1, name: "Modal" }),
    ).toBeInTheDocument();
  });

  // --- jazyky (KAN-627) ----------------------------------------------

  it("přepne obsah i skořápku do vybraného jazyka a volbu si zapamatuje", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    const enButton = await screen.findByTestId("docs-lang-en");
    expect(
      screen.getByRole("heading", { level: 2, name: CHROME.demo.cs }),
    ).toBeInTheDocument();

    await user.click(enButton);

    // Skořápka i obsah stránky — ne jen jedno z toho.
    expect(
      screen.getByRole("heading", { level: 2, name: CHROME.demo.en }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: CHROME.codeTab.en }),
    ).toBeInTheDocument();

    const emptyState = INGOT_DOC_PAGES.find(
      (page) => page.name === "IngotEmptyState",
    );
    expect(screen.getByText(emptyState!.summary.en)).toBeInTheDocument();

    expect(window.localStorage.getItem(LANG_KEY)).toBe("en");
    // `ingot.html` má lang="cs" natvrdo; po přepnutí by to byla lež, na
    // kterou doplatí odečítač obrazovky, a nikdo by ji neviděl.
    expect(document.documentElement.lang).toBe("en");
  });

  it("nabídne jen jazyky, které platforma zapnula", async () => {
    // Platforma má zapnutou jen češtinu → přepínat není co, a přepínač se
    // vůbec nenabídne. Volba s jedinou možností slibuje volbu, která není.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(languagesResponse(["cs"]))),
    );
    render(<DocsApp />);
    await waitFor(() => {
      expect(screen.queryByTestId("docs-lang")).not.toBeInTheDocument();
    });
  });

  it("nenabídne jazyk platformy, pro který doc web nemá text", async () => {
    // 🪤 Platforma smí mít zapnutý jazyk, do kterého doc web přeložený není.
    // Přepnout na prázdnou stránku je horší než ten jazyk nenabídnout.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(languagesResponse(["cs", "en", "de"]))),
    );
    render(<DocsApp />);

    const picker = await screen.findByTestId("docs-lang");
    const values = within(picker)
      .getAllByRole("radio")
      .map((button) => button.textContent?.toLowerCase());
    expect(values).toEqual(["cs", "en"]);
    expect(values).not.toContain("de");
    for (const value of values) {
      expect(DOC_LANGS).toContain(value as DocLang);
    }
  });

  it("když se platformy nejde zeptat, nabídne to, pro co má text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    render(<DocsApp />);

    const picker = await screen.findByTestId("docs-lang");
    const values = within(picker)
      .getAllByRole("radio")
      .map((button) => button.textContent?.toLowerCase());
    expect(values).toEqual([...DOC_LANGS]);
  });

  // --- motiv (KAN-627) -----------------------------------------------

  it("nasadí .dark na <html> a volbu si zapamatuje", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    expect(document.documentElement).not.toHaveClass("dark");

    await user.click(screen.getByTestId("docs-theme-dark"));
    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");

    await user.click(screen.getByTestId("docs-theme-light"));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("při načtení respektuje uloženou volbu motivu", () => {
    window.localStorage.setItem(THEME_KEY, "dark");
    render(<DocsApp />);
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("docs-theme-dark")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  // --- akcent (KAN-648) -----------------------------------------------

  it("nabídne všechny akcentové rodiny a volbu si zapamatuje", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    // Puntíky se berou z ACCENT_CHOICES, takže nová rodina se objeví sama.
    for (const choice of ACCENT_CHOICES) {
      expect(screen.getByTestId(`accent-swatch-${choice}`)).toBeInTheDocument();
    }
    expect(document.documentElement.dataset.accent).toBeUndefined();

    await user.click(screen.getByTestId("accent-swatch-slate"));
    expect(document.documentElement.dataset.accent).toBe("slate");
    expect(window.localStorage.getItem(ACCENT_KEY)).toBe("slate");

    // Zpátky na výchozí rodinu → atribut zmizí, nepřepíše se na "blue".
    await user.click(screen.getByTestId("accent-swatch-blue"));
    expect(document.documentElement.dataset.accent).toBeUndefined();
    expect(window.localStorage.getItem(ACCENT_KEY)).toBe("blue");
  });

  it("při načtení respektuje uloženou volbu akcentu", () => {
    window.localStorage.setItem(ACCENT_KEY, "orange");
    render(<DocsApp />);
    expect(document.documentElement.dataset.accent).toBe("orange");
    expect(screen.getByTestId("accent-swatch-orange")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("akcent přežije přepnutí motivu — kaskáda ho nepřepočítává", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    await user.click(screen.getByTestId("accent-swatch-violet"));
    await user.click(screen.getByTestId("docs-theme-dark"));

    // Rodina se nemění, mění se jen to, který její blok kaskáda vybere.
    // Kdyby motiv akcent přepisoval (prototypové ``applyTheme`` volalo
    // ``applyAccent``), tenhle atribut by po přepnutí spadl na výchozí.
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.dataset.accent).toBe("violet");
  });

  it("stránka Základy ukáže všech pět rodin", () => {
    window.location.hash = "#/zaklady";
    render(<DocsApp />);

    const table = screen.getByTestId("docs-accent-families");
    // Řádky se generují z ACCENT_CHOICES — rodina přidaná do kitu se na
    // stránce objeví, aniž by na ni někdo musel vzpomenout.
    expect(
      table.querySelectorAll("tbody tr").length,
    ).toBe(ACCENT_CHOICES.length);
    for (const choice of ACCENT_CHOICES) {
      expect(table.querySelectorAll(`[data-accent="${choice}"]`).length).toBe(
        4,
      );
    }
  });
});
