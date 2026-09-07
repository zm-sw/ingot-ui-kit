import { useState } from "react";

import {
  Button,
  IngotActionBar,
  IngotBadge,
  IngotBreadcrumbs,
  IngotCode,
  IngotColumns,
  IngotDescriptionList,
  IngotEmptyState,
  IngotField,
  IngotList,
  IngotPageHeader,
  IngotPageLayout,
  IngotPagination,
  IngotSearchInput,
  IngotSection,
  IngotSelect,
  IngotSkeleton,
  IngotTable,
  IngotToolbar,
  type IngotColumn,
} from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuideBody } from "@/ingot-docs/types";

/**
 * "Page layouts" — the whole screen, not the blocks it is made of.
 *
 * The blocks have a page already ("Shell and patterns"): what a toolbar is,
 * what a group card is, which blocks a list is assembled from. What was
 * missing is the level above that — the shape of a whole screen — and its
 * absence is measurable in the application built on this kit: 183
 * hand-drawn page frames in nine widths, 38 screens drawing their own
 * table while eight use the kit's, 141 reaching straight for an input
 * element while eight use the kit's form. The kit had the parts and the
 * screens still did not use them, because nothing said what the finished
 * thing looks like.
 *
 * So every section here is a WHOLE screen, live, built only from the kit —
 * a reader can copy the shape rather than a paragraph about the shape.
 *
 * The doc web is PUBLIC: no issue keys, no repository paths and no guard
 * names in anything that renders.
 */

/** The frame the demos stand in, so a page shape reads as a page. */
const STAGE = "overflow-x-auto rounded-md border border-border bg-surface-2 p-4";

interface Order {
  code: string;
  customer: string;
  state: "late" | "making" | "queued";
  due: string;
  pieces: number;
}

const ORDERS: readonly Order[] = [
  {
    code: "ZAK-2026-0179",
    customer: "Kovo Sedlčany",
    state: "late",
    due: "2. 9. 2026",
    pieces: 8,
  },
  {
    code: "ZAK-2026-0184",
    customer: "Strojírny Beneš",
    state: "making",
    due: "12. 9. 2026",
    pieces: 120,
  },
  {
    code: "ZAK-2026-0185",
    customer: "Zámečnictví Hrubý",
    state: "queued",
    due: "18. 9. 2026",
    pieces: 24,
  },
];

const STATE_LABEL: Record<Order["state"], { cs: string; en: string }> = {
  late: { cs: "Po termínu", en: "Late" },
  making: { cs: "Ve výrobě", en: "In production" },
  queued: { cs: "Ve frontě", en: "Queued" },
};

const STATE_TONE: Record<Order["state"], "danger" | "accent" | "neutral"> = {
  late: "danger",
  making: "accent",
  queued: "neutral",
};

function Widths({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const columns: readonly IngotColumn<{
    width: string;
    token: string;
    what: string;
  }>[] = [
    {
      key: "width",
      header: cs ? "Šířka" : "Width",
      cell: (row) => <IngotCode>{row.width}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "token",
      header: cs ? "Token" : "Token",
      cell: (row) => <IngotCode>{row.token}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    { key: "what", header: cs ? "Na co" : "What for", cell: (row) => row.what },
  ];

  const rows = [
    {
      width: "full",
      token: "--frame",
      what: cs
        ? "Seznamy a tabulky. Sloupec ukousnutý z tabulky je sloupec, který v ní chybí."
        : "Lists and tables. A column bitten off a table is a column missing from it.",
    },
    {
      width: "wide",
      token: "--page-wide",
      what: cs
        ? "Detail, který se čte: fakta ve dvou sloupcích, panely. Blok roztažený na celý rám přestává být jeden předmět."
        : "A detail that is read: facts in two columns, panels. A block stretched across the whole frame stops being one object.",
    },
    {
      width: "reading",
      token: "--page-reading",
      what: cs
        ? "Formulář, dlouhé nastavení, text. Řádek přes celý monitor se nečte, ale přelétá."
        : "A form, a long setting, a text. A line across a whole monitor is skimmed, not read.",
    },
    {
      width: "card",
      token: "--page-card",
      what: cs
        ? "Celá obrazovka je jedna krabička: přihlášení, potvrzení, modul, ve kterém ještě nic není. Jediná šířka, která se sama vystředí."
        : "The whole screen is one box: signing in, confirming, a module with nothing in it yet. The only width that also centres itself.",
    },
  ];

  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Šířka stránky je rozhodnutí, které se dělá jednou a pak se jmenuje. Když jméno chybí, sáhne každá obrazovka po nejbližším čísle — a dvě obrazovky se stejnou náplní pak měří jinak, aniž by to někdo rozhodl."
          : "The width of a page is a decision taken once and then named. Without a name every screen reaches for the nearest number, and two screens with the same kind of content end up measuring differently without anybody having decided that."}
      </p>
      <IngotTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.width}
        caption={cs ? "Šířky stránky" : "Page widths"}
      />
      <p>
        {cs
          ? "Jméno se vybírá podle toho, co stránka JE, ne podle toho, jak zrovna vypadá dobře. To je celý rozdíl mezi rozhodnutím a odhadem."
          : "The name is chosen by what the page IS, never by what happens to look right. That is the whole difference between a decision and a guess."}
      </p>
      <div className={`${STAGE} space-y-2`}>
        {rows.map((row) => (
          <div key={row.width} className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wide text-ink-3">
              {row.width}
            </p>
            <div
              className={`h-3 rounded-sm bg-accent-bg ${
                row.width === "card"
                  ? "mx-auto max-w-page-card"
                  : row.width === "reading"
                    ? "max-w-page-reading"
                    : row.width === "wide"
                      ? "max-w-page-wide"
                      : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListScreen({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");
  const [page, setPage] = useState(1);

  const columns: readonly IngotColumn<Order>[] = [
    {
      key: "code",
      header: cs ? "Číslo" : "Number",
      cell: (row) => row.code,
      cellClassName: "whitespace-nowrap font-mono",
    },
    {
      key: "customer",
      header: cs ? "Zákazník" : "Customer",
      cell: (row) => row.customer,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "state",
      header: cs ? "Stav" : "State",
      cell: (row) => (
        <IngotBadge tone={STATE_TONE[row.state]}>
          {STATE_LABEL[row.state][lang]}
        </IngotBadge>
      ),
    },
    {
      key: "due",
      header: cs ? "Termín" : "Due",
      cell: (row) => row.due,
      cellClassName: "whitespace-nowrap",
    },
  ];

  const rows = ORDERS.filter((row) =>
    query.trim() === ""
      ? true
      : `${row.code} ${row.customer}`.toLowerCase().includes(query.toLowerCase()),
  ).filter((row) => (state === "all" ? true : row.state === state));

  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Nejčastější obrazovka administrace: záznamy se stejnou sadou sloupců. Bere celou šířku rámu, protože sloupec ukousnutý z tabulky je sloupec, který v ní chybí."
          : "The commonest admin screen: records with the same set of columns. It takes the frame's whole width, because a column bitten off a table is a column missing from it."}
      </p>
      <IngotList
        variant="ordered"
        items={
          cs
            ? [
                <>
                  <IngotCode>IngotPageHeader</IngotCode> — název modulu a akce, kterou
                  sem uživatel přišel udělat.
                </>,
                <>
                  <IngotCode>IngotToolbar</IngotCode> — hledání a filtry. Nad daty, ne
                  vedle nich.
                </>,
                <>
                  <IngotCode>IngotTable</IngotCode> — záznamy; řádkové akce má tabulka
                  jako poslední sloupec.
                </>,
                <>
                  <IngotCode>IngotPagination</IngotCode> — stránkování pod seznamem.
                </>,
              ]
            : [
                <>
                  <IngotCode>IngotPageHeader</IngotCode> — the module's name and the
                  action the user came here to take.
                </>,
                <>
                  <IngotCode>IngotToolbar</IngotCode> — search and filters. Above the
                  data, not beside it.
                </>,
                <>
                  <IngotCode>IngotTable</IngotCode> — the records; row actions are the
                  table's last column.
                </>,
                <>
                  <IngotCode>IngotPagination</IngotCode> — paging under the list.
                </>,
              ]
        }
      />
      <div className={STAGE}>
        <IngotPageLayout width="full" testId="docs-layout-list">
          <IngotPageHeader
            title={cs ? "Zakázky" : "Orders"}
            description={
              cs
                ? "Co je rozpracované a co má termín tento týden."
                : "What is in progress and what is due this week."
            }
            actions={
              <Button variant="accent" size="sm">
                {cs ? "Nová zakázka" : "New order"}
              </Button>
            }
          />
          <IngotToolbar>
            <IngotSearchInput
              value={query}
              onChange={setQuery}
              label={cs ? "Hledat zakázku" : "Search orders"}
              placeholder={cs ? "Číslo nebo zákazník…" : "Number or customer…"}
              className="w-64"
            />
            <IngotSelect
              value={state}
              onChange={setState}
              label={cs ? "Stav" : "State"}
              options={[
                { value: "all", label: cs ? "Všechny stavy" : "All states" },
                { value: "late", label: STATE_LABEL.late[lang] },
                { value: "making", label: STATE_LABEL.making[lang] },
                { value: "queued", label: STATE_LABEL.queued[lang] },
              ]}
            />
          </IngotToolbar>
          <IngotTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.code}
            caption={cs ? "Zakázky ve výrobě" : "Orders in production"}
            empty={
              <IngotEmptyState
                title={cs ? "Nic neodpovídá filtru" : "Nothing matches the filter"}
                description={
                  cs
                    ? "Zkus jiný stav nebo smaž hledaný text — zakázky tu jsou, jen ne tyhle."
                    : "Try another state or clear the search — the orders are there, just not these."
                }
              />
            }
          />
          <IngotPagination
            page={page}
            pageCount={4}
            onPageChange={setPage}
            prevLabel={cs ? "Předchozí" : "Previous"}
            nextLabel={cs ? "Další" : "Next"}
            status={cs ? `Stránka ${page} ze 4` : `Page ${page} of 4`}
            label={cs ? "Stránkování zakázek" : "Order paging"}
          />
        </IngotPageLayout>
      </div>
      <p>
        {cs
          ? "Prázdno je součást téhle obrazovky, ne výjimka z ní: vyfiltruj stav, který tu není, a místo řádků stojí věta, která říká proč. Prázdná tabulka bez věty vypadá jako rozbité načítání."
          : "Empty is part of this screen rather than an exception to it: filter for a state that is not here and a sentence stands where the rows were, saying why. An empty table with no sentence looks like loading that broke."}
      </p>
    </div>
  );
}

function DetailScreen({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Jeden záznam se vším, co o něm platí. Čte se, ale formulář to není — proto wide: fakta se čtou ve dvou sloupcích a text zůstane v dosahu jednoho pohledu."
          : "One record with everything true about it. It is read but it is not a form — hence wide: the facts read in two columns and the text stays within one glance."}
      </p>
      <div className={STAGE}>
        <IngotPageLayout width="wide" testId="docs-layout-detail">
          <IngotBreadcrumbs
            label={cs ? "Cesta" : "Path"}
            items={[
              { label: cs ? "Zakázky" : "Orders", href: "#" },
              { label: "ZAK-2026-0184" },
            ]}
          />
          <IngotPageHeader
            title="ZAK-2026-0184"
            description={cs ? "Příruba DN80 · 120 ks" : "DN80 flange · 120 pcs"}
            titleAdornment={
              <IngotBadge tone="accent">{STATE_LABEL.making[lang]}</IngotBadge>
            }
            actions={
              <Button variant="secondary" size="sm">
                {cs ? "Upravit" : "Edit"}
              </Button>
            }
          />
          {/* The headings inside a demo belong to the SCREEN it draws,
              not to this guide: the screen's own title is the `h1` that
              `IngotPageHeader` writes, so its sections are level two under
              it. The index on the right is built from this guide's
              declared sections, so nothing from in here reaches it. */}
          <IngotSection title={cs ? "Fakta" : "The facts"}>
            <IngotDescriptionList
              columns={2}
              items={[
                {
                  label: cs ? "Zákazník" : "Customer",
                  value: "Strojírny Beneš",
                },
                { label: cs ? "Číslo" : "Number", value: "ZAK-2026-0184", mono: true },
                { label: cs ? "Termín" : "Due", value: "12. 9. 2026", mono: true },
                { label: cs ? "Obsluha" : "Operator", value: "J. Marek" },
              ]}
            />
          </IngotSection>
          <IngotSection title={cs ? "Postup" : "Progress"}>
            <IngotSkeleton shape="text" rows={2} label={cs ? "Načítá se" : "Loading"} />
          </IngotSection>
        </IngotPageLayout>
      </div>
      <p>
        {cs
          ? "Blok, jehož data ještě nedorazila, drží místo skeletonem. Ne prázdnem: obrazovka, ze které bloky doskakují, vypadá pokaždé jinak a čtenář nepozná, jestli je hotová."
          : "A block whose data has not arrived holds its place with a skeleton. Not with emptiness: a screen whose blocks pop in looks different every time and the reader cannot tell when it is finished."}
      </p>
    </div>
  );
}

function SettingsScreen({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const initial = { name: "Strojírny Beneš, s.r.o.", ico: "27082440" };
  const [values, setValues] = useState(initial);
  const dirty = values.name !== initial.name || values.ico !== initial.ico;

  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Obrazovka, která se vyplňuje. Sloupec na čtení, sekce po skupinách polí a lišta akcí na konci — aby Uložit bylo v dosahu i po devátém poli."
          : "A screen that is filled in. A reading column, sections by group of fields, and an action bar at the end — so Save is still in reach after the ninth field."}
      </p>
      <div className={STAGE}>
        <IngotPageLayout width="reading" testId="docs-layout-settings">
          <IngotPageHeader
            title={cs ? "Profil firmy" : "Company profile"}
            description={
              cs
                ? "Údaje, které se propisují na doklady a veřejné stránky."
                : "Details that reach documents and the public pages."
            }
          />
          <IngotSection title={cs ? "Identifikace" : "Identification"}>
            <IngotColumns>
              <IngotField
                label={cs ? "Název" : "Name"}
                value={values.name}
                onChange={(next) => setValues((prev) => ({ ...prev, name: next }))}
              />
              <IngotField
                label={cs ? "IČO" : "Company number"}
                mono
                value={values.ico}
                onChange={(next) => setValues((prev) => ({ ...prev, ico: next }))}
              />
            </IngotColumns>
          </IngotSection>
          <IngotActionBar
            dirty={dirty}
            status={
              dirty
                ? cs
                  ? "Neuložené změny"
                  : "Unsaved changes"
                : cs
                  ? "Uloženo"
                  : "Saved"
            }
            primary={
              <Button variant="accent" onClick={() => setValues(initial)}>
                {cs ? "Uložit změny" : "Save changes"}
              </Button>
            }
            secondary={
              <Button variant="ghost" onClick={() => setValues(initial)}>
                {cs ? "Zahodit" : "Discard"}
              </Button>
            }
          />
        </IngotPageLayout>
      </div>
      <p>
        {cs
          ? "Zkus přepsat název: lišta začne říkat, že jsou neuložené změny. Stav vedle akce je to, proč tam ta akce pořád je."
          : "Try changing the name: the bar starts saying there are unsaved changes. The state beside the action is why the action is still there."}
      </p>
    </div>
  );
}

function EmptyModule({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Modul, ve kterém ještě nic není, je stránka, kterou uživatel vidí jako první — a nejčastěji jediná, na které se rozhodne, jestli tu vůbec něco založí. Není to chybový stav, je to úvod."
          : "A module with nothing in it yet is the page a user sees first — and most often the only one on which they decide whether to create anything here at all. It is not an error state; it is an introduction."}
      </p>
      <div className={STAGE}>
        <IngotPageLayout width="card" testId="docs-layout-empty">
          <IngotEmptyState
            title={cs ? "Zatím žádné zakázky" : "No orders yet"}
            description={
              cs
                ? "Zakázka drží pohromadě výrobek, termín a zákazníka. První se dá založit ručně, další už chodí z objednávek."
                : "An order holds a product, a due date and a customer together. The first one can be created by hand; the rest arrive from orders."
            }
            action={
              <Button variant="accent">{cs ? "Nová zakázka" : "New order"}</Button>
            }
          />
        </IngotPageLayout>
      </div>
      <IngotList
        items={
          cs
            ? [
                <>
                  Řekni, <strong>co ta věc je</strong>, ne že tu není. „Žádná data“ je
                  konstatování, ne pomoc.
                </>,
                <>
                  Jedna akce, ta pravděpodobná. Prázdná obrazovka se třemi tlačítky je
                  rozcestník, ne úvod.
                </>,
                <>
                  Šířka <IngotCode>card</IngotCode>: text i akce zůstanou pohromadě
                  uprostřed. Roztažené přes 1 440 px vypadají jako zbytek stránky, který
                  se nenačetl.
                </>,
              ]
            : [
                <>
                  Say <strong>what the thing is</strong>, not that it is missing. "No
                  data" is a statement, not help.
                </>,
                <>
                  One action, the likely one. An empty screen with three buttons is a
                  crossroads, not an introduction.
                </>,
                <>
                  Width <IngotCode>card</IngotCode>: the text and the action stay
                  together in the middle. Stretched across 1,440 px they look like the
                  rest of a page that failed to load.
                </>,
              ]
        }
      />
    </div>
  );
}

const body: IngotGuideBody = {
  sirka: { cs: <Widths lang="cs" />, en: <Widths lang="en" /> },
  seznam: { cs: <ListScreen lang="cs" />, en: <ListScreen lang="en" /> },
  detail: { cs: <DetailScreen lang="cs" />, en: <DetailScreen lang="en" /> },
  nastaveni: { cs: <SettingsScreen lang="cs" />, en: <SettingsScreen lang="en" /> },
  "prazdny-modul": { cs: <EmptyModule lang="cs" />, en: <EmptyModule lang="en" /> },
};

export default body;
