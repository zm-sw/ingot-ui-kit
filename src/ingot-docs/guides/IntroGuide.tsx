import { IngotCode, IngotList } from "@/ingot";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Úvodní stránka doc webu (KAN-625) — výchozí obrazovka.
 *
 * Do KAN-625 padl příchozí rovnou na první komponentu v registru, takže
 * první věta, kterou o kitu četl, byla popis propu. Kdo neví, co Ingot
 * je, se z toho nedozví nic.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka. Nepatří sem interní próza: čísla
 * technického dluhu, jména kontrol, klíče úkolů ani rozhodnutí s daty.
 */
const IMPORT_EXAMPLE = 'import { IngotTable, IngotEmptyState } from "@/ingot";';

export const IntroGuide: IngotGuidePage = {
  slug: "uvod",
  title: { cs: "Úvod", en: "Introduction" },
  summary: {
    cs: "Ingot UI Kit je sada primitiv, ze kterých se skládají obrazovky administrace.",
    en: "The Ingot UI Kit is the set of primitives admin screens are built from.",
  },
  sections: [
    {
      id: "co-to-je",
      title: { cs: "Co to je", en: "What it is" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              <strong>Ingot UI Kit</strong> je malá sada stavebních prvků pro
              administrační obrazovky: tlačítko, plocha, formulář, pole,
              dialog, potvrzení, tabulka a prázdný stav. Není to knihovna
              komponent na všechno — je to odpověď na otázku „jak se tahle
              věc v aplikaci dělá“, aby na ni byla právě jedna odpověď.
            </p>
            <p>
              Každé primitivum s sebou nese laťku přístupnosti, kterou by
              jinak musela uhlídat každá obrazovka zvlášť: správné{" "}
              <IngotCode>role</IngotCode> a <IngotCode>aria-*</IngotCode>,
              ovládání klávesnicí, fokus tam, kde ho čtenář čeká, a stavy
              „načítá se“ i „nic tu není“ jako součást návrhu, ne jako
              dodatek.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              The <strong>Ingot UI Kit</strong> is a small set of building
              blocks for admin screens: a button, a surface, a form, a field,
              a dialog, a confirmation, a table and an empty state. It is not
              a component library for everything — it is the answer to “how is
              this done in this application”, so that there is exactly one
              answer.
            </p>
            <p>
              Every primitive carries an accessibility floor each screen would
              otherwise have to maintain on its own: the right{" "}
              <IngotCode>role</IngotCode> and <IngotCode>aria-*</IngotCode>,
              keyboard operation, focus where the reader expects it, and both
              “loading” and “nothing here” as part of the design rather than
              an afterthought.
            </p>
          </div>
        ),
      },
    },
    {
      id: "jak-se-pouziva",
      title: { cs: "Jak se používá", en: "How to use it" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>Všechno se importuje z jednoho místa:</p>
            <IngotCode block>{IMPORT_EXAMPLE}</IngotCode>
            <p>
              <strong>Vždycky přes tenhle jeden vstup</strong>, nikdy hlubší
              cestou na konkrétní soubor. Co odsud vede ven, je veřejné
              rozhraní kitu a mění se ohlášeně; co ne, je vnitřek a smí se
              přejmenovat nebo rozdělit kdykoli.
            </p>
            <p>
              Součástí veřejného rozhraní jsou i typy, které si primitivum
              žádá — třeba <IngotCode>IngotColumn</IngotCode> pro sloupce
              tabulky nebo <IngotCode>IngotFieldSpec</IngotCode> pro pole
              formuláře.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>Everything is imported from one place:</p>
            <IngotCode block>{IMPORT_EXAMPLE}</IngotCode>
            <p>
              <strong>Always through this one entry point</strong>, never by a
              deeper path to a specific file. What comes out of it is the
              kit’s public interface and changes are announced; what does not
              is internal and may be renamed or split at any time.
            </p>
            <p>
              The public interface includes the types a primitive asks for —{" "}
              <IngotCode>IngotColumn</IngotCode> for table columns, say, or{" "}
              <IngotCode>IngotFieldSpec</IngotCode> for form fields.
            </p>
          </div>
        ),
      },
    },
    {
      id: "jak-pridat",
      title: {
        cs: "Jak se přidává nové primitivum",
        en: "How a new primitive is added",
      },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Nové primitivum vzniká,{" "}
              <strong>až si o něj řekne konkrétní obrazovka</strong>.
              Komponenta bez toho, kdo ji používá, je jen slib — nikdo neví,
              jestli sedí, dokud ji někdo nezapojí.
            </p>
            <p>Když ten žadatel je, patří k sobě tři věci v jedné změně:</p>
            <IngotList
              variant="ordered"
              items={[
                <>
                  komponenta a její vyvedení z <IngotCode>@/ingot</IngotCode>,
                </>,
                <>
                  stránka na tomhle webu — s živou ukázkou, ne s obrázkem ani
                  opsaným kusem kódu,
                </>,
                <>první obrazovka, která ji doopravdy používá.</>,
              ]}
            />
            <p>
              Stránka musí ukázku vykreslit{" "}
              <strong>skutečnou komponentou</strong>. Opsané JSX vypadá v den
              zápisu stejně a od druhého dne tiše lže — proto je tenhle web
              psaný jako kód, ne jako dokumentace vedle kódu.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A new primitive appears{" "}
              <strong>once a concrete screen asks for it</strong>. A component
              with nobody using it is only a promise — nobody knows whether it
              fits until someone wires it up.
            </p>
            <p>
              Once there is such a caller, three things belong together in one
              change:
            </p>
            <IngotList
              variant="ordered"
              items={[
                <>
                  the component and its export from{" "}
                  <IngotCode>@/ingot</IngotCode>,
                </>,
                <>
                  a page on this site — with a live demo, not a screenshot and
                  not a copied snippet,
                </>,
                <>the first screen that genuinely uses it.</>,
              ]}
            />
            <p>
              The page must render the demo with the{" "}
              <strong>real component</strong>. Copied JSX looks identical on
              the day it is written and lies quietly from the second day on —
              which is why this site is written as code, not as documentation
              sitting next to the code.
            </p>
          </div>
        ),
      },
    },
    {
      id: "co-tu-najdes",
      title: { cs: "Co tu najdeš", en: "What you will find here" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Každá stránka komponenty má stejnou stavbu: živou{" "}
              <strong>ukázku</strong> (i s kódem, kterým se dělá),{" "}
              <strong>kdy použít</strong> a <strong>kdy nepoužít</strong>,
              tabulku <strong>vlastností</strong>,{" "}
              <strong>přístupnost</strong> a <strong>překlady</strong>. Tam,
              kde první verze něco schválně neumí, je to vypsané taky.
            </p>
            <p>
              Pravidlo o překladech je společné všem primitivům, takže má
              vlastní stránku —{" "}
              <a className="underline" href="#/preklady">
                Překlady
              </a>
              .
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Every component page has the same shape: a live{" "}
              <strong>demo</strong> (with the code that produces it),{" "}
              <strong>when to use it</strong> and{" "}
              <strong>when not to</strong>, a table of{" "}
              <strong>properties</strong>, <strong>accessibility</strong> and{" "}
              <strong>translations</strong>. Where the first version
              deliberately cannot do something, that is listed too.
            </p>
            <p>
              The rule about translations is common to every primitive, so it
              has a page of its own —{" "}
              <a className="underline" href="#/preklady">
                Translations
              </a>
              .
            </p>
          </div>
        ),
      },
    },
  ],
};
