import type { ReactNode } from "react";

// Development-only warnings read a bundler's flag, and ``ImportMeta`` has
// no ``env`` unless the consumer's tsconfig happens to include the
// bundler's types — so their typecheck failed inside our source, on a file
// they never wrote. The cast says what we expect and tolerates not finding
// it: no flag means "not a development build", so a production bundle
// stays silent rather than warning at every render.
//
// Deliberately NOT extracted into a shared helper. Two of these three
// files are imported by nearly every primitive, so a shared module would
// force a version bump on twenty-one doc pages for a change that alters
// nothing anyone can see — and a version that moves for that stops meaning
// "behaviour changed".
const DEV = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true;


/**
 * The kit's icon layer — the interface set.
 *
 * Geometry comes from the Ingot v0.1 design handoff and — for the mail
 * five, the star, the archive and the three dots — from the Mail screen
 * design drawn by the same hand. The technique is the handoff's:
 * viewBox 24×24, ``fill="none"``, ``stroke="currentColor"``, width 1.6
 * with named exceptions, round caps and joins. An icon therefore takes
 * its colour from the parent's ``color`` and scales with ``size`` — no
 * palette of its own.
 *
 * Fill is ONE named exception in the set: ``star-filled``. It may only
 * exist as ``currentColor`` and only as a second SHAPE to a stroked glyph
 * that carries state — two shapes read in greyscale, two colours do not.
 * Decorative or multi-colour fills do not belong in the set.
 *
 * **Do not draw a new icon inline.** Before this file the product had
 * five unrelated islands of icons plus a close cross painted straight
 * into the modal's body. New usage goes through the kit: if a glyph is
 * missing, add it here — not to your own file.
 *
 * Production operations are NOT here. They have their own set and their
 * own rules (``IngotOpIcon``): their key is stored by the backend and an
 * icon without the operation's name is a riddle, not a label.
 *
 * ``Arrow`` and ``X`` from the handoff got no key of their own — their
 * geometry is character for character the same as ``ArrowRight`` and
 * ``Close``, so they would be two names for one thing and call sites
 * would split by who found which first.
 */

/**
 * A glyph is only the inside of the ``<svg>``. The envelope (viewBox,
 * stroke, size, accessibility) is composed by ``IngotIcon`` so those rules
 * cannot be bypassed by accident on one icon.
 */
const GLYPHS = {
  // --- actions and file transfer ---
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
  "archive": (
    <>
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x={1} y={3} width={22} height={5} />
      <line x1={10} y1={12} x2={14} y2={12} />
    </>
  ),
  // --- state ---
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
  "star": <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  // The only fill in the set, and an exception with a reason. A starred
  // thread differed from an unstarred one by colour alone, and the
  // yellow/grey pair is exactly the one colour blindness erases most; a
  // screen reader has ``aria-pressed``, but a sighted colour-blind user
  // never hears it. A second SHAPE reads in greyscale too.
  //
  // The conditions under which a fill belongs in the set are held by the
  // Limits section of the doc page: only ``currentColor``, only as a second
  // shape to an existing stroked glyph that carries state. No decorative
  // fills.
  "star-filled": (
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="currentColor"
    />
  ),
  "shield": <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  "bolt": <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  // --- arrows and navigation ---
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
  // --- arithmetic ---
  "plus": (
    <>
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </>
  ),
  "minus": <line x1={5} y1={12} x2={19} y2={12} />,
  // --- domain and interface objects ---
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
  // --- mail ---
  //
  // ``mail`` and ``chat`` above are about the channel; these five are about
  // what is done with a message. The inbox has its own glyph because "a
  // folder of mail" and "an envelope" mean two different things in one
  // interface.
  "inbox": (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
  "send": (
    <>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>
  ),
  "reply": (
    <>
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </>
  ),
  "forward": (
    <>
      <polyline points="15 17 20 12 15 7" />
      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </>
  ),
  "tag": (
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1={7} y1={7} x2={7.01} y2={7} />
    </>
  ),
  // --- people and companies ---
  "user": (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx={12} cy={7} r={4} />
    </>
  ),
  "building": (
    <>
      <rect x={4} y={3} width={16} height={18} rx={1.5} />
      <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4" />
    </>
  ),
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
  // The ``list`` bullets are not enough here. The button that opens the
  // navigation is, on a narrow viewport, the only way between screens, and
  // the reader looks for the shape they know — three full lines, not a
  // bulleted list.
  "menu": (
    <>
      <line x1={3} y1={6} x2={21} y2={6} />
      <line x1={3} y1={12} x2={21} y2={12} />
      <line x1={3} y1={18} x2={21} y2={18} />
    </>
  ),
  // --- search and view ---
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
  "more": (
    <>
      <circle cx={5} cy={12} r={1} />
      <circle cx={12} cy={12} r={1} />
      <circle cx={19} cy={12} r={1} />
    </>
  ),
  // --- addition outside the handoff ---
  bulb: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

/**
 * Named exceptions to the 1.6 stroke width, exactly as the handoff has
 * them. The check mark is heavier on purpose — at small sizes it is the
 * only shape that reads as a gesture rather than a hairline.
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

/** The keys the set knows. An unknown key fails the typecheck. */
export type IngotIconName = keyof typeof GLYPHS;

/** Sorted list — the doc web and pickers print it, so nobody copies it out. */
export const INGOT_ICON_NAMES = Object.keys(GLYPHS).sort() as IngotIconName[];

export interface IngotIconProps {
  name: IngotIconName;
  /**
   * Edge of the square in px. The default 14 is the size inside a button;
   * the other sizes are set by the doc page, not by this default.
   */
  size?: number;
  /**
   * Fill in only when the icon stands ALONE and carries meaning (a button
   * without a label). Adds ``<title>`` and ``role="img"`` so a screen
   * reader reads it. Next to text leave it empty — otherwise the reader
   * says the same thing twice.
   */
  title?: string;
  className?: string;
  testId?: string;
}

/**
 * An icon from the interface set.
 *
 * Decorative is the DEFAULT (``aria-hidden``): the vast majority of icons
 * in the product stand next to their label and a screen reader should
 * skip them.
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
    // The typecheck guards the key, but it can also arrive from data (a
    // stored choice in the admin). A silent nothing would be hunted across
    // half the app, so at least say it out loud in development.
    if (DEV) {
      console.warn(`[IngotIcon] unknown icon name: "${String(name)}"`);
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
