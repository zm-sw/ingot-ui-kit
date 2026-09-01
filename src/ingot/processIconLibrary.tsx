import type { ReactNode } from "react";

/**
 * Built-in library of manufacturing-operation icons ("Výrobní operace").
 *
 * Line-art set (24×24 viewBox, stroke currentColor, width 1.6, round
 * caps/joins) ported from the design reference "Vyrobni operace
 * (standalone).html". Mirrors the ``FinishSwatch`` precedent: adding an
 * icon here is the only step needed to expose it — no DB migration, the
 * BE stores the picked token opaquely in
 * ``process_module_definitions.icon_key``.
 *
 * Token format (what the BE stores):
 *   - ``laser``        → icon inked with the PROCESS's system operation
 *                        category colour (``operation_category_color``,
 *                        admin-managed in "Systémové kategorie") — NOT a
 *                        library-side palette
 *   - ``laser:black``  → black icon, transparent background
 *   - ``laser:white``  → white icon, transparent background
 *
 * The glyph always renders on a transparent background and fills its
 * box — any chip/tile chrome belongs to the caller.
 *
 * Never auto-assigned — the admin explicitly picks an icon in the
 * library dialog; there is NO slug→icon name matching anywhere.
 */

export interface ProcessIconItem {
  key: string;
  labelCs: string;
  labelEn: string;
  icon: ReactNode;
}

export interface ProcessIconCategory {
  id: string;
  labelCs: string;
  labelEn: string;
  items: ProcessIconItem[];
}

export type ProcessIconVariant = "category" | "black" | "white";

/** Fixed inks for the monochrome variants (design-system near-black /
 * near-white). The "category" variant's ink comes from the process's
 * system category colour at render time. */
export const PROCESS_ICON_VARIANT_INKS: Record<
  Exclude<ProcessIconVariant, "category">,
  string
> = {
  black: "var(--ink)",
  white: "var(--bg)",
};

/** Neutral ink when the process has no system category colour. */
const FALLBACK_INK = "var(--ink-3)";

/** Ink colour for a resolved variant + the process's system category colour. */
export function processIconInk(
  variant: ProcessIconVariant,
  categoryColor?: string | null,
): string {
  if (variant === "category") return categoryColor || FALLBACK_INK;
  return PROCESS_ICON_VARIANT_INKS[variant];
}

function svg(children: ReactNode): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const PROCESS_ICON_CATEGORIES: ProcessIconCategory[] = [
  {
    id: "cut",
    labelCs: "Dělení a řezání",
    labelEn: "Cutting",
    items: [
      {
        key: "laser",
        labelCs: "Laser řezání",
        labelEn: "Laser cutting",
        icon: svg(
          <>
            <rect x={9} y={2.5} width={6} height={5} rx={1} />
            <line x1={12} y1={7.5} x2={12} y2={15} />
            <path d="M9.5 13.5l2.5 1.5 2.5-1.5" />
            <line x1={3} y1={18.5} x2={21} y2={18.5} />
            <path d="M5 18.5l1.5-3h11l1.5 3" />
          </>,
        ),
      },
      {
        key: "plasma",
        labelCs: "Plazmové řezání",
        labelEn: "Plasma cutting",
        icon: svg(
          <>
            <path d="M8 2.5h8l-1 4h-6z" />
            <line x1={12} y1={6.5} x2={12} y2={9} />
            <path d="M10 9l1.2 2-1 2 1.8 2-1 2" />
            <line x1={3} y1={19} x2={21} y2={19} />
            <circle cx={16} cy={11} r={0.6} fill="currentColor" stroke="none" />
            <circle cx={7} cy={13} r={0.6} fill="currentColor" stroke="none" />
          </>,
        ),
      },
      {
        key: "waterjet",
        labelCs: "Vodní paprsek",
        labelEn: "Waterjet",
        icon: svg(
          <>
            <path d="M9 3h6v3l-1.5 2h-3L9 6z" />
            <line x1={12} y1={8} x2={12} y2={14} />
            <path d="M10 14l2 4 2-4" />
            <line x1={3} y1={20} x2={21} y2={20} />
            <circle cx={7} cy={16} r={0.7} fill="currentColor" stroke="none" />
            <circle cx={17} cy={17} r={0.7} fill="currentColor" stroke="none" />
          </>,
        ),
      },
      {
        key: "wire_edm",
        labelCs: "Drátové řezání EDM",
        labelEn: "Wire EDM",
        icon: svg(
          <>
            <circle cx={5} cy={5} r={1.4} />
            <circle cx={19} cy={19} r={1.4} />
            <line x1={5} y1={6.5} x2={19} y2={17.5} />
            <path d="M3 12h7l2-2 2 4 2-2h5" />
          </>,
        ),
      },
      {
        key: "saw",
        labelCs: "Pilové řezání",
        labelEn: "Saw cutting",
        icon: svg(
          <>
            <circle cx={12} cy={12} r={7} />
            <circle cx={12} cy={12} r={1.4} />
            <path d="M12 3v2 M19 5l-1.4 1.4 M21 12h-2 M19 19l-1.4-1.4 M12 21v-2 M5 19l1.4-1.4 M3 12h2 M5 5l1.4 1.4" />
          </>,
        ),
      },
      {
        key: "shear",
        labelCs: "Stříhání",
        labelEn: "Shearing",
        icon: svg(
          <>
            <circle cx={6} cy={6} r={2.4} />
            <circle cx={6} cy={18} r={2.4} />
            <line x1={8} y1={7.5} x2={20} y2={17} />
            <line x1={8} y1={16.5} x2={20} y2={7} />
          </>,
        ),
      },
    ],
  },
  {
    id: "form",
    labelCs: "Tváření",
    labelEn: "Forming",
    items: [
      {
        key: "bend",
        labelCs: "Ohýbání plechu",
        labelEn: "Sheet bending",
        icon: svg(
          <>
            <path d="M3 7h9a4 4 0 0 1 4 4v10" />
            <path d="M12 4l-1.5 3L9 4" />
            <path d="M19 19l1.5-3 1.5 3" />
            <path d="M12.5 11a3.5 3.5 0 0 1 3.5 3.5" strokeDasharray="2 2" />
          </>,
        ),
      },
      {
        key: "press_brake",
        labelCs: "Ohraňování (CNC)",
        labelEn: "Press brake",
        icon: svg(
          <>
            <path d="M9 3h6v6l-3 4-3-4z" />
            <line x1={12} y1={13} x2={12} y2={16} />
            <path d="M3 21l7-4h4l7 4" />
            <path d="M3 21h18" />
          </>,
        ),
      },
      {
        key: "stamp",
        labelCs: "Lisování / děrování",
        labelEn: "Stamping / punching",
        icon: svg(
          <>
            <rect x={4} y={3} width={16} height={4} rx={1} />
            <line x1={12} y1={7} x2={12} y2={14} />
            <path d="M5 17l3-3h8l3 3" />
            <line x1={3} y1={21} x2={21} y2={21} />
          </>,
        ),
      },
      {
        key: "deep_draw",
        labelCs: "Hluboké tažení",
        labelEn: "Deep drawing",
        icon: svg(
          <>
            <path d="M3 8h6v8h6V8h6" />
            <line x1={12} y1={2} x2={12} y2={6} />
            <path d="M10 4l2-2 2 2" />
            <line x1={3} y1={20} x2={21} y2={20} />
          </>,
        ),
      },
      {
        key: "rolling",
        labelCs: "Válcování / zaoblení",
        labelEn: "Rolling",
        icon: svg(
          <>
            <circle cx={7} cy={8} r={2.5} />
            <circle cx={17} cy={8} r={2.5} />
            <line x1={3} y1={13} x2={21} y2={13} />
            <line x1={3} y1={16} x2={21} y2={16} />
            <path d="M6 13c0 1.5 1 3 2 3 M18 13c0 1.5-1 3-2 3" />
          </>,
        ),
      },
    ],
  },
  {
    id: "mach",
    labelCs: "Třískové obrábění",
    labelEn: "Machining",
    items: [
      {
        key: "mill",
        labelCs: "Frézování (CNC)",
        labelEn: "CNC milling",
        icon: svg(
          <>
            <rect x={9} y={3} width={6} height={6} rx={0.6} />
            <line x1={12} y1={9} x2={12} y2={14} />
            <path d="M10.5 14h3v1.5h-3z" />
            <path d="M3 18h7l2-2 2 2h7" />
            <line x1={3} y1={21} x2={21} y2={21} />
          </>,
        ),
      },
      {
        key: "lathe",
        labelCs: "Soustružení (CNC)",
        labelEn: "CNC turning",
        icon: svg(
          <>
            <path d="M2 10h4v4H2z" />
            <path d="M6 11h12v2H6z" />
            <path d="M18 10h4v4h-4z" />
            <path d="M14 14l1 3 2 1" />
            <path d="M3 5h18 M3 19h18" strokeDasharray="3 2" />
          </>,
        ),
      },
      {
        key: "drill",
        labelCs: "Vrtání",
        labelEn: "Drilling",
        icon: svg(
          <>
            <rect x={9} y={2.5} width={6} height={4} rx={1} />
            <path d="M10.5 6.5h3v6l-1.5 2-1.5-2z" />
            <path d="M9.5 9l5 1 M9.5 11l5 1" strokeWidth={1} />
            <ellipse cx={12} cy={18} rx={5} ry={1.5} />
          </>,
        ),
      },
      {
        key: "thread",
        labelCs: "Závitování",
        labelEn: "Tapping / threading",
        icon: svg(
          <>
            <path d="M9 3h6v4h-6z" />
            <line x1={10} y1={7} x2={10} y2={19} />
            <line x1={14} y1={7} x2={14} y2={19} />
            <path d="M10 10l4-1 M10 13l4-1 M10 16l4-1" />
            <path d="M12 19l-1.5 2h3z" />
          </>,
        ),
      },
      {
        key: "bore",
        labelCs: "Vyvrtávání / honování",
        labelEn: "Boring / honing",
        icon: svg(
          <>
            <ellipse cx={12} cy={6} rx={7} ry={2} />
            <path d="M5 6v12c0 1.1 3.1 2 7 2s7-.9 7-2V6" />
            <line x1={12} y1={8} x2={12} y2={16} />
            <path d="M10.5 16h3v1.5h-3z" />
          </>,
        ),
      },
    ],
  },
  {
    id: "add",
    labelCs: "Aditivní výroba",
    labelEn: "Additive",
    items: [
      {
        key: "print_3d",
        labelCs: "3D tisk (FDM)",
        labelEn: "FDM / FFF",
        icon: svg(
          <>
            <path d="M9 3h6v5l-1.5 2h-3L9 8z" />
            <line x1={12} y1={10} x2={12} y2={12} />
            <path d="M6 21l3-7h6l3 7z" />
            <line x1={7} y1={17.5} x2={17} y2={17.5} />
            <line x1={7.5} y1={19.5} x2={16.5} y2={19.5} />
          </>,
        ),
      },
      {
        key: "sla",
        labelCs: "SLA / DLP",
        labelEn: "Resin printing",
        icon: svg(
          <>
            <path d="M3 8h18l-2 12H5z" />
            <rect x={7} y={5} width={10} height={3} />
            <line x1={12} y1={8} x2={12} y2={16} />
            <path d="M9 12l3 4 3-4" />
          </>,
        ),
      },
      {
        key: "sls",
        labelCs: "SLS / MJF",
        labelEn: "Powder bed fusion",
        icon: svg(
          <>
            <rect x={3} y={7} width={18} height={13} rx={1} />
            <line x1={3} y1={14} x2={21} y2={14} />
            <line x1={12} y1={3} x2={12} y2={7} />
            <path d="M10 5l2-2 2 2" />
            <circle cx={7} cy={17} r={0.5} fill="currentColor" stroke="none" />
            <circle cx={10} cy={18} r={0.5} fill="currentColor" stroke="none" />
            <circle cx={13} cy={17} r={0.5} fill="currentColor" stroke="none" />
            <circle cx={16} cy={18} r={0.5} fill="currentColor" stroke="none" />
          </>,
        ),
      },
    ],
  },
  {
    id: "join",
    labelCs: "Spojování",
    labelEn: "Joining",
    items: [
      {
        key: "weld",
        labelCs: "Svařování (MIG/TIG)",
        labelEn: "Welding",
        icon: svg(
          <>
            <path d="M14 3l4 4-8 8H7v-3z" />
            <line x1={12} y1={5} x2={16} y2={9} />
            <path d="M3 21l3-3 3 3 3-3 3 3 3-3 3 3" />
            <circle cx={5} cy={5} r={0.6} fill="currentColor" stroke="none" />
            <circle cx={19} cy={14} r={0.6} fill="currentColor" stroke="none" />
          </>,
        ),
      },
      {
        key: "solder",
        labelCs: "Pájení",
        labelEn: "Soldering / brazing",
        icon: svg(
          <>
            <path d="M16 3l5 5-9 9-5-5z" />
            <line x1={7} y1={12} x2={3} y2={16} />
            <line x1={3} y1={20} x2={21} y2={20} />
            <circle cx={13} cy={17} r={0.8} fill="currentColor" stroke="none" />
          </>,
        ),
      },
      {
        key: "rivet",
        labelCs: "Nýtování",
        labelEn: "Riveting",
        icon: svg(
          <>
            <path d="M7 5h10l-1.5 3h-7z" />
            <line x1={10.5} y1={8} x2={10.5} y2={18} />
            <line x1={13.5} y1={8} x2={13.5} y2={18} />
            <line x1={3} y1={11} x2={21} y2={11} />
            <line x1={3} y1={15} x2={21} y2={15} />
          </>,
        ),
      },
      {
        key: "glue",
        labelCs: "Lepení",
        labelEn: "Adhesive bonding",
        icon: svg(
          <>
            <path d="M10 3h4v3h-4z" />
            <path d="M9 6h6l-1 3h-4z" />
            <path d="M10 9h4v11h-4z" />
            <path d="M17 9l3 2-1 3" />
            <circle cx={19} cy={16.5} r={0.7} fill="currentColor" stroke="none" />
          </>,
        ),
      },
      {
        key: "assembly",
        labelCs: "Montáž",
        labelEn: "Assembly",
        icon: svg(
          <>
            <circle cx={8} cy={8} r={3} />
            <line x1={8} y1={8} x2={8.01} y2={8} strokeWidth={2.4} />
            <path d="M14 14l7 7 M14 21l7-7" />
            <rect x={13} y={13} width={4} height={4} transform="rotate(45 15 15)" />
          </>,
        ),
      },
    ],
  },
  {
    id: "surf",
    labelCs: "Povrchové úpravy",
    labelEn: "Surface finishing",
    items: [
      {
        key: "grind",
        labelCs: "Broušení",
        labelEn: "Grinding",
        icon: svg(
          <>
            <circle cx={10} cy={10} r={6} />
            <circle cx={10} cy={10} r={1.2} />
            <path d="M5 10h2 M13 10h2 M10 5v2 M10 13v2" />
            <line x1={3} y1={20} x2={21} y2={20} />
            <circle cx={16} cy={17} r={0.5} fill="currentColor" stroke="none" />
            <circle cx={18} cy={19} r={0.5} fill="currentColor" stroke="none" />
          </>,
        ),
      },
      {
        key: "polish",
        labelCs: "Leštění",
        labelEn: "Polishing",
        icon: svg(
          <>
            <circle cx={12} cy={10} r={5} />
            <path d="M8 8c1.5 -1 5 -1 7 0" strokeWidth={1.1} />
            <path d="M8 11c1.5 -1 5 -1 7 0" strokeWidth={1.1} />
            <line x1={3} y1={20} x2={21} y2={20} />
            <line x1={12} y1={15} x2={12} y2={18} />
          </>,
        ),
      },
      {
        key: "sandblast",
        labelCs: "Pískování",
        labelEn: "Sandblasting",
        icon: svg(
          <>
            <path d="M3 4l4 3v3l-4 3z" />
            <line x1={7} y1={8.5} x2={11} y2={8.5} />
            <path d="M11 5l10 4-10 4z" />
            <circle cx={14} cy={7} r={0.5} fill="currentColor" stroke="none" />
            <circle cx={17} cy={9} r={0.5} fill="currentColor" stroke="none" />
            <circle cx={15} cy={10.5} r={0.5} fill="currentColor" stroke="none" />
            <line x1={3} y1={20} x2={21} y2={20} />
          </>,
        ),
      },
      {
        key: "tumble",
        labelCs: "Omílání (vibratory)",
        labelEn: "Vibratory finishing",
        icon: svg(
          <>
            <ellipse cx={12} cy={12} rx={8} ry={6} />
            <path d="M4 12c3 -2 13 -2 16 0" />
            <circle cx={9} cy={13} r={0.7} fill="currentColor" stroke="none" />
            <circle cx={12} cy={14} r={0.7} fill="currentColor" stroke="none" />
            <circle cx={15} cy={13} r={0.7} fill="currentColor" stroke="none" />
            <path d="M19 6l1 -2 M5 6l-1 -2" strokeWidth={1.2} />
          </>,
        ),
      },
      {
        key: "powder_coat",
        labelCs: "Práškové lakování",
        labelEn: "Powder coating",
        icon: svg(
          <>
            <path d="M3 9l6-2v6l-6-2z" />
            <path d="M5 13v4h2v-4" />
            <line x1={9} y1={10} x2={11} y2={10} />
            <path d="M11 7c4 0 7 1.5 7 5s-3 5-7 5c-2 0 -2 -2 0 -2 c2 0 5 -1 5 -3s-3 -3 -5 -3 c-2 0 -2 -2 0 -2z" />
          </>,
        ),
      },
      {
        key: "anodize",
        labelCs: "Eloxování / galvanika",
        labelEn: "Anodizing / plating",
        icon: svg(
          <>
            <path d="M3 9h18v3" />
            <path d="M4 12l1.5 9h13L20 12z" />
            <line x1={9} y1={4} x2={9} y2={17} />
            <line x1={15} y1={4} x2={15} y2={17} />
            <path d="M7 14c1 -1 2 1 3 0 c1 -1 2 1 3 0 c1 -1 2 1 3 0" strokeWidth={1.1} />
            <text x={8.5} y={6} fontSize={4} fill="currentColor" stroke="none" fontFamily="monospace">
              +
            </text>
            <text x={14.4} y={6} fontSize={4} fill="currentColor" stroke="none" fontFamily="monospace">
              −
            </text>
          </>,
        ),
      },
      {
        key: "heat_treat",
        labelCs: "Tepelné zpracování",
        labelEn: "Heat treatment",
        icon: svg(
          <>
            <rect x={3} y={4} width={18} height={16} rx={1} />
            <rect x={6} y={7} width={12} height={10} />
            <path d="M12 9c-1 2 -2 3 -2 4.5a2 2 0 0 0 4 0c0 -1 -1 -2.5 -2 -4.5z" />
            <line x1={9} y1={17} x2={15} y2={17} />
          </>,
        ),
      },
      {
        key: "quench",
        labelCs: "Kalení",
        labelEn: "Quenching",
        icon: svg(
          <>
            <path d="M3 14h18v6H3z" />
            <path d="M3 14c2 -2 4 2 6 0s4 2 6 0 4 2 6 0" strokeWidth={1.1} />
            <path d="M11 3h2v10h-2z" />
            <path d="M10 13l2 3 2-3" />
          </>,
        ),
      },
    ],
  },
  {
    id: "mark",
    labelCs: "Značení a kontrola",
    labelEn: "Marking & inspection",
    items: [
      {
        key: "engrave",
        labelCs: "Laserové gravírování",
        labelEn: "Laser engraving",
        icon: svg(
          <>
            <path d="M14 3l4 4-7 7-4 1 1-4z" />
            <line x1={12} y1={5} x2={16} y2={9} />
            <line x1={3} y1={20} x2={21} y2={20} />
            <path d="M5 17l2 0 M9 17l3 0 M14 17l2 0" strokeWidth={1.1} />
          </>,
        ),
      },
      {
        key: "mark",
        labelCs: "Značení / inkjet",
        labelEn: "Marking / inkjet",
        icon: svg(
          <>
            <rect x={7} y={3} width={10} height={6} rx={1} />
            <path d="M10 9v2 M14 9v2" />
            <circle cx={10} cy={14} r={0.6} fill="currentColor" stroke="none" />
            <circle cx={12} cy={14} r={0.6} fill="currentColor" stroke="none" />
            <circle cx={14} cy={14} r={0.6} fill="currentColor" stroke="none" />
            <line x1={3} y1={20} x2={21} y2={20} />
          </>,
        ),
      },
      {
        key: "inspect",
        labelCs: "Kontrola kvality",
        labelEn: "QC inspection",
        icon: svg(
          <>
            <path d="M3 7h12v2H3z" />
            <path d="M3 9v6h3V9 M9 9v4h3V9" />
            <path d="M15 8v5h6V8" />
            <path d="M17 13v3h2v-3" />
          </>,
        ),
      },
      {
        key: "measure",
        labelCs: "Měření",
        labelEn: "Measuring",
        icon: svg(
          <>
            <rect x={3} y={8} width={18} height={8} rx={1} />
            <path d="M7 8v3 M11 8v4 M15 8v3 M19 8v4" strokeWidth={1.1} />
          </>,
        ),
      },
      {
        key: "cmm",
        labelCs: "CMM / sondování",
        labelEn: "CMM probing",
        icon: svg(
          <>
            <line x1={12} y1={3} x2={12} y2={10} />
            <circle cx={12} cy={12} r={1.6} />
            <path d="M5 20l3-4h8l3 4" />
            <line x1={3} y1={20} x2={21} y2={20} />
            <path d="M3 5h7 M14 5h7" strokeDasharray="2 2" />
          </>,
        ),
      },
    ],
  },
  {
    id: "log",
    labelCs: "Logistika a podpora",
    labelEn: "Logistics & support",
    items: [
      {
        key: "cad",
        labelCs: "CAD / výkres",
        labelEn: "CAD / drawing",
        icon: svg(
          <>
            <path d="M5 3h11l3 3v15H5z" />
            <path d="M16 3v3h3" />
            <path d="M8 12h8 M8 16h5" strokeWidth={1.1} />
            <circle cx={9} cy={9} r={1} />
            <path d="M9 9l3 -1 1 1" strokeWidth={1.1} />
          </>,
        ),
      },
      {
        key: "dfm",
        labelCs: "DFM kontrola",
        labelEn: "DFM review",
        icon: svg(
          <>
            <circle cx={10} cy={10} r={6} />
            <line x1={14.5} y1={14.5} x2={20} y2={20} />
            <path d="M7 10l2 2 4 -4" strokeWidth={1.8} />
          </>,
        ),
      },
      {
        key: "nest",
        labelCs: "Nestování",
        labelEn: "Nesting",
        icon: svg(
          <>
            <rect x={3} y={3} width={18} height={18} rx={1} />
            <path d="M5 6h6v4H5z" />
            <path d="M13 5l4 4-4 4z" />
            <circle cx={8} cy={15} r={2} />
            <path d="M12 13h7v6h-7z" />
          </>,
        ),
      },
      {
        key: "tooling",
        labelCs: "Nástroje / přípravky",
        labelEn: "Tooling / fixtures",
        icon: svg(
          <>
            <circle cx={12} cy={12} r={3} />
            <path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1 -2.1 M16.3 7.7l2.1 -2.1" />
          </>,
        ),
      },
      {
        key: "pack",
        labelCs: "Balení",
        labelEn: "Packaging",
        icon: svg(
          <>
            <path d="M3 7l9-4 9 4-9 4z" />
            <path d="M3 7v10l9 4 9-4V7" />
            <line x1={12} y1={11} x2={12} y2={21} />
            <line x1={7.5} y1={5} x2={16.5} y2={9} />
          </>,
        ),
      },
      {
        key: "storage",
        labelCs: "Skladování",
        labelEn: "Storage",
        icon: svg(
          <>
            <rect x={4} y={5} width={7} height={6} />
            <rect x={13} y={5} width={7} height={6} />
            <rect x={4} y={13} width={16} height={5} />
            <line x1={3} y1={20} x2={21} y2={20} />
            <path d="M6 20l-1 1 M18 20l1 1" />
          </>,
        ),
      },
      {
        key: "kit",
        labelCs: "Kitting",
        labelEn: "Kitting",
        icon: svg(
          <>
            <path d="M6 7h12l-1 13H7z" />
            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            <circle cx={10} cy={13} r={1.2} />
            <rect x={12.5} y={11.5} width={3} height={3} />
            <path d="M9 17l3 0 3 -1" />
          </>,
        ),
      },
    ],
  },
];

const ITEM_INDEX: ReadonlyMap<
  string,
  { item: ProcessIconItem; category: ProcessIconCategory }
> = new Map(
  PROCESS_ICON_CATEGORIES.flatMap((category) =>
    category.items.map((item) => [item.key, { item, category }] as const),
  ),
);

/** Build the ``icon_key`` token the BE stores for a (name, variant) pick. */
export function processIconToken(
  name: string,
  variant: ProcessIconVariant,
): string {
  return variant === "category" ? name : `${name}:${variant}`;
}

export function parseProcessIconKey(
  token: string,
): { name: string; variant: ProcessIconVariant } | null {
  const [name, suffix, ...rest] = token.split(":");
  if (!name || rest.length > 0) return null;
  if (suffix === undefined) return { name, variant: "category" };
  if (suffix === "black" || suffix === "white") return { name, variant: suffix };
  return null;
}

export interface ResolvedProcessIcon {
  icon: ReactNode;
  variant: ProcessIconVariant;
  category: ProcessIconCategory;
  labelCs: string;
  labelEn: string;
}

/**
 * Resolve a stored ``icon_key`` token to a renderable icon + variant.
 * Returns ``null`` for unknown names / malformed tokens so callers can
 * fall back (OperationIcon drops to its 2-letter glyph).
 */
export function resolveProcessIcon(
  token: string | null | undefined,
): ResolvedProcessIcon | null {
  if (!token) return null;
  const parsed = parseProcessIconKey(token);
  if (!parsed) return null;
  const entry = ITEM_INDEX.get(parsed.name);
  if (!entry) return null;
  return {
    icon: entry.item.icon,
    variant: parsed.variant,
    category: entry.category,
    labelCs: entry.item.labelCs,
    labelEn: entry.item.labelEn,
  };
}

/**
 * The single-source glyph renderer for a library icon — used by the
 * customer-facing ``OperationIcon`` AND the admin picker dialog, so the
 * admin preview is exactly what customers see.
 *
 * Transparent background, no border: the icon fills the whole box and
 * is inked by the PROCESS's system category colour (``categoryColor``,
 * from ``operation_category_color``) or fixed black/white per the token
 * variant. Any tile/box chrome belongs to the caller.
 */
export function ProcessIconGlyph({
  token,
  size = 24,
  categoryColor,
  className = "",
}: {
  token: string | null | undefined;
  size?: number;
  /** ``operation_category_color`` of the process the icon is assigned to. */
  categoryColor?: string | null;
  className?: string;
}): JSX.Element | null {
  const resolved = resolveProcessIcon(token);
  if (!resolved) return null;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        color: processIconInk(resolved.variant, categoryColor),
      }}
    >
      {resolved.icon}
    </span>
  );
}
