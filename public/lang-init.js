// Sets `lang` on <html> before the first paint, next to the anti-flash
// script.
//
// Every real page carries its language in its address and its prerendered
// file already says so. The site root is the exception: there is one file
// and the language is the reader's, so it has to be decided here — after
// the document exists and before a screen reader starts reading English
// text with Czech pronunciation, which is unintelligible.
//
// The storage key is the doc web's own, spelled here because this runs
// before any module loads. A test pins the two together.
(function () {
  try {
    var path = window.location.pathname.replace(/\/+$/, "");
    if (path !== "") return;
    var choice = null;
    try {
      choice =
        localStorage.getItem("forgmatic.ingot.docs.lang") ||
        localStorage.getItem("forgmatic.ingot-docs.lang");
    } catch {
      // No storage (private mode, blocked cookies): fall through.
    }
    if (choice !== "cs" && choice !== "en") {
      var preferred = (navigator.language || "").split("-")[0];
      choice = preferred === "en" ? "en" : "cs";
    }
    document.documentElement.lang = choice;
  } catch {
    // The page must render even if this cannot decide.
  }
})();
