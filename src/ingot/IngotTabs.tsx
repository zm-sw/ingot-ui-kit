import { useId, useRef, type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Switching views of the SAME record — spec Tabs v1.1.
 *
 * A controlled component: the caller holds ``value`` / ``onChange``. The
 * kit is deliberately router-free, so "the value in the URL" is NOT the
 * component's internal business — the admin consumer wires ``value`` to
 * its search params itself (sample snippet on the doc page). ``onChange``
 * does not move the page's scroll position: focus moves with
 * ``preventScroll`` on arrow keys.
 *
 * Rules from the spec (held by the doc page, not the code): at most 6
 * tabs, labels of 1–2 words; process steps = the steps pattern, filters =
 * chips — tabs are not for those.
 *
 * A11y: ``role="tablist"/"tab"/"tabpanel"``, roving tabindex (Tab stops
 * only on the active tab), arrows + Home/End switch. The active tab is
 * recognisable without colour: underline + weight.
 */

export interface IngotTabItem {
  /** View key — the value for ``value`` / ``onChange`` (and the caller's URL). */
  key: string;
  /** Label, 1–2 words, supplied translated. */
  label: string;
  /** Record count in the view — rendered mono next to the label. */
  count?: number;
}

export function IngotTabs({
  items,
  value,
  onChange,
  children,
  label,
  testId,
}: {
  /** The views. At most 6 — more views is another page, not a tab. */
  items: readonly IngotTabItem[];
  /** Key of the active view. Controlled from outside — typically the caller's URL. */
  value: string;
  /** Switch of view. Must not change the page's scroll position. */
  onChange: (key: string) => void;
  /** Content of the active view — rendered as the ``tabpanel``. */
  children?: ReactNode;
  /** Translated ``aria-label`` of the tab list — the kit has no translations. */
  label?: string;
  /** `data-testid` of the tablist; a tab gets `${testId}-tab-${key}`. */
  testId?: string;
}): JSX.Element {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.key === value),
  );
  const panelId = `${baseId}-panel`;
  const tabId = (key: string) => `${baseId}-tab-${key}`;

  const moveTo = (index: number) => {
    const item = items[(index + items.length) % items.length];
    onChange(item.key);
    const next = listRef.current?.querySelector<HTMLElement>(
      `[id="${tabId(item.key)}"]`,
    );
    // preventScroll: switching views must not scroll the page elsewhere.
    next?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(items.length - 1);
        break;
    }
  };

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b border-border"
        data-testid={testId}
      >
        {items.map((item) => {
          const active = item.key === value;
          return (
            <button
              key={item.key}
              id={tabId(item.key)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={children === undefined ? undefined : panelId}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.key)}
              className={cx(
                "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm",
                active
                  ? "border-ink font-semibold text-ink"
                  : "border-transparent text-ink-3 hover:text-ink",
              )}
              data-testid={testId ? `${testId}-tab-${item.key}` : undefined}
            >
              {item.label}
              {item.count !== undefined && (
                <span className="font-mono text-xs text-ink-3">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {children !== undefined && (
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(items[activeIndex]?.key ?? "")}
          className="pt-4"
          data-testid={testId ? `${testId}-panel` : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}
