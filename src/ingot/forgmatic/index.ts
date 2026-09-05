/**
 * Forgmatic's own layer: ``@forgmatic/ingot/forgmatic``.
 *
 * Everything here knows something about THIS platform that no design
 * system should have to know — the icon keys the backend stores, the shape
 * of an operation configuration schema, how deep a quick-create may be
 * offered. It was in the core, which meant every consumer installed a
 * translation for an API they do not call and shipped forty-three glyphs
 * they will never draw.
 *
 * The line between the two entries is a question, not a taste: *would this
 * still make sense in a product that is not Forgmatic?* A field spec would.
 * ``x_options`` would not.
 *
 * The core barrel still re-exports all of it, marked ``@deprecated``, so
 * nothing breaks the day this lands. Those re-exports go away in the next
 * major, and the import path is the only thing a caller has to change.
 */
export {
  IngotOpIcon,
  INGOT_OP_ICON_KEYS,
  type IngotOpIconVariant,
} from "./IngotOpIcon";
export {
  PROCESS_ICON_CATEGORIES,
  PROCESS_ICON_VARIANT_INKS,
  ProcessIconGlyph,
  parseProcessIconKey,
  processIconInk,
  processIconToken,
  resolveProcessIcon,
  type ProcessIconCategory,
  type ProcessIconItem,
  type ProcessIconVariant,
  type ResolvedProcessIcon,
} from "./processIconLibrary";
export {
  fieldsFromConfigSchema,
  fieldsFromIntegrationManifest,
  type IngotSchemaProperty,
} from "./schemaFields";
export { MAX_QUICK_CREATE_DEPTH, useCanQuickCreate } from "./quickCreate";
