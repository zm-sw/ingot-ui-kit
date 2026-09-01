import { INGOT_ICON_NAMES, IngotCode, IngotIcon, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Ikony“ — přehled sady a pravidla jejího používání (KAN-663,
 * sada samotná KAN-649).
 *
 * 🪤 Mřížka se generuje z ``INGOT_ICON_NAMES`` — glyf přidaný do sady se
 * tu objeví sám. Ručně psaný výčet by byl druhá pravda o tom, co sada
 * umí, a rozešel by se s první při prvním přidaném glyfu.
 */

function IconGrid(): JSX.Element {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      data-testid="docs-icon-grid"
    >
      {INGOT_ICON_NAMES.map((name) => (
        <span
          key={name}
          className="flex items-center gap-2 rounded border border-border bg-surface px-2 py-1.5"
        >
          <IngotIcon name={name} size={18} />
          <IngotCode>{name}</IngotCode>
        </span>
      ))}
    </div>
  );
}

function IconRules({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Ikona se kreslí čarou v barvě rodiče a škáluje se jedním číslem. Nemá vlastní paletu — barvu i velikost jí dává místo, kde stojí."
          : "An icon is drawn as a stroke in its parent's colour and scales with a single number. It has no palette of its own — the place where it stands gives it both colour and size."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Výchozí stav je dekorativní: ikona vedle popisku se
                  odečítači obrazovky nehlásí, aby neřekl totéž dvakrát.
                </>,
                <>
                  Ikona, která stojí sama a nese význam, dostane{" "}
                  <IngotCode>title</IngotCode> — odečítač ji pak přečte.
                </>,
                <>
                  Nový glyf se přidává do sady, ne do obrazovky. Ikona
                  nakreslená v jednom souboru je ostrůvek, který příště
                  nikdo nenajde.
                </>,
                <>
                  Výrobní operace mají vlastní sadu s vlastními pravidly —
                  jejich klíč ukládá server a ikona bez názvu operace je
                  hádanka, ne popisek.
                </>,
              ]
            : [
                <>
                  The default is decorative: an icon next to its label is
                  hidden from screen readers, so they do not say the same
                  thing twice.
                </>,
                <>
                  An icon standing alone and carrying meaning takes a{" "}
                  <IngotCode>title</IngotCode> — screen readers then announce
                  it.
                </>,
                <>
                  A new glyph goes into the set, not into a screen. An icon
                  drawn in one file is an island nobody finds next time.
                </>,
                <>
                  Manufacturing operations have their own set with its own
                  rules — their key is stored by the server, and an icon
                  without the operation name is a riddle, not a label.
                </>,
              ]
        }
      />
    </div>
  );
}

export const IconsGuide: IngotGuidePage = {
  slug: "ikony",
  title: { cs: "Ikony", en: "Icons" },
  summary: {
    cs: "Jedna sada čárových ikon, barvená barvou rodiče. Přehled glyfů a pravidla, kdy ikonu popsat a kdy nechat dekorativní.",
    en: "One set of stroke icons, coloured by the parent. The glyph overview, and the rules for when to label an icon and when to leave it decorative.",
  },
  sections: [
    {
      id: "pravidla-ikon",
      title: { cs: "Pravidla", en: "Rules" },
      body: {
        cs: <IconRules lang="cs" />,
        en: <IconRules lang="en" />,
      },
    },
    {
      id: "sada",
      title: { cs: "Sada", en: "The set" },
      body: {
        cs: <IconGrid />,
        en: <IconGrid />,
      },
    },
  ],
};
