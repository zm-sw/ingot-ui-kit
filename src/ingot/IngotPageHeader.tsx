import { type JSX, type ReactNode } from "react";

/**
 * Page header — title, one sentence under it, actions on the right.
 *
 * Deliberately **router-free**. The typographic spec once lived in a
 * header component that pulled in a router through its breadcrumbs, so
 * anyone who wanted two classes paid for a whole dependency (measured:
 * ~7.7 kB extra in the doc web build). Breadcrumbs are `IngotBreadcrumbs`
 * and sit above this header in the caller's layout; the header itself
 * knows nothing about routes.
 *
 * The kit has no i18n namespace of its own — `title` and `description`
 * arrive translated.
 */

/** The shared typographic spec, in one place a guard can point at. */
export const INGOT_PAGE_TITLE_CLASS =
  "text-2xl font-semibold tracking-tight text-ink";
export const INGOT_PAGE_DESC_CLASS = "mt-1 max-w-3xl text-sm text-ink-3";

export function IngotPageHeader({
  title,
  description,
  actions,
  titleAdornment,
  testId,
}: {
  /** Nadpis obrazovky. Detailní routy sem dávají jméno záznamu. */
  title: ReactNode;
  /** Jedna věta: co tu čtenář najde. */
  description?: ReactNode;
  /** Shluk akcí zarovnaný doprava (tlačítka, filtry, stavové odznaky). */
  actions?: ReactNode;
  /** Odznak vedle nadpisu — stav, počet, štítek. */
  titleAdornment?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex flex-wrap items-end justify-between gap-3"
      data-testid={testId}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className={INGOT_PAGE_TITLE_CLASS}>{title}</h1>
          {titleAdornment}
        </div>
        {description ? (
          <p className={INGOT_PAGE_DESC_CLASS}>{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
