import { useCallback, useEffect, useState } from "react";

import type { IngotFieldSpec } from "./fields";

/**
 * Stav deklarativního formuláře Ingotu (KAN-382).
 *
 * Jediná věc, kvůli které to je hook a ne prostý ``useState`` v každé
 * obrazovce: **write-only chování tajných polí**. To pravidlo se nesmí
 * lišit obrazovku od obrazovky — jinak jedna z nich pošle prázdný řetězec
 * a přepíše uloženou hodnotu na nic. Proto ho drží Ingot a konzument dostane
 * hotový payload.
 */
export interface IngotFormState {
  /** ``null``, dokud nedorazila počáteční data — konzument tou dobou nekreslí. */
  values: Record<string, unknown> | null;
  setValue: (key: string, value: unknown) => void;
  /** Hodnoty k odeslání: tajná pole, kterých se nikdo nedotkl, chybí. */
  payload: () => Record<string, unknown>;
}

/**
 * Tajné pole se **neplní** ze serveru (server hodnotu nevrací), takže se
 * jeho prázdnost nedá odlišit od „admin ji vymazal". Ingot tuhle nejednoznačnost
 * řeší jediným způsobem, který nemůže ztratit uloženou hodnotu: prázdné =
 * netknuté = neposílá se.
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

  // Přeseje se při každém novém načtení ze serveru (i po uložení). Tajná
  // pole se přitom vracejí do prázdna — server je neposílá a formulář si
  // je nesmí pamatovat, jinak by druhé uložení odeslalo, co admin napsal
  // do minulého.
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
