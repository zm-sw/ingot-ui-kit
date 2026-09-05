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
 *
 * The depth is the kit's; what a product does with it is not. The rule
 * about how deep a quick-create may still be offered is Forgmatic's, and
 * since KAN-853 it lives in ``forgmatic/quickCreate.ts`` with the rest of
 * the domain layer.
 */
const ModalDepthContext = createContext<number>(0);

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
