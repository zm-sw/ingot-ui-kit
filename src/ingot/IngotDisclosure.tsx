import {
  createContext,
  useContext,
  useId,
  type JSX,
  type ReactNode,
} from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";
import { IngotIcon } from "./IngotIcon";

/**
 * Collapsible section of a side panel — a caption, a count and content
 * that hides.
 *
 * **Not `IngotSection`.** That one sets a heading (`h2`/`h3`) and holds the
 * page outline for a screen reader. This section is NOT a heading: it is a
 * mono uppercase caption of a block in a panel next to the content, and
 * set as a heading it would lie about the page outline in exactly the way
 * `IngotSection` forbids. Two typesettings under one prop would turn one
 * component into two hidden behind a switch.
 *
 * **`<details>` holds the state, not React.** It looks like a place for
 * `useState`, but the browser does it better:
 *
 * - a screen reader announces collapsed/expanded and Enter toggles without
 *   our help,
 * - `open` can be set from markup, so the server and a test see what the
 *   user sees,
 * - find-in-page (Ctrl+F) finds collapsed content in modern browsers and
 *   expands the section itself — our own state would hide it for good,
 * - printing does not skip collapsed content.
 *
 * The chevron rotates via CSS `group-open`. There is no JavaScript here,
 * and that is intent, not thrift.
 */

/**
 * Name of the group in which only one section is open at a time.
 *
 * Empty string = no group; `<details name="">` behaves like `<details>`
 * without a name, so that branch need not be written twice.
 */
const DisclosureGroupContext = createContext<string>("");

/**
 * A group in which at most one section is open at a time (accordion).
 *
 * Exclusivity is held by the BROWSER through `name` on `<details>`, not by
 * our state. The name is generated (`useId`), so two groups on one page
 * cannot interleave — a hand-written name is exactly the kind of collision
 * nobody looks for until two panels meet on one screen.
 *
 * A browser without `name` support ignores the group and the sections
 * behave independently. Nothing breaks — more of them may just be open.
 *
 * Sections in a group MUST be direct children: `defaultOpen` on two of
 * them is a dispute the browser settles for you (the last one stays open).
 */
export function IngotDisclosureGroup({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  const name = useId();
  return (
    <DisclosureGroupContext.Provider value={name}>
      <div data-testid={testId}>{children}</div>
    </DisclosureGroupContext.Provider>
  );
}

/**
 * The kit has no i18n namespace of its own — `title` comes from the caller.
 */
export function IngotDisclosure({
  title,
  count,
  defaultOpen = false,
  children,
  className,
  testId,
}: {
  /** Caption of the block — already translated. Not a page heading. */
  title: ReactNode;
  /**
   * How much is inside. Meaningful where it can be counted (3 files), not
   * as decoration — a collapsed section with a count says what awaits.
   */
  count?: number;
  /** Expanded right after render. Defaults to false. */
  defaultOpen?: boolean;
  children: ReactNode;
  /** Pass-through class — the panel sets width and margins, the primitive the look. */
  className?: string;
  testId?: string;
}): JSX.Element {
  const group = useContext(DisclosureGroupContext);
  return (
    <details
      // An empty `name` is the same as none to the browser.
      name={group === "" ? undefined : group}
      open={defaultOpen}
      className={cx("group border-b border-border", className)}
      data-testid={testId}
    >
      <summary
        className={cx(
          // The browser's own marker is hidden because we draw the chevron
          // ourselves — otherwise two indicators of the same thing.
          "flex cursor-pointer list-none items-center gap-2 px-3 py-2.5",
          "[&::-webkit-details-marker]:hidden",
          "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
        )}
      >
        <IngotIcon
          name="chevron-right"
          size={13}
          className="text-ink-4 transition-transform group-open:rotate-90"
        />
        <IngotEyebrow as="span">{title}</IngotEyebrow>
        {count !== undefined && (
          <span className="font-mono text-[10.5px] tabular-nums text-ink-4">
            {count}
          </span>
        )}
      </summary>
      <div className="px-3 pb-3 pl-[30px] text-sm text-ink-2">{children}</div>
    </details>
  );
}
