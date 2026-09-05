/**
 * Copies the kit's anti-flash script into what this app serves statically.
 *
 * This is the one file a consumer cannot import: it has to run before the
 * first paint, as a plain blocking script, so it cannot be a module and
 * cannot be part of the bundle. Copying it on every build rather than once
 * by hand means it can never drift from the storage key the theme module
 * reads — which is precisely the bug a hand-copied file eventually has.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const source = require.resolve("@forgmatic/ingot/theme-init.js");

mkdirSync("public", { recursive: true });
copyFileSync(source, "public/theme-init.js");
console.log("theme-init.js copied from the package into public/");
