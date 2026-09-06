/**
 * How a primitive is named on the page and how in code.
 *
 * In code it is the export name (``IngotBadge``) and that does not change
 * — it is imported under it, written in demos, and stands in the page
 * address. But the prefix that tells the kit from the rest of the
 * application in code is only noise in a list of twenty items stacked up:
 * the reader reads it twenty times and only what follows it tells them
 * apart.
 *
 * On the page the name is therefore shown without it — ``Badge``,
 * ``Table``, ``TopNav``. It is purely display: the route and every code
 * listing stay on the full name, so one can still import straight from the
 * page.
 *
 * The prefix is CUT OFF, not computed. ``Button`` and ``Card`` never had
 * it, so they pass unchanged — and should a primitive named ``Ingots…``
 * ever appear, the word boundary protects it from being cut in half.
 */

/** ``IngotBadge`` → ``Badge``; ``Button`` → ``Button``. */
export function displayName(name: string): string {
  const stripped = name.replace(/^Ingot(?=[A-Z])/, "");
  // Safety net for a hypothetical export named exactly "Ingot": an empty
  // menu label is worse than the prefix.
  return stripped || name;
}
