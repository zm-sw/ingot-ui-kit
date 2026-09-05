import { useCallback, useEffect, useState } from "react";

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
  const secretKeys = new Set(
    fields.filter((f) => f.kind === "secret").map((f) => f.key),
  );
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (secretKeys.has(key) && !String(value ?? "").trim()) continue;
    out[key] = value;
  }
  return out;
}

export function useIngotForm(
  fields: readonly IngotFieldSpec[],
  initial: Record<string, unknown> | undefined | null,
): IngotFormState {
  const [values, setValues] = useState<Record<string, unknown> | null>(null);

  // Re-seeded on every fresh load from the server (after a save too).
  // Secret fields return to empty in the process — the server does not
  // send them and the form must not remember them, otherwise a second save
  // would send what the admin typed into the previous one.
  useEffect(() => {
    if (initial) setValues({ ...initial });
  }, [initial]);

  const setValue = useCallback((key: string, value: unknown) => {
    setValues((prev) => ({ ...(prev ?? {}), [key]: value }));
  }, []);

  const payload = useCallback(
    () => ingotFormPayload(fields, values ?? {}),
    [fields, values],
  );

  return { values, setValue, payload };
}
