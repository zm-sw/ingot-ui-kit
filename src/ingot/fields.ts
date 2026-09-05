/**
 * Description of one field of the declarative form — the core of Ingot v1.
 *
 * Ingot is not built on a green field: this description generalises what
 * the operation configuration panel already rendered from its JSON
 * schema, plus one extra kind of field (``secret``) the integration
 * config asked for.
 *
 * The description is **source-neutral**. It knows neither JSON Schema nor
 * an integration manifest — both are translated into it by an adapter
 * (``fieldsFromConfigSchema``, ``fieldsFromIntegrationManifest``). That
 * keeps one renderer; only adapters are added, not form variants.
 */

export type IngotFieldKind =
  | "boolean"
  | "number"
  | "integer"
  | "text"
  /**
   * Write-only field. The server never returns the value, so there is
   * nothing to fill the form with; an empty field means "do not touch" and
   * is left out on submit (see ``ingotFormPayload``). Whether a value is
   * stored is known only from ``secretConfigured`` — and that is the only
   * thing the form may say about it.
   */
  | "secret"
  /** The value is picked from a set named by ``optionsSource``. */
  | "options";

export interface IngotFieldSpec {
  key: string;
  kind: IngotFieldKind;
  label: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  /** Only for ``kind === "options"`` — the name of the source, not of the knob. */
  optionsSource?: string;
  /** Only for ``kind === "secret"`` — is a value stored on the server? */
  secretConfigured?: boolean;
}

export const isNumericKind = (kind: IngotFieldKind): boolean =>
  kind === "number" || kind === "integer";

/** A property of the operation configuration schema as the API sends it. */
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
 * JSON-Schema ``properties`` → Ingot fields.
 *
 * ``preferEnglish`` resolves the title language the way both operation
 * configuration panels did before they merged: in English ``title_en``
 * falling back to ``title``, otherwise the other way round, and the key
 * itself as the last resort.
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
 * An integration manifest (and the identically shaped app manifest) →
 * Ingot fields.
 *
 * The manifest carries no types — it declares only two sets of keys:
 * ordinary and secret. An ordinary key is therefore text, a secret one is
 * ``secret``. Once the manifest starts carrying types, they are translated
 * here; the renderer will not change.
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
