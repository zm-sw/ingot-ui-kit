// Dark-mode anti-flash, shipped as `@forgmatic/ingot/theme-init.js`.
//
// It runs synchronously before first paint so a cold load doesn't flash
// light->dark. A consumer copies it into whatever their framework serves
// statically and references it from <head> BEFORE any stylesheet-blocking
// work; it must not be a module, because a module script is deferred and
// deferred is exactly the flash this file exists to prevent.
//
// It is a plain file rather than an inline snippet so a consumer's CSP can
// stay `script-src 'self'` without maintaining a hash.
//
// The keys are spelled here by hand because this code runs before any
// module loads and therefore cannot import them. They are THEME_STORAGE_KEY
// and LEGACY_THEME_STORAGE_KEY from theme.ts, and a test pins the two
// spellings together.
(function () {
  try {
    var choice = null;
    try {
      choice =
        localStorage.getItem("forgmatic.ingot.theme") ||
        localStorage.getItem("forgmatic.theme");
    } catch {
      // No storage (private mode, blocked cookies): fall through to system.
    }
    if (choice !== "light" && choice !== "dark" && choice !== "system")
      choice = "system";
    var dark =
      choice === "dark" ||
      (choice === "system" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch {
    // Anything unexpected here must not stop the page from rendering.
  }
})();
