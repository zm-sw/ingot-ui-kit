import { IngotCode, IngotEyebrow, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import releases from "@/ingot-docs/releases.json";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * What shipped when (KAN-857).
 *
 * The versions were true in three places — the tags, the changelog and the
 * doc pages — and none of them was reachable from the site. A reader
 * looking at a component and wondering whether it exists in the version
 * they pinned had to leave and go dig in the repository.
 *
 * The data is written at build time by a script; nothing here is
 * hand-maintained, because a hand-maintained list of releases is a list
 * that is one release behind.
 *
 * The doc web is a PUBLIC page: no issue keys, no repository paths, no
 * guard names in rendered text.
 */

interface Release {
  tag: string;
  date: string;
  notes: string | null;
}

const RELEASES: readonly Release[] = releases.releases;

/**
 * The release notes are written by the release script as one paragraph per
 * kind of change. They are shown as a list because that is what they are —
 * running them together makes a wall of sentences nobody scans.
 */
function noteLines(notes: string | null): string[] {
  if (!notes) return [];
  return notes
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function Intro({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Každé vydání má tag a podle tagu se kit připojuje. Číslo verze se hne jenom s vydáním, takže commit mezi dvěma vydáními nese číslo toho předchozího — pin proto míří na tag, nikdy na commit."
          : "Every release has a tag, and a tag is how the kit is pinned. The version number moves only at a release, so a commit between two releases carries the previous one's number — which is why a pin names a tag and never a commit."}
      </p>
      <IngotCode block lang="tsx">
        {`"@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#${RELEASES[0]?.tag ?? "v1.0.0"}"`}
      </IngotCode>
      <p>
        {cs
          ? "Seznam se sestavuje při buildu z tagů. Ručně udržovaný přehled vydání je přehled, který je o jedno vydání pozadu."
          : "The list is assembled at build time from the tags. A hand-kept list of releases is a list that is one release behind."}
      </p>
    </div>
  );
}

function Timeline({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  if (RELEASES.length === 0) {
    return (
      <p className="text-sm text-ink-3">
        {cs ? "Zatím žádné vydání." : "No releases yet."}
      </p>
    );
  }
  return (
    <div className="space-y-5">
      {RELEASES.map((release) => {
        const lines = noteLines(release.notes);
        return (
          <div key={release.tag} className="space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <IngotCode>{release.tag}</IngotCode>
              <IngotEyebrow as="span" tone="muted">
                {release.date}
              </IngotEyebrow>
            </div>
            {lines.length > 0 ? (
              <IngotList items={lines} />
            ) : (
              <p className="text-sm text-ink-3">
                {cs
                  ? "K tomuhle tagu nejsou poznámky."
                  : "This tag has no notes attached."}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Since({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Každá stránka komponenty nese odznak „od verze“. Nepíše ho nikdo ručně: při buildu se u každého tagu zjistí, které stránky v něm byly, a první tag, který stránku má, je verze, ve které komponenta vyšla."
          : "Every component page carries a “since” badge. Nobody writes it: at build time each tag is asked which pages it contained, and the first tag that carries a page is the version the primitive shipped in."}
      </p>
      <p>
        {cs
          ? "Odznak proto odpovídá na otázku, se kterou čtenář přichází — jestli komponenta existuje ve verzi, na kterou je připnutý — místo aby ho poslal hledat do repozitáře."
          : "The badge therefore answers the question the reader actually arrives with — does this exist in the version I pinned — instead of sending them to the repository to find out."}
      </p>
    </div>
  );
}

export const ChangesGuide: IngotGuidePage = {
  slug: "zmeny",
  group: "rules",
  title: { cs: "Změny", en: "Changes" },
  summary: {
    cs: "Co v které verzi vyšlo — sestavené z tagů, ne psané rukou.",
    en: "What shipped in which version — assembled from the tags, not written by hand.",
  },
  sections: [
    {
      id: "pin",
      title: { cs: "Verze a pin", en: "Versions and the pin" },
      body: { cs: <Intro lang="cs" />, en: <Intro lang="en" /> },
    },
    {
      id: "vydani",
      title: { cs: "Vydání", en: "Releases" },
      body: { cs: <Timeline lang="cs" />, en: <Timeline lang="en" /> },
    },
    {
      id: "od-verze",
      title: { cs: "Odznak „od verze“", en: "The “since” badge" },
      body: { cs: <Since lang="cs" />, en: <Since lang="en" /> },
    },
  ],
};
