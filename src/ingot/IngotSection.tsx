import { type JSX, type ReactNode } from "react";

/**
 * A screen section — a heading and what belongs under it.
 *
 * It holds two things that always drift when done by hand:
 *
 * 1. **The heading level matches the nesting.** `<h2>` inside a section,
 *    `<h3>` in a subsection. A screen reader navigates by levels; a
 *    skipped level (`h1` → `h3`) breaks the page outline for it.
 * 2. **The `id` is on the section, not on the heading.** An anchor then
 *    lands above the heading, not in the middle of the text — and the
 *    page's table of contents can point at it.
 *
 * The kit has no i18n namespace of its own — `title` comes from the caller.
 */
export function IngotSection({
  id,
  title,
  level = 2,
  children,
  testId,
}: {
  /** Anchor of the section. Without it the page's contents cannot link to it. */
  id?: string;
  title: ReactNode;
  /** Heading level. MUST match the nesting, not the font size. */
  level?: 2 | 3;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <section id={id} className="space-y-3" data-testid={testId}>
      <Heading
        className={
          level === 3
            ? "text-sm font-semibold text-ink"
            : "text-lg font-semibold text-ink"
        }
      >
        {title}
      </Heading>
      {children}
    </section>
  );
}
