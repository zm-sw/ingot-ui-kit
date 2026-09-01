/**
 * Popis jednoho pole deklarativního formuláře — jádro Ingotu v1 (KAN-382).
 *
 * Ingot se nestaví na zelené louce: tenhle popis je zobecněním toho, co už
 * renderoval ``OperationConfigPanel`` z ``operation_config_schema``, plus
 * jeden druh pole navíc (``secret``), který si vyžádal config integrací.
 *
 * Popis je **zdrojově neutrální**. Nezná ani JSON Schema, ani manifest
 * integrace — obojí se do něj překládá adaptérem (``fieldsFromConfigSchema``,
 * ``fieldsFromIntegrationManifest``). Díky tomu je renderer jeden a přibývají
 * jen adaptéry, ne varianty formuláře.
 */

export type IngotFieldKind =
  | "boolean"
  | "number"
  | "integer"
  | "text"
  /**
   * Write-only pole. Server hodnotu nikdy nevrací, takže se do formuláře
   * nemá čím naplnit; prázdné pole znamená „nesahat" a při odeslání se
   * vynechá (viz ``ingotFormPayload``). Zda je hodnota uložená, se pozná
   * jedině z ``secretConfigured`` — a jediné, co o ní formulář smí říct,
   * je právě to.
   */
  | "secret"
  /** Hodnota se vybírá z množiny, kterou pojmenovává ``optionsSource``. */
  | "options";

export interface IngotFieldSpec {
  key: string;
  kind: IngotFieldKind;
  label: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  /** Jen pro ``kind === "options"`` — jméno zdroje, ne jméno knobu. */
  optionsSource?: string;
  /** Jen pro ``kind === "secret"`` — je hodnota na serveru uložená? */
  secretConfigured?: boolean;
}

export const isNumericKind = (kind: IngotFieldKind): boolean =>
  kind === "number" || kind === "integer";

/** Vlastnost ``operation_config_schema`` tak, jak ji posílá API. */
export interface IngotSchemaProperty {
  type?: "boolean" | "number" | "integer" | "string";
  title?: string;
  title_en?: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  x_options?: string;
  secret?: boolean;
}

/**
 * JSON-Schema ``properties`` → pole Ingotu.
 *
 * ``preferEnglish`` řeší jazyk titulku stejně, jak to dělaly oba panely
 * konfigurace operací před sloučením: anglicky ``title_en`` s propadem na
 * ``title``, jinak obráceně, a jako poslední záchrana klíč sám.
 */
export function fieldsFromConfigSchema(
  properties: Record<string, IngotSchemaProperty>,
  options: { preferEnglish: boolean; configuredSecretKeys?: readonly string[] },
): IngotFieldSpec[] {
  const { preferEnglish, configuredSecretKeys = [] } = options;
  return Object.keys(properties).map((key) => {
    const prop = properties[key];
    const label = preferEnglish
      ? (prop.title_en ?? prop.title ?? key)
      : (prop.title ?? prop.title_en ?? key);
    let kind: IngotFieldKind = "text";
    if (prop.secret) kind = "secret";
    else if (prop.x_options) kind = "options";
    else if (prop.type === "boolean") kind = "boolean";
    else if (prop.type === "number" || prop.type === "integer") kind = prop.type;
    return {
      key,
      kind,
      label,
      description: prop.description,
      minimum: prop.minimum,
      maximum: prop.maximum,
      optionsSource: prop.x_options,
      secretConfigured: configuredSecretKeys.includes(key),
    };
  });
}

/**
 * Manifest integrace (a stejně tvarovaný manifest aplikace) → pole Ingotu.
 *
 * Manifest nenese typy — deklaruje jen dvě množiny klíčů: běžné a tajné.
 * Běžný klíč je proto text, tajný je ``secret``. Až manifest začne typy
 * nést, přeloží se tady; renderer se měnit nebude.
 */
export function fieldsFromIntegrationManifest(manifest: {
  required_config_keys: readonly string[];
  secret_config_keys: readonly string[];
  configured_secret_keys: readonly string[];
}): IngotFieldSpec[] {
  return [
    ...manifest.required_config_keys.map(
      (key): IngotFieldSpec => ({ key, kind: "text", label: key }),
    ),
    ...manifest.secret_config_keys.map(
      (key): IngotFieldSpec => ({
        key,
        kind: "secret",
        label: key,
        secretConfigured: manifest.configured_secret_keys.includes(key),
      }),
    ),
  ];
}
