import type { ReactNode } from "react";

/**
 * Ikonová vrstva kitu — sada rozhraní (KAN-649).
 *
 * Geometrie je převzatá z design handoffu Ingot v0.1
 * (``design_handoff_ingot/assets/icons.js``), technika je jeho:
 * viewBox 24×24, ``fill="none"``, ``stroke="currentColor"``, tloušťka
 * 1.6 se jmenovitými výjimkami, kulaté konce i spoje. Ikona se tedy
 * barví ``color`` rodiče a škáluje ``size`` — žádná vlastní paleta.
 *
 * 🚨 **Nekresli novou ikonu inline.** Před tímhle souborem byl v repu
 * pět nesouvisejících ostrůvků (``processIconLibrary``,
 * ``platformProcessesIcons``, ``plans/icons``, ``storageTypeIcons``,
 * ``cart/OperationIcon``) plus křížek namalovaný přímo v těle
 * ``IngotModal``. Ostrůvky dožívají tam, kde jsou; **nové použití jde
 * přes kit.** Chybí-li ti glyf, přidej ho sem — ne k sobě do souboru.
 *
 * Výrobní operace tady NEJSOU. Ty mají vlastní sadu a vlastní
 * pravidla (``IngotOpIcon``): jejich klíč ukládá backend a ikona bez
 * názvu operace je hádanka, ne popisek.
 *
 * 🪤 ``Arrow`` a ``X`` z handoffu vlastní klíč nedostaly — jejich
 * geometrie je znak po znaku shodná s ``ArrowRight`` resp. ``Close``,
 * takže by to byla dvě jména pro tutéž věc a call-site by se rozdělily
 * podle toho, kdo co našel dřív.
 */

/**
 * Glyf = jen vnitřek ``<svg>``. Obálku (viewBox, stroke, velikost,
 * přístupnost) skládá ``IngotIcon``, aby se ta pravidla nedala u jedné
 * ikony nedopatřením obejít.
 */
const GLYPHS = {
  // --- akce a přenos souborů ---
  "upload": (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1={12} y1={3} x2={12} y2={15} />
    </>
  ),
  "download": (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1={12} y1={15} x2={12} y2={3} />
    </>
  ),
  "save": (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </>
  ),
  "share": (
    <>
      <circle cx={18} cy={5} r={3} />
      <circle cx={6} cy={12} r={3} />
      <circle cx={18} cy={19} r={3} />
      <line x1={8.59} y1={13.51} x2={15.42} y2={17.49} />
      <line x1={15.41} y1={6.51} x2={8.59} y2={10.49} />
    </>
  ),
  "copy": (
    <>
      <rect x={9} y={9} width={13} height={13} rx={2} />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  "trash": (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  // --- stav ---
  "check": <polyline points="20 6 9 17 4 12" />,
  "alert": (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1={12} y1={9} x2={12} y2={13} />
      <line x1={12} y1={17} x2={12.01} y2={17} />
    </>
  ),
  "info": (
    <>
      <circle cx={12} cy={12} r={10} />
      <line x1={12} y1={16} x2={12} y2={12} />
      <line x1={12} y1={8} x2={12.01} y2={8} />
    </>
  ),
  "shield": <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  "bolt": <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  // --- šipky a navigace ---
  "arrow-right": (
    <>
      <line x1={5} y1={12} x2={19} y2={12} />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  "chevron-down": <polyline points="6 9 12 15 18 9" />,
  "chevron-right": <polyline points="9 18 15 12 9 6" />,
  "close": (
    <>
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </>
  ),
  // --- početní ---
  "plus": (
    <>
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </>
  ),
  "minus": <line x1={5} y1={12} x2={19} y2={12} />,
  // --- objekty domény a rozhraní ---
  "truck": (
    <>
      <rect x={1} y={7} width={13} height={10} rx={1} />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx={5.5} cy={18} r={2} />
      <circle cx={17.5} cy={18} r={2} />
    </>
  ),
  "clock": (
    <>
      <circle cx={12} cy={12} r={10} />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  "lock": (
    <>
      <rect x={3} y={11} width={18} height={11} rx={2} />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  "file": (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  "paperclip": <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
  "phone": <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />,
  "mail": (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </>
  ),
  "chat": <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  "map": (
    <>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1={8} y1={2} x2={8} y2={18} />
      <line x1={16} y1={6} x2={16} y2={22} />
    </>
  ),
  "grid": (
    <>
      <rect x={3} y={3} width={7} height={7} />
      <rect x={14} y={3} width={7} height={7} />
      <rect x={14} y={14} width={7} height={7} />
      <rect x={3} y={14} width={7} height={7} />
    </>
  ),
  "list": (
    <>
      <line x1={8} y1={6} x2={21} y2={6} />
      <line x1={8} y1={12} x2={21} y2={12} />
      <line x1={8} y1={18} x2={21} y2={18} />
      <line x1={3} y1={6} x2={3.01} y2={6} />
      <line x1={3} y1={12} x2={3.01} y2={12} />
      <line x1={3} y1={18} x2={3.01} y2={18} />
    </>
  ),
  // 🪤 Odrážky ``list`` sem nestačí. Tlačítko, které otevírá navigaci,
  // je na úzkém výřezu jediná cesta mezi obrazovkami, a čtenář ho hledá
  // podle tvaru, který zná — tři plné linky, ne seznam s puntíky.
  "menu": (
    <>
      <line x1={3} y1={6} x2={21} y2={6} />
      <line x1={3} y1={12} x2={21} y2={12} />
      <line x1={3} y1={18} x2={21} y2={18} />
    </>
  ),
  // --- hledání a pohled ---
  "search": (
    <>
      <circle cx={11} cy={11} r={7} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </>
  ),
  "zoom-in": (
    <>
      <circle cx={11} cy={11} r={7} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
      <line x1={11} y1={8} x2={11} y2={14} />
      <line x1={8} y1={11} x2={14} y2={11} />
    </>
  ),
  "zoom-out": (
    <>
      <circle cx={11} cy={11} r={7} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
      <line x1={8} y1={11} x2={14} y2={11} />
    </>
  ),
  "reset": (
    <>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </>
  ),
  "globe": (
    <>
      <circle cx={12} cy={12} r={10} />
      <line x1={2} y1={12} x2={22} y2={12} />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  "sliders": (
    <>
      <line x1={4} y1={21} x2={4} y2={14} />
      <line x1={4} y1={10} x2={4} y2={3} />
      <line x1={12} y1={21} x2={12} y2={12} />
      <line x1={12} y1={8} x2={12} y2={3} />
      <line x1={20} y1={21} x2={20} y2={16} />
      <line x1={20} y1={12} x2={20} y2={3} />
      <line x1={1} y1={14} x2={7} y2={14} />
      <line x1={9} y1={8} x2={15} y2={8} />
      <line x1={17} y1={16} x2={23} y2={16} />
    </>
  ),
  "drag": (
    <>
      <circle cx={9} cy={5} r={1} />
      <circle cx={9} cy={12} r={1} />
      <circle cx={9} cy={19} r={1} />
      <circle cx={15} cy={5} r={1} />
      <circle cx={15} cy={12} r={1} />
      <circle cx={15} cy={19} r={1} />
    </>
  ),
  // --- doplněk mimo handoff ---
  bulb: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

/**
 * Jmenovité výjimky z tloušťky 1.6, přesně jak je má handoff. Fajfka je
 * silnější schválně — v malé velikosti je to jediný tvar, který se čte
 * jako gesto, ne jako vlásek.
 */
const STROKE_WIDTHS: Partial<Record<IngotIconName, number>> = {
  "check": 2.2,
  "alert": 1.8,
  "info": 1.8,
  "arrow-right": 1.8,
  "chevron-down": 1.8,
  "chevron-right": 1.8,
  "close": 1.8,
  "plus": 1.8,
  "minus": 1.8,
};

const DEFAULT_STROKE_WIDTH = 1.6;

/** Klíče, které sada zná. Neznámý klíč typecheck neprojde. */
export type IngotIconName = keyof typeof GLYPHS;

/** Setříděný výčet — doc web i pickery ho vypisují, ať nikdo neopisuje. */
export const INGOT_ICON_NAMES = Object.keys(GLYPHS).sort() as IngotIconName[];

export interface IngotIconProps {
  name: IngotIconName;
  /**
   * Hrana čtverce v px. Výchozích 14 je velikost uvnitř tlačítka; sazbu
   * ostatních velikostí drží doc stránka, ne tenhle výchozí stav.
   */
  size?: number;
  /**
   * Vyplň, jen když ikona stojí SAMA a nese význam (tlačítko bez
   * popisku). Přidá ``<title>`` a ``role="img"``, takže ji odečítač
   * přečte. Vedle textu ji nech prázdnou — jinak čtečka řekne totéž
   * dvakrát.
   */
  title?: string;
  className?: string;
  testId?: string;
}

/**
 * Ikona z rozhraní sady.
 *
 * Dekorativní je VÝCHOZÍ stav (``aria-hidden``): drtivá většina ikon
 * v aplikaci stojí vedle svého popisku a odečítač je má přeskočit.
 */
export function IngotIcon({
  name,
  size = 14,
  title,
  className = "",
  testId,
}: IngotIconProps): JSX.Element | null {
  const glyph: ReactNode | undefined = GLYPHS[name];
  if (glyph === undefined) {
    // Klíč sice hlídá typecheck, ale do téhle komponenty umí přitéct
    // i z dat (uložená volba v adminu). Tiché nic by se hledalo přes
    // půl aplikace, tak ať to aspoň ve vývoji řekne nahlas.
    if (import.meta.env.DEV) {
      console.warn(`[IngotIcon] neznámý název ikony: "${String(name)}"`);
    }
    return null;
  }
  const labelled = title !== undefined && title !== "";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTHS[name] ?? DEFAULT_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`.trim()}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      data-testid={testId}
    >
      {labelled && <title>{title}</title>}
      {glyph}
    </svg>
  );
}
