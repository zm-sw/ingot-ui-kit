import { type JSX } from "react";

import { cx } from "./cx";
import type { IngotSize } from "./vocabulary";

/**
 * A person, as small as a person gets: initials, or their picture.
 *
 * `IngotTopNavAccount` drew this by hand and it was the only one in the
 * kit — so the first screen that needed an avatar in a list, a comment or
 * an assignee column drew a second one, at a different size, in a
 * different colour, with the initials centred by a different trick.
 *
 * **The initials come from the caller.** A name is not reliably two words
 * with the first letter of each: "van der Berg", "Nguyen Thi Minh
 * Khai", a single-word company account. Guessing produces something
 * subtly wrong on exactly the names the kit's authors do not have, and
 * the caller already knows how it wants to abbreviate its people.
 */
/** No `lg`: a big circle is a photograph, and that is a different block. */
export type IngotAvatarSize = Extract<IngotSize, "sm" | "md">;

/** `sm` matches the account in the top bar; `md` is for a list row or a detail. */
const SIZE: Record<IngotAvatarSize, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-[13px]",
};

export function IngotAvatar({
  initials,
  label,
  src,
  size = "sm",
  decorative = false,
  className,
  testId,
}: {
  /** One to three letters, decided by the caller. */
  initials: string;
  /**
   * Whose face this is, already translated ("Jan Marek"). Required: two
   * letters read out on their own are not a person, and an avatar without
   * a name is the commonest unlabelled image on an admin screen.
   */
  label: string;
  /** A picture. The initials stay underneath as the fallback if it fails. */
  src?: string;
  size?: IngotAvatarSize;
  /**
   * Something around it already says whose face this is — a button with
   * the person's name on it, a row that spells it out beside the circle.
   * The avatar then says nothing of its own, because two names on one
   * thing are read twice.
   *
   * `label` stays required even here: it is what a reader of the code
   * needs to see that the decision was made, and it still fills the
   * tooltip.
   */
  decorative?: boolean;
  /** Layout only — margins and alignment. Not size or colour. */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    <span
      // One element with a name, not a name on a picture inside an unnamed
      // box: a screen reader then reads the person once, whether the
      // picture loaded or not.
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      title={label}
      className={cx(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-ink font-mono font-semibold text-bg",
        SIZE[size],
        className,
      )}
      data-testid={testId}
    >
      {initials}
      {src !== undefined && (
        // The picture sits ON the initials rather than instead of them, so
        // a broken or slow image leaves the letters showing instead of an
        // empty circle. `alt=""` because the wrapper already carries the
        // name — a second one would read the person twice.
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}
