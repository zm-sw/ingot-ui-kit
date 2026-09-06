import { useEffect, useState, type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotDisclosure } from "./IngotDisclosure";

/**
 * The rhythm of one page's content — the gap between blocks, the reading
 * width and an optional side index.
 *
 * The frame around it (width, page margins) is `IngotAppFrame`; this
 * primitive holds what every screen used to compose itself: the
 * **vertical rhythm of blocks** (header → metrics → toolbar → table) and
 * the **shape of the content**. (Owner's decision, 2026-09-02, point 05.)
 *
 * Three shapes, by what the screen is:
 *
 * * ``full`` — the frame's full width. Lists and tables; a column bitten
 *   off a table is a column missing from it.
 * * ``reading`` — a limited width for screens that are read: long
 *   settings, legal texts, a detail without tables. A line across the
 *   whole monitor is not read but skimmed.
 * * ``aside`` with a column on the left — a screen with its own index
 *   (``IngotSideNav``): the index stands, the content scrolls.
 *
 * A card grid and a two-column detail deliberately have no shape here:
 * that is the inside of a block (``IngotColumns``), not the page frame.
 *
 * ## The index is a different thing on a phone, not the same thing narrower
 *
 * The side column used to be ``w-56 shrink-0 sticky`` with no breakpoint
 * at all. At 375 px that left 224 px of index standing beside the content,
 * the content squeezed to about a hundred, and the text breaking one word
 * per line — the primitive's own doc page overflowed sideways.
 *
 * A standing index is a wide-screen instrument: it is worth its width only
 * where there is width to spare. Below ``md`` it becomes a collapsed
 * "Contents" block ABOVE the content, and the content takes the whole
 * width. Not tabs — an index is a list of links of unknown length, and
 * tabs are for a fixed handful of peers; ten sections in a tab bar scroll
 * sideways, which is the problem again in a different shape. A
 * ``details`` block collapses to one row and opens to the whole list.
 *
 * The switch is measured rather than duplicated. Rendering the index twice
 * and hiding one with a breakpoint would put every link in the document
 * twice — a screen reader reads both, and any ``id`` inside them collides.
 */

/** The `aside` and its caption arrive together or not at all. */
type AsideProps =
  | {
      /**
       * Side index on the left — typically ``IngotSideNav``. The column is
       * ``sticky``, so it stays at hand while the content scrolls.
       */
      aside: ReactNode;
      /**
       * What the collapsed index is called on a narrow screen ("Contents"),
       * already translated. Required with ``aside``: below ``md`` the index
       * is a block the reader opens, and an unnamed block is one nobody
       * opens.
       */
      asideLabel: string;
    }
  | { aside?: never; asideLabel?: never };

export type IngotPageLayoutProps = {
  /** ``full`` for tables and lists · ``reading`` for screens that are read. */
  width?: "full" | "reading";
  children: ReactNode;
  testId?: string;
} & AsideProps;

/**
 * Is the viewport at least ``md`` (768 px)?
 *
 * ``matchMedia`` may be missing (jsdom, a very old browser) and Safari
 * before 14 knows only ``addListener``. Both are handled, because the kit
 * is a model: where the modern API cannot be relied on it must still
 * render something correct rather than nothing. Without it the layout
 * simply stays in its narrow shape, which is the one that fits everywhere.
 */
function useWide(): boolean {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => setWide(query.matches);
    apply();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", apply);
      return () => query.removeEventListener("change", apply);
    }
    query.addListener(apply);
    return () => query.removeListener(apply);
  }, []);

  return wide;
}

export function IngotPageLayout({
  width = "full",
  aside,
  asideLabel,
  children,
  testId,
}: IngotPageLayoutProps): JSX.Element {
  const wide = useWide();

  const body = (
    // `min-w-0` is not decoration: a flex child defaults to the width of
    // its content, so without it a wide table pushes the column past the
    // row instead of scrolling inside it.
    <div className={cx("min-w-0 flex-1 space-y-6", width === "reading" && "max-w-3xl")}>
      {children}
    </div>
  );

  if (aside === undefined) {
    return (
      <div className="w-full" data-testid={testId}>
        {body}
      </div>
    );
  }

  if (!wide) {
    return (
      <div className="w-full space-y-6" data-testid={testId}>
        {/* Above the content, in reading order: an index that came after
            what it indexes would be a table of contents at the back of the
            book. Closed by default — it is a shortcut past the content, and
            a reader who scrolled here wants the content. */}
        <IngotDisclosure title={asideLabel}>{aside}</IngotDisclosure>
        {body}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-8" data-testid={testId}>
      {/* The width is `--aside`, a token, for the same reason the frame's
          is: a number written into each screen is a number that stops
          agreeing with the next screen. */}
      <div className="sticky top-6 w-aside shrink-0">{aside}</div>
      {body}
    </div>
  );
}
