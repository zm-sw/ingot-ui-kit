import { useCallback, useState } from "react";

import type { IngotFieldSpec } from "./fields";

/**
 * State of the declarative Ingot form.
 *
 * The one reason this is a hook and not a plain ``useState`` in every
 * screen: **the write-only behaviour of secret fields**. That rule must
 * not differ from screen to screen — otherwise one of them sends an empty
 * string and overwrites the stored value with nothing. So the kit holds it
 * and the consumer gets a finished payload.
 */
export interface IngotFormState {
  /** ``null`` until the initial data arrives — the consumer does not render meanwhile. */
  values: Record<string, unknown> | null;
  setValue: (key: string, value: unknown) => void;
  /** Values to submit: untouched secret fields are absent. */
  payload: () => Record<string, unknown>;
}

/**
 * A secret field is **not filled** from the server (the server does not
 * return the value), so its emptiness cannot be told from "the admin
 * cleared it". The kit resolves that ambiguity the only way that cannot
 * lose a stored value: empty = untouched = not sent.
 */
export function ingotFormPayload(
  fields: readonly IngotFieldSpec[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const secretKeys = new Set(fields.filter((f) => f.kind === "secret").map((f) => f.key));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (secretKeys.has(key) && !String(value ?? "").trim()) continue;
    out[key] = value;
  }
  return out;
}

/**
 * ``fields`` describe the form, ``initial`` seeds it, ``resetKey`` says
 * WHEN to seed it again.
 *
 * The reset used to hang on the identity of ``initial``: an effect copied
 * it into state whenever the object changed. That is a data-loss bug, and
 * an easy one to hit — a parent that builds the object inline, or a refetch
 * that returns an equal but new object, threw away whatever the admin had
 * typed. Nothing warned anyone; the form simply went back to the stored
 * values mid-edit.
 *
 * So identity no longer resets anything. The form seeds itself once, when
 * the data first arrives, and re-seeds only when ``resetKey`` changes —
 * which is the caller saying "this is a different record now" (the record's
 * id, or a counter bumped after a save). A caller that used to rely on the
 * old behaviour passes the id it already has.
 *
 * Both the seeding and the reset happen during render, not in an effect:
 * an effect would render one frame with the previous record's values, and
 * that frame is exactly where a fast typist loses a keystroke.
 */
export function useIngotForm(
  fields: readonly IngotFieldSpec[],
  initial: Record<string, unknown> | undefined | null,
  resetKey?: string | number,
): IngotFormState {
  const [state, setState] = useState<{
    values: Record<string, unknown> | null;
    key: string | number | undefined;
  }>(() => ({ values: initial ? { ...initial } : null, key: resetKey }));

  // Adjusting state during render is React's own pattern for "a prop
  // changed and the state derived from it is stale". Two cases, and only
  // two: the data arrived late (nothing was typed yet, because there was
  // nothing to type into), or the caller says this is a different record.
  const needsSeed = state.values === null && Boolean(initial);
  const needsReset = state.key !== resetKey;
  if (needsSeed || needsReset) {
    setState({ values: initial ? { ...initial } : null, key: resetKey });
  }

  const setValue = useCallback((key: string, value: unknown) => {
    setState((prev) => ({
      ...prev,
      values: { ...(prev.values ?? {}), [key]: value },
    }));
  }, []);

  const values = needsSeed || needsReset ? (initial ? { ...initial } : null) : state.values;

  const payload = useCallback(
    () => ingotFormPayload(fields, values ?? {}),
    [fields, values],
  );

  return { values, setValue, payload };
}
