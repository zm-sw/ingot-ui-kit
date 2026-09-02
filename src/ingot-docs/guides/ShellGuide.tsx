import { IngotCode, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Shell a patterny“ — jak se z primitiv skládají celé
 * obrazovky (KAN-663).
 *
 * Próza schválně bez kódu konkrétního shellu: shell bydlí v aplikaci,
 * ne v kitu, a tahle stránka popisuje smlouvu mezi nimi — které bloky
 * obrazovka skládá a v jakém pořadí.
 */

function ShellBody({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Shell je rám, který obrazovky sdílejí: navigace vlevo, obsah uprostřed. Obrazovka do rámu vkládá jen svůj obsah — hlavičku, sekce a bloky pod nimi. Rám si nikdy nestaví sama."
          : "The shell is the frame screens share: navigation on the left, content in the middle. A screen only puts its content into the frame — a header, sections and the blocks below them. It never builds the frame itself."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  <IngotCode>IngotSideNav</IngotCode> — navigace. Aktivní
                  položka je jedna a odpovídá adrese.
                </>,
                <>
                  <IngotCode>IngotPageHeader</IngotCode> — nadpis, věta pod
                  ním a akce vpravo. Hlavní akce obrazovky je právě jedna.
                </>,
                <>
                  <IngotCode>IngotSection</IngotCode> — obsah po sekcích
                  s nadpisy, aby se dal přeskakovat i odečítačem.
                </>,
              ]
            : [
                <>
                  <IngotCode>IngotSideNav</IngotCode> — navigation. There is
                  one active item and it matches the address.
                </>,
                <>
                  <IngotCode>IngotPageHeader</IngotCode> — the title, one
                  sentence below it and actions on the right. A screen has
                  exactly one primary action.
                </>,
                <>
                  <IngotCode>IngotSection</IngotCode> — content in sections
                  with headings, so it can be skimmed and skipped, screen
                  readers included.
                </>,
              ]
        }
      />
    </div>
  );
}

function ListPattern({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Obrazovka se seznamem záznamů skládá bloky v pevném pořadí. Pořadí není volba — čtenář, který ho zná z jedné obrazovky, ho najde na všech."
          : "A screen listing records assembles its blocks in a fixed order. The order is not a choice — a reader who knows it from one screen finds it on all of them."}
      </p>
      <IngotList
        variant="ordered"
        items={
          lang === "cs"
            ? [
                <>
                  <IngotCode>IngotToolbar</IngotCode> — hledání a filtry nad
                  seznamem.
                </>,
                <>
                  <IngotCode>IngotTable</IngotCode> — samotné záznamy; výběr
                  řádků otevírá hromadné akce.
                </>,
                <>
                  <IngotCode>IngotEmptyState</IngotCode> — když záznamy
                  nejsou, řekne proč a co udělat.
                </>,
                <>
                  <IngotCode>IngotPagination</IngotCode> — stránkování pod
                  seznamem.
                </>,
              ]
            : [
                <>
                  <IngotCode>IngotToolbar</IngotCode> — search and filters
                  above the list.
                </>,
                <>
                  <IngotCode>IngotTable</IngotCode> — the records themselves;
                  row selection opens bulk actions.
                </>,
                <>
                  <IngotCode>IngotEmptyState</IngotCode> — when there are no
                  records, it says why and what to do.
                </>,
                <>
                  <IngotCode>IngotPagination</IngotCode> — paging below the
                  list.
                </>,
              ]
        }
      />
      <p>
        {lang === "cs"
          ? "Editace záznamu jde do bočního panelu, potvrzení nevratného kroku do potvrzovacího dialogu a výsledek akce ohlásí toast. Modální okno je pro krok, který nesmí být přerušen."
          : "Editing a record goes into a side drawer, confirming an irreversible step into a confirm dialog, and the result of an action is announced by a toast. A modal is for a step that must not be interrupted."}
      </p>
    </div>
  );
}

export const ShellGuide: IngotGuidePage = {
  slug: "shell-a-patterny",
  group: "app",
  title: { cs: "Shell a patterny", en: "Shell and patterns" },
  summary: {
    cs: "Rám, který obrazovky sdílejí, a pevné pořadí bloků, ze kterých se skládá obrazovka se seznamem záznamů.",
    en: "The frame screens share, and the fixed order of blocks a record-list screen is assembled from.",
  },
  sections: [
    {
      id: "shell",
      title: { cs: "Shell", en: "The shell" },
      body: {
        cs: <ShellBody lang="cs" />,
        en: <ShellBody lang="en" />,
      },
    },
    {
      id: "pattern-seznamu",
      title: { cs: "Pattern seznamu", en: "The list pattern" },
      body: {
        cs: <ListPattern lang="cs" />,
        en: <ListPattern lang="en" />,
      },
    },
  ],
};
