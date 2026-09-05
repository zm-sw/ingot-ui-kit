import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * How deep in modals the current render is.
 *
 * The owner's decision of 2026-08-10: **a "manage" affordance that
 * navigates away never appears inside a modal** (navigating unmounts the
 * modal and discards the half-written form) and **quick-create may stack
 * at most one level**. A comment saying "the caller guarantees placement"
 * guarantees nothing: a new caller does not read it and the affordance
 * shows up in a modal where it has no business.
 *
 * The context turns the rule into code. Without a provider the depth is
 * 0, so pages outside a modal are unchanged and a component that forgets
 * the provider behaves as before — fail-open towards today's behaviour,
 * not towards a new restriction.
 *
 * A modal built on `IngotModal` does NOT need the provider — the shell has
 * it inside. Manual wrapping remains only for dialogs that still draw
 * their own overlay.
 */
const ModalDepthContext = createContext<number>(0);

/**
 * The deepest modal from which a quick-create "+ Add…" may still be
 * offered.
 *
 * ``1`` = from the page (0) and from the first modal (1) yes, from a modal
 * above a modal (2) no. The owner's decision of 2026-08-10 read "stacking
 * max 1 level", i.e. ONE extra layer above what is currently open.
 *
 * That sentence can be read more strictly too — "quick-create only from
 * the page". The looser reading is deliberate here: the strict one would
 * turn off "+ Add category…" inside the item-creation modal, a shipped and
 * deployed feature. Turning it off as a side effect of introducing a
 * constant would be a regression hidden in a refactor; if the owner meant
 * it strictly, that is its own decision and its own change.
 */
export const MAX_QUICK_CREATE_DEPTH = 1;

/** Wrapper around a modal's content — increases the depth by one. */
export function ModalDepthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const depth = useContext(ModalDepthContext);
  const next = useMemo(() => depth + 1, [depth]);
  return (
    <ModalDepthContext.Provider value={next}>
      {children}
    </ModalDepthContext.Provider>
  );
}

/** Current depth; 0 = not inside a modal. */
export function useModalDepth(): number {
  return useContext(ModalDepthContext);
}

/**
 * May a quick-create "+ Add…" be offered at this depth?
 *
 * Called from the components that render the affordance — not from those
 * that merely consume it.
 */
export function useCanQuickCreate(): boolean {
  return useModalDepth() <= MAX_QUICK_CREATE_DEPTH;
}
