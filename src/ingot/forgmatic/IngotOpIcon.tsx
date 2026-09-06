
import {
  PROCESS_ICON_CATEGORIES,
  processIconInk,
  resolveProcessIcon,
  type ProcessIconVariant,
} from "./processIconLibrary";

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
 * The kit's icon layer — the set of production operations.
 *
 * **The geometry is NOT here and never will be.** It lives in
 * ``processIconLibrary`` — 43 glyphs ported from the same reference as the
 * handoff — and this component is only an envelope over them. A second
 * copy of the drawings would drift silently: both would keep rendering and
 * differ only in a shape nobody notices.
 *
 * **The key is opaque to the backend.** The stored ``icon_key`` token is
 * ``<key>`` / ``<key>:black`` / ``<key>:white`` and its meaning is decided
 * by ``parseProcessIconKey``, not by this component. Do not translate it,
 * do not build it from the operation's name and do not assign it
 * automatically — an admin picks the icon by hand and there is no
 * slug→icon mapping in the repository.
 *
 * **Do not write the name of a concrete technology here** — not in a demo,
 * not in an example. The platform must not know the vocabulary of one
 * domain. Need real keys in a demo? Take them from ``INGOT_OP_ICON_KEYS``,
 * which lists them from the library at runtime.
 *
 * Usage rules (the doc page lists them in full):
 *
 * * an operation icon **never stands without the operation's name** — the
 *   exception is a width-critical row, where it must carry ``title``;
 * * the icon and the category dot are **not combined** — both say the same
 *   thing and side by side they contradict each other;
 * * a new technology = a new icon in the library, **never an emoji**.
 */
export interface IngotOpIconProps {
  /**
   * The stored ``icon_key``. ``null`` / an unknown token renders ``null``
   * so the caller can fall back to its own replacement glyph.
   */
  token: string | null | undefined;
  /** Edge of the square in px; the operations set is set at 18–22. */
  size?: number;
  /**
   * The category colour of the process the icon belongs to. Applies only
   * to the ``category`` variant — with ``:black`` / ``:white`` the token
   * carries its own colour.
   */
  categoryColor?: string | null;
  /**
   * Operation name for a screen reader. Fill in ONLY in a width-critical
   * row where the icon stands without its label; elsewhere leave it
   * decorative so the reader does not read the name twice.
   */
  title?: string;
  className?: string;
  testId?: string;
}

/**
 * The keys the operations library knows — read from it at runtime, not
 * copied out.
 *
 * It is the only way to show real icons (doc web, picker) without writing
 * the name of a concrete technology into the source. That ban is not
 * cosmetic: the platform must not know the vocabulary of one domain.
 */
export const INGOT_OP_ICON_KEYS: readonly string[] = PROCESS_ICON_CATEGORIES
  .flatMap((category) => category.items.map((item) => item.key))
  .sort();

/** Ink variant read from the token — for callers that need to know
 *  whether the icon decides its own colour. */
export type IngotOpIconVariant = ProcessIconVariant;

export function IngotOpIcon({
  token,
  size = 20,
  categoryColor,
  title,
  className = "",
  testId,
}: IngotOpIconProps): JSX.Element | null {
  const resolved = resolveProcessIcon(token);
  if (resolved === null) {
    if (DEV && token) {
      console.warn(`[IngotOpIcon] unknown icon_key: "${token}"`);
    }
    return null;
  }
  const labelled = title !== undefined && title !== "";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`.trim()}
      style={{
        width: size,
        height: size,
        color: processIconInk(resolved.variant, categoryColor),
      }}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      data-testid={testId}
    >
      {resolved.icon}
    </span>
  );
}
