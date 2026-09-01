/**
 * Concatenate conditional class names. Subset of `clsx` — kept inline so
 * we don't pull in a dep for three lines.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
