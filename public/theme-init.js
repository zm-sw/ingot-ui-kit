// Dark-mode anti-flash. Runs synchronously before first paint so a cold
// load doesn't flash light->dark. Lives as an external file (not inline
// in index.html) so the admin-shell CSP can stay `script-src 'self'`
// without hash maintenance. Storage key kept in sync with
// THEME_STORAGE_KEY in src/lib/theme.ts.
(function () {
  try {
    var choice = null;
    try {
      choice = localStorage.getItem("forgmatic.theme");
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
