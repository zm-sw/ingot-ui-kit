import {
  useEffect,
  useRef,
  type JSX,
  type MouseEvent,
  type ReactNode,
} from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";
import { LockedRow, menuRowClass } from "./menuRow";

/**
 * The application's top bar — the only navigation the admin has.
 *
 * **The admin has no side menu.** One row at the top holds the brand, the
 * sections and the account; the content below runs full width. Not an
 * aesthetic choice: this product's configuration screens are wide tables,
 * and a column bitten off on the left is a column missing from the table.
 * `IngotSideNav` stays for documentation and other indexes, not for the
 * application frame.
 *
 * A section with several screens is a **button, not a link**: it unfolds a
 * mega menu (`IngotMegaMenu`) and leads nowhere itself — hence
 * `aria-expanded`, not `aria-current`. A section with a SINGLE screen is a
 * plain link (`href`): a menu with one item is a step too many. A locked
 * section (`locked`) is a muted button with a lock; its click calls an
 * explanation, not navigation.
 *
 * **A section opens on hover and on click** (owner's decision, 2026-09-02,
 * point 02 — the behaviour of the deployed admin). Click only opens, never
 * closes: the pointer crosses the button before the click lands, so the
 * panel is already open from hover and a toggle would put it out again.
 * Closing: mouse leave (with a 120 ms delay so the path from button to
 * panel does not go dark), click outside the bar, `Escape`, and the caller
 * after an item is followed.
 *
 * **From the keyboard the panel is self-contained.** `ArrowDown` /
 * `ArrowUp` on the button opens the section and jumps to the first / last
 * item; inside the panel they cycle through items. `Tab` from an open panel
 * does NOT fall out — it cycles the items, because leaving into the middle
 * of the bar with the panel hanging behind is a state the reader cannot
 * get back from. `Escape` is the way out: it closes the panel and returns
 * focus to the section button (a vanished panel would otherwise drop it to
 * the start of the page). `Enter` opens like a click.
 *
 * **The panel anchors under its section**, not under the bar's left edge:
 * `renderMenu(key)` renders into the relative wrapper of the open section.
 * With hover-open this is a necessity — a panel at the left edge would
 * force the cursor across the other sections' triggers, opening them on
 * the way.
 *
 * The caller owns the state (`openSection` + `onOpenSection` /
 * `onCloseSection`): only the caller knows whether the menu closes after a
 * follow or after a route change. The leave delay, though, is measured by
 * the bar — it is a detail of behaviour, not state.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 */

export interface IngotTopNavSection {
  /** Section key — the value for `openSection` / `onOpenSection`. */
  key: string;
  /** Section label, 1–3 words. */
  label: string;
  /**
   * A section with a single screen: a plain link, no menu. An SPA caller
   * navigates in `onNavigate` with `preventDefault`; `href` stays for the
   * middle click.
   */
  href?: string;
  /** Click on a link section (`href`). */
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * The section holds the currently open screen. On a link section it sets
   * `aria-current`; on a menu section only the highlight (the button leads
   * nowhere, so `aria-current` would lie — where the reader is, the
   * `aria-current` on the item inside the menu says).
   */
  current?: boolean;
  /**
   * Locked section (a module the tenant has not enabled): a muted button
   * with a lock; click calls `onLockedClick` instead of a menu or
   * navigation.
   */
  locked?: boolean;
  /** Click on a locked section — typically a modal with an explanation. */
  onLockedClick?: () => void;
  /** Badge after the label — pending work count on a link section. */
  badge?: ReactNode;
  /**
   * Muted LINK section — navigates normally, only softly de-emphasised (a
   * module whose storefront is a gate page).
   */
  muted?: boolean;
  /**
   * The section's own test anchor. Without it `{testId}-section-{key}` is
   * derived from the bar's anchor; existing tests and e2e often keep their
   * own names and a conversion must not rename them.
   */
  testId?: string;
}

/** Close delay after mouse leave — the path from button to panel must not go dark. */
const CLOSE_DELAY_MS = 120;

/** Geometry of a section in the bar; colours come from menuRowClass. */
const SECTION_ROW = "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm";

/**
 * Items of the open panel in the order the reader sees them.
 *
 * The panel is the last child of the section wrapper (the first is the
 * button), so it is found by position, not by class or `data-` marker:
 * `renderMenu` may return anything and the keyboard has no say in its
 * markup. A locked item is a button, not a link — hence both selectors.
 */
function menuItems(section: HTMLElement | null): HTMLElement[] {
  const panel = section?.lastElementChild;
  if (panel === undefined || panel === null || panel === section?.firstElementChild) {
    return [];
  }
  return Array.from(
    panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
  );
}

export function IngotTopNav({
  brand,
  menuButton,
  sections = [],
  openSection = null,
  onOpenSection,
  onCloseSection,
  renderMenu,
  actions,
  account,
  children,
  contentClassName,
  sectionsLabel,
  sectionsClassName,
  sectionsEnd,
  testId,
}: {
  /** Brand on the left. A mode badge (e.g. platform) belongs here. */
  brand: ReactNode;
  /** Mobile menu button — drawn at the very left, before the brand. */
  menuButton?: ReactNode;
  /** Application sections. All must fit at 1280 px — the bar does not wrap. */
  sections?: readonly IngotTopNavSection[];
  /** Key of the currently unfolded section, or `null`. Controlled from outside. */
  openSection?: string | null;
  /** Open a section — called from hover, click and keyboard. */
  onOpenSection?: (key: string) => void;
  /** Close the open section — mouse leave (after the delay), click outside, `Escape`. */
  onCloseSection?: () => void;
  /**
   * The open section's menu — typically `IngotMegaMenu`. Rendered into that
   * section's relative wrapper, so the panel stands under its button.
   */
  renderMenu?: (key: string) => ReactNode;
  /** Icon actions on the right, before the account — messages, notifications. */
  actions?: ReactNode;
  /** The account at the far right. Typically `IngotTopNavAccount`. */
  account?: ReactNode;
  /** Content under the bar positioned relative to it (banners, bar-wide overlays). */
  children?: ReactNode;
  /**
   * Class of the inner row — the shell's frame goes here (`mx-auto
   * max-w-[1440px]`, height, padding). The bar's border and surface stay
   * with the kit, the frame with the shell.
   */
  contentClassName?: string;
  /** Translated `aria-label` of the sections block — makes the bar a named navigation. */
  sectionsLabel?: string;
  /**
   * Class of the sections wrapper — typically responsive hiding on mobile
   * (`hidden lg:flex`), where the hamburger carries navigation.
   */
  sectionsClassName?: string;
  /** After the last section, inside the navigation — e.g. "Unlock all" in day-1 mode. */
  sectionsEnd?: ReactNode;
  testId?: string;
}): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      onCloseSection?.();
    }, CLOSE_DELAY_MS);
  };
  useEffect(() => cancelClose, []);

  // An arrow on a CLOSED section must first open the panel and only then
  // jump into it — but at that moment the panel is not rendered yet,
  // because the caller owns the state. The wish is parked here and picked
  // up by the effect after the re-render.
  const pendingFocus = useRef<"first" | "last" | null>(null);
  useEffect(() => {
    const want = pendingFocus.current;
    if (want === null) return;
    pendingFocus.current = null;
    if (openSection === null) return;
    const section = Array.from(
      wrapperRef.current?.querySelectorAll<HTMLElement>("[data-ingot-section]") ?? [],
    ).find((el) => el.dataset.ingotSection === openSection);
    const items = menuItems(section ?? null);
    (want === "first" ? items[0] : items[items.length - 1])?.focus();
  }, [openSection]);

  // Click outside the bar closes. The listener hangs only while a section is open.
  useEffect(() => {
    if (openSection === null) return;
    function onDown(event: globalThis.MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        onCloseSection?.();
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openSection, onCloseSection]);

  return (
    // Hover only opens what a click opens too, so nothing here is reachable
    // by mouse alone.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={wrapperRef}
      className="relative"
      data-testid={testId}
      onMouseEnter={cancelClose}
      onMouseLeave={() => {
        if (openSection !== null) scheduleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && openSection !== null) {
          cancelClose();
          onCloseSection?.();
        }
      }}
    >
      <div className="border-b border-border bg-surface">
        <div className={cx("flex items-center gap-1 px-4 py-2.5", contentClassName)}>
        {menuButton}
        <div className="mr-3 flex items-center gap-2.5 text-base font-semibold tracking-[-0.02em] text-ink">
          {brand}
        </div>
        <nav
          aria-label={sectionsLabel}
          className={cx("flex items-center gap-1", sectionsClassName)}
        >
        {sections.map((section) => {
          if (section.locked) {
            return (
              <LockedRow
                key={section.key}
                onClick={section.onLockedClick}
                className={SECTION_ROW}
                data-testid={
                  section.testId ?? (testId ? `${testId}-section-${section.key}` : undefined)
                }
              >
                {section.label}
              </LockedRow>
            );
          }
          if (section.href !== undefined) {
            return (
              <a
                key={section.key}
                href={section.href}
                onClick={section.onNavigate}
                aria-current={section.current ? "page" : undefined}
                className={cx(
                  SECTION_ROW,
                  menuRowClass({ current: section.current, muted: section.muted }),
                )}
                data-testid={
                  section.testId ?? (testId ? `${testId}-section-${section.key}` : undefined)
                }
              >
                {section.label}
                {section.badge}
              </a>
            );
          }
          const open = section.key === openSection;
          return (
            // The key handler belongs to the section wrapper because the
            // panel it drives is its sibling; what takes focus is the button
            // and the menu items inside.
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={section.key}
              className="relative"
              data-ingot-section={section.key}
              onKeyDown={(e) => {
                const wrapper = e.currentTarget;
                const button = wrapper.firstElementChild as HTMLElement | null;
                const items = menuItems(wrapper);
                const index = items.indexOf(document.activeElement as HTMLElement);

                if (e.key === "Escape") {
                  // Closing is handled by the whole bar's listener (Escape
                  // bubbles up to it from here). Only the focus return
                  // belongs here: a vanished panel drops focus to <body> and
                  // the reader would wake up at the top of the page — for a
                  // menu that also opens on hover, a step backwards.
                  if (open) button?.focus();
                  return;
                }

                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!open) {
                    pendingFocus.current = e.key === "ArrowDown" ? "first" : "last";
                    onOpenSection?.(section.key);
                    return;
                  }
                  if (items.length === 0) return;
                  const step = e.key === "ArrowDown" ? 1 : -1;
                  const from = index === -1 ? (step === 1 ? -1 : 0) : index;
                  items[(from + step + items.length) % items.length]?.focus();
                  return;
                }

                // Tab does not fall out of an open panel — otherwise the
                // reader would leave into the middle of the bar with the
                // panel hanging behind. Escape is the way out: it closes the
                // panel and returns focus to the button.
                if (e.key === "Tab" && open && items.length > 0) {
                  e.preventDefault();
                  const step = e.shiftKey ? -1 : 1;
                  const from = index === -1 ? (step === 1 ? -1 : 0) : index;
                  items[(from + step + items.length) % items.length]?.focus();
                }
              }}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => {
                  // A click TOGGLES. Hover opens too, so on a mouse the
                  // click usually arrives at an already-open section and
                  // closes it — which is what a second click on an open
                  // menu means everywhere else. On a touch screen there is
                  // no hover at all, and before this the only ways out were
                  // a tap somewhere else or a keyboard nobody has.
                  if (open) {
                    cancelClose();
                    onCloseSection?.();
                  } else {
                    onOpenSection?.(section.key);
                  }
                }}
                onMouseEnter={() => {
                  cancelClose();
                  onOpenSection?.(section.key);
                }}
                className={cx(SECTION_ROW, menuRowClass({ open, current: section.current }))}
                data-testid={
                  section.testId ?? (testId ? `${testId}-section-${section.key}` : undefined)
                }
              >
                {section.label}
                <IngotIcon name="chevron-down" size={15} />
              </button>
              {open && renderMenu?.(section.key)}
            </div>
          );
        })}
        {sectionsEnd}
        </nav>
        <div className="flex-1" />
        {actions}
        {account}
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * The account in the bar's right corner — initials and a chevron.
 *
 * Initials, not a photo: the product is used by workshops where an account
 * rarely has an avatar, and an empty circle looks like a failed load.
 */
export function IngotTopNavAccount({
  initials,
  label,
  expanded = false,
  onClick,
  testId,
}: {
  /** Two letters. Longer does not fit the circle. */
  initials: string;
  /** Translated `aria-label` — a screen reader would otherwise read only the initials. */
  label: string;
  /** Is the account menu open? */
  expanded?: boolean;
  onClick?: () => void;
  testId?: string;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface py-[5px] pl-[5px] pr-2.5"
      data-testid={testId}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-[11px] font-semibold text-bg">
        {initials}
      </span>
      <IngotIcon name="chevron-down" size={13} className="text-ink-3" />
    </button>
  );
}
