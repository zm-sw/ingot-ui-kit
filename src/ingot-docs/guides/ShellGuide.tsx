import { useState } from "react";

import {
  Button,
  IngotBadge,
  IngotBreadcrumbs,
  IngotCode,
  IngotIcon,
  IngotList,
  IngotMegaMenu,
  IngotMetrics,
  IngotOptionCard,
  IngotPageHeader,
  IngotRowActions,
  IngotStepCard,
  IngotTopNav,
  IngotTopNavAccount,
  IngotUserMenu,
  IngotUserMenuRow,
  IngotUserMenuSection,
} from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Shell a patterny“ — rám aplikace a bloky, ze kterých se
 * skládají konfigurační obrazovky.
 *
 * 🪤 **Do dorovnání na návrh tahle stránka tvrdila, že rám má navigaci
 * vlevo.** Návrh říká opak — administrace boční menu nemá — takže
 * stránka vyučovala něco, co v návrhu není, a dělala to prózou bez
 * jediné ukázky. Obojí je tady opravené: text i ukázky vycházejí ze
 * skutečných primitiv rámu.
 *
 * Ukázky jsou živé komponenty, ne obrázky. Rám, který se v dokumentaci
 * rozejde se skutečností, je horší než žádný.
 */

const STAGE = "overflow-x-auto rounded-md border border-border bg-surface-2 p-4";

function ShellFrame({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Rám je jeden řádek nahoře: značka, sekce aplikace a účet. Obsah pod ním jde na plnou šířku. Boční menu administrace nemá — její obrazovky jsou široké tabulky a sloupec ukousnutý vlevo je sloupec, který v tabulce chybí."
          : "The frame is one row at the top: the brand, the application's sections and the account. Content below it runs full width. The admin has no side menu — its screens are wide tables, and a column bitten off on the left is a column missing from the table."}
      </p>
      <div className={STAGE}>
        <div className="min-w-[720px]">
          <IngotTopNav
            brand={
              <>
                Forgmatic <IngotBadge tone="ink">Admin</IngotBadge>
              </>
            }
            sections={[
              { key: "provoz", label: cs ? "Provoz" : "Operations" },
              { key: "sklad", label: cs ? "Sklad" : "Stock" },
              { key: "finance", label: cs ? "Finance" : "Finance" },
            ]}
            openSection={open}
            onOpenSection={setOpen}
            onCloseSection={() => setOpen(null)}
            account={
              <IngotTopNavAccount
                initials="8S"
                label={cs ? "Menu účtu" : "Account menu"}
              />
            }
          />
        </div>
      </div>
      <IngotList
        items={
          cs
            ? [
                <>
                  Sekce je tlačítko, ne odkaz — rozbaluje menu a samo nikam
                  nevede. Odkazy jsou až položky uvnitř.
                </>,
                <>
                  Zákaznická část má tutéž lištu, jen jiný obsah: jinou
                  značku bez odznaku, jiné sekce a případně odznak zkušebního
                  provozu. Dva produkty, jeden rám.
                </>,
                <>
                  Lišta se nezalamuje — co se nevejde, zmizí za okrajem.
                  Měřítko není pevný počet, ale nejužší podporovaná šířka:
                  všechny sekce se svými popisky se musí vejít na 1280 px.
                  Administrace jich dnes nese osm; když se lišta láme,
                  zkracuj popisky nebo spoj dvě sekce.
                </>,
              ]
            : [
                <>
                  A section is a button, not a link — it opens a menu and
                  goes nowhere on its own. The links are the items inside.
                </>,
                <>
                  The customer-facing product uses the same bar with
                  different content: another brand without the badge, other
                  sections, possibly a trial badge. Two products, one frame.
                </>,
                <>
                  The bar does not wrap — whatever does not fit falls off the
                  edge. The measure is not a fixed count but the narrowest
                  supported width: every section with its label must fit at
                  1280&nbsp;px. The admin carries eight today; when the bar
                  breaks, shorten labels or merge two sections.
                </>,
              ]
        }
      />
    </div>
  );
}

function SectionMenu({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Sekce se rozbaluje do skupin odkazů — do sedmi položek jeden sloupec, nad sedm dva — a náhledového sloupce vpravo. Náhled popisuje položku, na které zrovna stojíš, myší i klávesnicí; dokud nestojíš na žádné, popisuje první."
          : "A section opens into groups of links — one column up to seven items, two above that — plus a preview column on the right. The preview describes the item you are on, by mouse or by keyboard; until you are on one, it describes the first."}
      </p>
      <div className={STAGE}>
        <div className="relative min-h-[240px] min-w-[720px]">
          <IngotMegaMenu
            groups={[
              {
                title: cs ? "Denní provoz" : "Daily operations",
                items: [
                  {
                    href: "#objednavky",
                    label: cs ? "Objednávky" : "Orders",
                    description: cs
                      ? "Co je přijaté a co čeká na potvrzení výroby. Odsud se objednávka pouští do plánu."
                      : "What has come in and what waits for production to confirm it. Orders enter the plan from here.",
                    icon: <IngotIcon name="file" size={15} />,
                    count: 12,
                    current: true,
                  },
                  {
                    href: "#poptavky",
                    label: cs ? "Poptávky" : "Enquiries",
                    description: cs
                      ? "Nacenění, která zákazník zatím nepotvrdil."
                      : "Quotes the customer has not confirmed yet.",
                    icon: <IngotIcon name="chat" size={15} />,
                    count: 48,
                  },
                ],
              },
              {
                title: cs ? "Katalog" : "Catalogue",
                items: [
                  {
                    href: "#materialy",
                    label: cs ? "Materiály" : "Materials",
                    description: cs
                      ? "Skladové položky a jejich vlastnosti — tloušťky, jakosti, ceny."
                      : "Stock items and their properties — thicknesses, grades, prices.",
                    icon: <IngotIcon name="grid" size={15} />,
                  },
                ],
              },
            ]}
            label={cs ? "Provoz" : "Operations"}
          />
        </div>
      </div>
      <IngotList
        items={
          cs
            ? [
                <>
                  Náhled sleduje položku pod kurzorem <strong>i pod
                  fokusem</strong> — klávesnice není druhá kategorie. Popis
                  navíc čte odečítač přímo z odkazu, takže náhledový sloupec
                  je jen vizuální kopie.
                </>,
                <>
                  Otevřená sekce se v liště značí plochou{" "}
                  <IngotCode>--surface-3</IngotCode>, ne akcentem. Akcent
                  znamená akci a rozbalené menu žádná akce není.
                </>,
                <>
                  Počet u položky je mono — je to číslo k porovnání
                  s ostatními řádky.
                </>,
              ]
            : [
                <>
                  The preview follows the item under the cursor <strong>and
                  under focus</strong> — the keyboard is not a second-class
                  citizen. A screen reader hears the description from the
                  link itself, so the preview column is a visual copy.
                </>,
                <>
                  An open section is marked with the{" "}
                  <IngotCode>--surface-3</IngotCode> surface, not the accent.
                  The accent means an action, and an open menu is not one.
                </>,
                <>
                  The count next to an item is mono — it is a number meant to
                  be compared with the rows around it.
                </>,
              ]
        }
      />
    </div>
  );
}

function AccountMenu({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Pod účtem nejsou jen odkazy, ale i předvolby, které platí v celém produktu: motiv, jazyk, slovník a nápověda na stránkách."
          : "The account holds more than links: it holds the preferences that apply across the whole product — theme, language, vocabulary and on-page help."}
      </p>
      <div className={`${STAGE} grid place-items-center`}>
        <IngotUserMenu label={cs ? "Menu účtu" : "Account menu"}>
          <IngotUserMenuSection>
            <p className="text-sm font-semibold text-ink">Petr Zeman</p>
            <p className="text-[13px] text-ink-3">petr@strojirny-kladno.cz</p>
          </IngotUserMenuSection>
          <IngotUserMenuSection>
            <IngotUserMenuRow label={cs ? "Motiv vzhledu" : "Appearance"}>
              <IngotBadge>{cs ? "Podle systému" : "System"}</IngotBadge>
            </IngotUserMenuRow>
            <IngotUserMenuRow label={cs ? "Slovník" : "Vocabulary"}>
              <IngotBadge tone="accent">
                {cs ? "Jednoduše" : "Simple"}
              </IngotBadge>
            </IngotUserMenuRow>
            <IngotUserMenuRow
              label={cs ? "Nápověda na stránkách" : "On-page help"}
            >
              <IngotBadge tone="ok">{cs ? "Zapnuto" : "On"}</IngotBadge>
            </IngotUserMenuRow>
          </IngotUserMenuSection>
        </IngotUserMenu>
      </div>
      <IngotList
        items={
          cs
            ? [
                <>
                  Předvolba se ukládá <strong>na účet</strong>, ne do
                  prohlížeče — sleduje člověka i na druhý počítač.
                </>,
                <>
                  Vypnutá nápověda nesmí změnit rozvržení stránky. Skrývá se
                  viditelnost, ne prostor; jinak se obrazovka pod čtenářem
                  přeskládá a on přijde o místo, kam se díval.
                </>,
                <>
                  Slovník řídí odborné termíny v celém produktu, ne jen na
                  jedné obrazovce.
                </>,
                <>
                  Pokročilé zobrazení surových dat není nikdy zapnuté
                  výchozí.
                </>,
              ]
            : [
                <>
                  A preference is stored <strong>on the account</strong>, not
                  in the browser — it follows the person to another computer.
                </>,
                <>
                  Turning help off must not change the page layout. What is
                  hidden is visibility, not space; otherwise the screen
                  reflows under the reader and they lose the spot they were
                  looking at.
                </>,
                <>
                  The vocabulary drives domain terms across the whole
                  product, not just on one screen.
                </>,
                <>The advanced raw-data view is never on by default.</>,
              ]
        }
      />
    </div>
  );
}

function PageHead({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Pod lištou jde vždy totéž pořadí: drobečky, hlavička stránky, a teprve pak obsah. Čísla, podle kterých se obrazovka čte na první pohled, stojí hned pod hlavičkou."
          : "Below the bar the order is always the same: breadcrumbs, the page header, and only then the content. The numbers a screen is read by at a glance sit right under the header."}
      </p>
      <div className={`${STAGE} space-y-4 bg-surface`}>
        <IngotBreadcrumbs
          items={[
            { label: cs ? "Provoz" : "Operations", href: "#/shell-a-patterny" },
            { label: cs ? "Objednávky" : "Orders" },
          ]}
          label={cs ? "Kde se nacházíte" : "Where you are"}
        />
        <IngotPageHeader
          title={cs ? "Objednávky" : "Orders"}
          description={
            cs
              ? "12 čeká na potvrzení výroby, 2 jsou po termínu."
              : "12 wait for production to confirm, 2 are past due."
          }
          actions={
            <>
              <Button variant="secondary" size="sm">
                {cs ? "Export" : "Export"}
              </Button>
              <Button variant="primary" size="sm">
                {cs ? "Nová objednávka" : "New order"}
              </Button>
            </>
          }
        />
        <IngotMetrics
          items={[
            {
              label: cs ? "Ve výrobě" : "In production",
              value: 18,
              note: cs ? "z toho 4 dnes" : "4 of them today",
            },
            {
              label: cs ? "Čeká" : "Waiting",
              value: 12,
              note: cs ? "nejstarší 3 dny" : "oldest is 3 days",
            },
            {
              label: cs ? "Po termínu" : "Past due",
              value: 2,
              note: "OBJ-2411, OBJ-2390",
              tone: "danger",
            },
          ]}
          label={cs ? "Přehled objednávek" : "Order summary"}
        />
      </div>
      <IngotList
        items={
          cs
            ? [
                <>
                  Primární akce je právě jedna a stojí vpravo v hlavičce.
                  Nikdy neplave nad obsahem.
                </>,
                <>
                  Poslední drobeček není odkaz — je to místo, kde stojíš. Na
                  kořenové stránce sekce se drobečky nekreslí vůbec.
                </>,
                <>
                  Obarvené číslo znamená, že je to problém, ne že je
                  nejdůležitější. Obarvená polovina pruhu nesděluje nic.
                </>,
              ]
            : [
                <>
                  There is exactly one primary action and it sits at the top
                  right of the header. It never floats above the content.
                </>,
                <>
                  The last breadcrumb is not a link — it is where you stand.
                  On a section's root page breadcrumbs are not drawn at all.
                </>,
                <>
                  A coloured number means that number is a problem, not that
                  it is the most important one. Half a coloured strip says
                  nothing.
                </>,
              ]
        }
      />
    </div>
  );
}

function SettingsPatterns({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const [basis, setBasis] = useState("weight");
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Konfigurační obrazovky se skládají z opakujících se bloků. Nastavení se nedělá jedním dlouhým formulářem — kroky se dokončují v různé dny a různými lidmi, takže každý krok nese svůj stav natrvalo."
          : "Settings screens are assembled from recurring blocks. Configuration is not one long form — steps get finished on different days by different people, so each step carries its state permanently."}
      </p>
      <div className={`${STAGE} space-y-3`}>
        <IngotStepCard
          step="01"
          kicker={cs ? "Krok 01" : "Step 01"}
          title={cs ? "Země a měny" : "Countries and currencies"}
          meta={cs ? "3 země" : "3 countries"}
          done
          doneLabel={cs ? "Hotovo" : "Done"}
          footer={
            <Button variant="ghost" size="sm">
              {cs ? "Přidat zemi" : "Add a country"}
            </Button>
          }
        >
          <p className="text-sm text-ink-2">
            {cs
              ? "Česko, Slovensko a Polsko. Ceny se přepočítávají kurzem ČNB."
              : "Czechia, Slovakia and Poland. Prices convert at the central bank rate."}
          </p>
        </IngotStepCard>
        <IngotStepCard
          step="02"
          kicker={cs ? "Krok 02" : "Step 02"}
          title={cs ? "Základ ceníku" : "Pricing basis"}
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            <IngotOptionCard
              name="shell-basis"
              value="weight"
              checked={basis === "weight"}
              onChange={setBasis}
              title={cs ? "Podle hmotnosti" : "By weight"}
              description={
                cs
                  ? "Vhodné pro plechové díly z jednoho materiálu."
                  : "Suits sheet parts made from a single material."
              }
            />
            <IngotOptionCard
              name="shell-basis"
              value="machine"
              checked={basis === "machine"}
              onChange={setBasis}
              title={cs ? "Podle času stroje" : "By machine time"}
              description={
                cs
                  ? "Vhodné pro obrábění, kde hmotnost o práci nevypovídá."
                  : "Suits machining, where weight says nothing about the work."
              }
            />
          </div>
        </IngotStepCard>
      </div>
      <IngotList
        items={
          cs
            ? [
                <>
                  Hotový krok je poznat tvarem, ne jen barvou — zelené
                  záhlaví doprovází fajfka místo čísla.
                </>,
                <>
                  Patička kroku přidává další položku. Krok se nepotvrzuje
                  tlačítkem: je hotový tehdy, když má, co potřebuje.
                </>,
                <>
                  Varianta s důsledkem se vybírá kartou s vysvětlující větou,
                  ne položkou v rozbalovacím seznamu. Ta věta je půlka volby.
                </>,
              ]
            : [
                <>
                  A finished step is recognisable by shape, not colour alone
                  — the green header comes with a tick instead of a number.
                </>,
                <>
                  A step's footer adds another item. A step is not confirmed
                  by a button: it is done when it has what it needs.
                </>,
                <>
                  A choice with a consequence is made on a card with an
                  explaining sentence, not an option in a dropdown. That
                  sentence is half the choice.
                </>,
              ]
        }
      />
    </div>
  );
}

function ListPattern({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Obrazovka se seznamem záznamů skládá bloky v pevném pořadí. Pořadí není volba — čtenář, který ho zná z jedné obrazovky, ho najde na všech."
          : "A screen listing records assembles its blocks in a fixed order. The order is not a choice — a reader who knows it from one screen finds it on all of them."}
      </p>
      <IngotList
        variant="ordered"
        items={
          cs
            ? [
                <>
                  <IngotCode>IngotToolbar</IngotCode> — hledání a filtry nad
                  seznamem.
                </>,
                <>
                  <IngotCode>IngotTable</IngotCode> — záznamy; výběr řádků
                  otevírá hromadné akce.
                </>,
                <>
                  <IngotCode>IngotRowActions</IngotCode> — akce jednoho
                  řádku, vždy na jeho konci.
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
                  <IngotCode>IngotTable</IngotCode> — the records; selecting
                  rows opens the bulk actions.
                </>,
                <>
                  <IngotCode>IngotRowActions</IngotCode> — the actions of one
                  row, always at its end.
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
      <div className={`${STAGE} flex justify-end bg-surface`}>
        <IngotRowActions
          actions={[
            {
              icon: "sliders",
              label: cs ? "Upravit objednávku" : "Edit order",
              onClick: () => {},
            },
            {
              icon: "copy",
              label: cs ? "Duplikovat objednávku" : "Duplicate order",
              onClick: () => {},
            },
            {
              icon: "trash",
              label: cs ? "Smazat objednávku" : "Delete order",
              tone: "danger",
              onClick: () => {},
            },
          ]}
        />
      </div>
      <p>
        {cs
          ? "Editace záznamu jde do bočního panelu, aby zůstal vidět kontext. Potvrzení nevratného kroku patří do potvrzovacího dialogu s dopadem a výsledek ohlásí toast se zpětnou akcí. Modální okno je jen pro krok, který nesmí být přerušen."
          : "Editing a record goes into a side drawer so the context stays visible. Confirming an irreversible step belongs in a confirm dialog that states the impact, and the result is announced by a toast with an undo. A modal is only for a step that must not be interrupted."}
      </p>
    </div>
  );
}

export const ShellGuide: IngotGuidePage = {
  slug: "shell-a-patterny",
  group: "app",
  title: { cs: "Shell a patterny", en: "Shell and patterns" },
  summary: {
    cs: "Rám, který obrazovky sdílejí — horní lišta, menu sekce a účtu, hlavička s čísly — a bloky, ze kterých se skládají konfigurační obrazovky i seznamy.",
    en: "The frame screens share — the top bar, the section and account menus, the header with its numbers — and the blocks that settings screens and lists are assembled from.",
  },
  sections: [
    {
      id: "ram",
      title: { cs: "Rám aplikace", en: "The application frame" },
      body: { cs: <ShellFrame lang="cs" />, en: <ShellFrame lang="en" /> },
    },
    {
      id: "menu-sekce",
      title: { cs: "Menu sekce", en: "The section menu" },
      body: { cs: <SectionMenu lang="cs" />, en: <SectionMenu lang="en" /> },
    },
    {
      id: "menu-uctu",
      title: { cs: "Menu účtu", en: "The account menu" },
      body: { cs: <AccountMenu lang="cs" />, en: <AccountMenu lang="en" /> },
    },
    {
      id: "hlavicka",
      title: { cs: "Hlavička stránky", en: "The page header" },
      body: { cs: <PageHead lang="cs" />, en: <PageHead lang="en" /> },
    },
    {
      id: "patterny-nastaveni",
      title: { cs: "Patterny nastavení", en: "Settings patterns" },
      body: {
        cs: <SettingsPatterns lang="cs" />,
        en: <SettingsPatterns lang="en" />,
      },
    },
    {
      id: "pattern-seznamu",
      title: { cs: "Pattern seznamu", en: "The list pattern" },
      body: { cs: <ListPattern lang="cs" />, en: <ListPattern lang="en" /> },
    },
  ],
};
