// Dark-mode anti-flash. Runs synchronously before first paint so a cold
// load doesn't flash light->dark. Lives as an external file (not inline
// in index.html) so the CSP can stay `script-src 'self'` without hash
// maintenance. The storage key is STORAGE_KEYS.theme in src/lib/storage.ts;
// the legacy key is read so returning visitors keep their choice. A test
// pins both strings to that module.
(function () {
  try {
    var choice = null;
    try {
      choice =
        localStorage.getItem("forgmatic.ingot.theme") ||
        localStorage.getItem("forgmatic.theme");
    } catch (e) {}
    if (choice !== "light" && choice !== "dark" && choice !== "system")
      choice = "system";
    var dark =
      choice === "dark" ||
      (choice === "system" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
