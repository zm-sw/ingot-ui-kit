import { type JSX, type ReactNode } from "react";

/**
 * Account menu — identity, organisation, preferences, sign out.
 *
 * The primitive holds **structure, not content**: layers separated by a
 * line and a row of "label left, control right". Which preferences it
 * holds the application knows, not the kit — otherwise the kit would have
 * to know theme, language and dictionary, and every new option would be a
 * change to the kit.
 *
 * **A preference is stored on the account, not in the browser.** Theme,
 * language and dictionary follow the person to another computer; a choice
 * stored only locally looks like it works until someone changes it and
 * finds it did not carry over. (The documentation has no login, so there
 * the browser is the only option — an exception, not a pattern.)
 *
 * **Turning hints off must not change the page layout.** The hint switch
 * hides ``IngotPageHint``, and if the page below it reflows, the user
 * loses the spot they were looking at. Visibility is hidden, not space.
 *
 * The kit has no i18n namespace of its own — texts arrive translated.
 */

export function IngotUserMenu({
  children,
  label,
  testId,
}: {
  /** Menu layers — typically ``IngotUserMenuSection``. */
  children: ReactNode;
  /** Translated ``aria-label`` of the menu. */
  label: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      role="group"
      aria-label={label}
      className="w-80 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
      data-testid={testId}
    >
      {children}
    </div>
  );
}

/** One menu layer. The line between layers is drawn by the `last:` rule. */
export function IngotUserMenuSection({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="border-b border-border px-4 py-3 last:border-b-0"
      data-testid={testId}
    >
      {children}
    </div>
  );
}

/**
 * A preference row: label left, control right.
 *
 * The label is a ``<label>`` only when the control gets ``htmlFor`` —
 * otherwise the menu would promise a binding it does not have. The caller
 * therefore passes ``controlId`` for controls that have an id.
 */
export function IngotUserMenuRow({
  label,
  controlId,
  children,
  testId,
}: {
  label: ReactNode;
  /** ``id`` of the control on the right, if it has one. */
  controlId?: string;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex items-center justify-between gap-3 py-1.5 text-sm text-ink-2"
      data-testid={testId}
    >
      {controlId ? <label htmlFor={controlId}>{label}</label> : <span>{label}</span>}
      {children}
    </div>
  );
}
