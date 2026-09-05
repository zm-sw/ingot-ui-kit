/**
 * Description of one field of the declarative form — the core of Ingot v1.
 *
 * Ingot is not built on a green field: this description generalises what
 * the operation configuration panel already rendered from its JSON
 * schema, plus one extra kind of field (``secret``) the integration
 * config asked for.
 *
 * The description is **source-neutral**, and since KAN-853 that is
 * enforced by where the code sits rather than by a promise: the adapters
 * that translate a Forgmatic JSON schema or an integration manifest into
 * these specs live in ``forgmatic/schemaFields.ts``, outside the core. A
 * consumer who has their own shape of form data builds these specs
 * themselves and never loads ours.
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
