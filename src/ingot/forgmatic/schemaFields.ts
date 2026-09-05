/**
 * Forgmatic's own form data → the kit's field specs.
 *
 * Two adapters and the schema shape they read. They are Forgmatic's, not
 * the kit's: ``x_options``, ``title_en`` and the integration manifest are
 * names this platform's API chose, and a third party building on Ingot has
 * their own. Keeping them in the core made every consumer carry a
 * translation for an API they do not call.
 *
 * The renderer stays source-neutral, which is the whole point of the split:
 * a new source of form data is a new adapter, never a new form.
 */
import type { IngotFieldKind, IngotFieldSpec } from "../fields";

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
