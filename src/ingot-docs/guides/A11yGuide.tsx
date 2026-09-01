import { IngotCode, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Přístupnost“ — pravidla WCAG 2.2 AA, jak je kit drží, a
 * kontrolní seznam před vydáním (KAN-663).
 *
 * Slug „pristupnost“ nekoliduje s kotvou „pristupnost“ na stránkách
 * komponent: routy žijí za ``#/``, kotvy sekcí za holým ``#``.
 */

function Rules({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Cílová laťka je WCAG 2.2 AA. Většinu pravidel drží komponenty samy — proto se obrazovky skládají z nich a ne z opsaných tříd, se kterými se laťka ztrácí."
          : "The bar is WCAG 2.2 AA. Most rules are held by the components themselves — which is why screens are assembled from them and not from copied classes, where the bar quietly drops."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Kontrast textu nejméně 4,5 : 1 — ve světlém i tmavém
                  motivu. Paleta je na to měřená; barva mimo tokeny tu
                  záruku nemá.
                </>,
                <>
                  Vše jde ovládat klávesnicí a fokus je vždy vidět —
                  prstenec se nikdy nevypíná.
                </>,
                <>
                  Barva nikdy nenese význam sama: stav doprovází text nebo
                  tvar.
                </>,
                <>
                  Klikatelná plocha nejméně 32 × 32 px, na dotykovém
                  zařízení 44 × 44 px.
                </>,
                <>
                  Ikona bez popisku dostane <IngotCode>aria-label</IngotCode>;
                  dekorativní ikona se odečítači nehlásí.
                </>,
                <>
                  Nadpisy jdou po úrovních bez přeskakování — odečítač se
                  podle nich orientuje.
                </>,
              ]
            : [
                <>
                  Text contrast at least 4.5 : 1 — in the light and the dark
                  theme. The palette is measured for it; a colour outside
                  the tokens carries no such guarantee.
                </>,
                <>
                  Everything works from the keyboard and focus is always
                  visible — the ring is never turned off.
                </>,
                <>
                  Colour never carries meaning alone: a state is accompanied
                  by text or shape.
                </>,
                <>
                  Clickable area at least 32 × 32 px, and 44 × 44 px on
                  touch.
                </>,
                <>
                  An icon without a label takes an{" "}
                  <IngotCode>aria-label</IngotCode>; a decorative icon is
                  hidden from screen readers.
                </>,
                <>
                  Headings go level by level without skipping — screen
                  readers navigate by them.
                </>,
              ]
        }
      />
    </div>
  );
}

function Checklist({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Tři rychlé zkoušky před vydáním obrazovky. Neměří všechno — ale co neprojde jimi, neprojde ani ničím dalším."
          : "Three quick checks before a screen ships. They do not measure everything — but what fails them fails everything else too."}
      </p>
      <IngotList
        variant="ordered"
        items={
          lang === "cs"
            ? [
                <>
                  Projdi obrazovku jen klávesou Tab: každý prvek je
                  dosažitelný, fokus je vidět a nikde se nezacyklí.
                </>,
                <>
                  Přibliž na 200 %: nic nepřeteče, nic se nepřekryje a text
                  se neuřízne.
                </>,
                <>
                  Představ si obrazovku v šedotisku: každý stav musí být
                  poznat i bez barvy.
                </>,
              ]
            : [
                <>
                  Walk the screen with the Tab key alone: every element is
                  reachable, focus is visible, and nothing loops.
                </>,
                <>
                  Zoom to 200 %: nothing overflows, nothing overlaps, no
                  text is cut off.
                </>,
                <>
                  Picture the screen in greyscale: every state must be
                  recognisable without colour.
                </>,
              ]
        }
      />
    </div>
  );
}

export const A11yGuide: IngotGuidePage = {
  slug: "pristupnost",
  title: { cs: "Přístupnost", en: "Accessibility" },
  summary: {
    cs: "Pravidla WCAG 2.2 AA, která kit drží za obrazovky, a tři zkoušky před vydáním: Tab, zvětšení na 200 % a šedotisk.",
    en: "The WCAG 2.2 AA rules the kit holds for screens, and three pre-release checks: Tab, 200 % zoom and greyscale.",
  },
  sections: [
    {
      id: "pravidla-a11y",
      title: { cs: "Pravidla", en: "Rules" },
      body: {
        cs: <Rules lang="cs" />,
        en: <Rules lang="en" />,
      },
    },
    {
      id: "checklist",
      title: {
        cs: "Kontrola před vydáním",
        en: "The pre-release check",
      },
      body: {
        cs: <Checklist lang="cs" />,
        en: <Checklist lang="en" />,
      },
    },
  ],
};
