import { useSyncExternalStore } from "react";

/**
 * A tiny module-level store: one value, a set of listeners, a hook.
 *
 * Internal, not exported from the barrel. The toast queue and the doc
 * web's dictionary mode both used to hand-roll the same listeners `Set`,
 * `subscribe` and `useSyncExternalStore` wiring; this is the one copy.
 *
 * A module store rather than React context on purpose: the value must be
 * reachable from code outside the tree (`toast()` is called from a mutation
 * handler, not from a component) and from two components that share no
 * provider.
 */
export interface Store<T> {
  get(): T;
  /** Replace the value, or derive it from the previous one. Notifies listeners. */
  set(next: T | ((prev: T) => T)): void;
  subscribe(listener: () => void): () => void;
  /** Read the value in a component; re-renders on every `set`. */
  use(): T;
}

/**
 * @param initial - the first value, or a function that produces it lazily
 *   on first read (for a value that comes from `localStorage` and must not
 *   be read at module load).
 */
export function createStore<T>(initial: T | (() => T)): Store<T> {
  let value: T;
  let initialised = false;
  const listeners = new Set<() => void>();

  const get = (): T => {
    if (!initialised) {
      value = typeof initial === "function" ? (initial as () => T)() : initial;
      initialised = true;
    }
    return value;
  };

  const set = (next: T | ((prev: T) => T)): void => {
    const prev = get();
    value = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
    for (const listener of listeners) listener();
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    get,
    set,
    subscribe,
    use: () => useSyncExternalStore(subscribe, get, get),
  };
}
