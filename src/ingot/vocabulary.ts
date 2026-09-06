/**
 * The two words the kit uses everywhere, defined once.
 *
 * `size` existed on five primitives with four different types, and `tone`
 * on eight with five different enumerations. The same word meant something
 * different in each: a callout's `info` and a badge's `accent` were the
 * same colour under two names, `default` and `neutral` were the same
 * absence of emphasis, and nobody could carry what they had learned from
 * one component to the next.
 *
 * That is the failure mode a design system exists to prevent, and it is
 * not fixable later: unifying it is a breaking change, and it costs
 * whatever the kit's install base costs. Thirty-six components are in
 * beta right now, which is exactly when it is cheap.
 *
 * ## Two rules, so the vocabulary does not quietly re-fragment
 *
 * **A primitive that draws fewer than all of them narrows, it does not
 * redefine.** `Extract<IngotTone, "neutral" | "danger">` says "these two
 * of the shared six"; a fresh union of the same two strings says nothing
 * and drifts on the day the shared set changes.
 *
 * **A word outside the vocabulary is written next to it, not folded in.**
 * `IngotEyebrow`'s `muted` and `inherit`, `Card`'s `dark` — those are not
 * tones anybody would ask a badge for; adding them to the shared set to
 * avoid an exception would put five meaningless options on every
 * component. They appear as `Extract<IngotTone, …> | "dark"`, and the doc
 * page says why.
 *
 * Icons keep a NUMBER, not a size word. An icon's size is a pixel value
 * matched to the type beside it — 13 next to a 12px eyebrow, 15 in a
 * search field — and three names cannot carry that without inventing a
 * scale the handoff does not have.
 */

/** How big. Not every primitive draws all three — those narrow with `Extract`. */
export type IngotSize = "sm" | "md" | "lg";

/**
 * What it means, as colour.
 *
 * `neutral` is the absence of emphasis (it used to be `default` in three
 * places and `neutral` in two). `accent` is the product's own colour, the
 * one the user picks (it used to be `info` on a callout). `ink` is the
 * strongest emphasis and the only solid one — on a tint it could not be
 * told from `neutral`.
 */
export type IngotTone = "neutral" | "accent" | "ok" | "warn" | "danger" | "ink";
