import { useState } from "react";

import { IngotPagination } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: { prev: "Předchozí", next: "Další", label: "Stránkování", of: "z" },
  en: { prev: "Previous", next: "Next", label: "Pagination", of: "of" },
};

const PAGE_WORD: Localized<string> = { cs: "Strana", en: "Page" };

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [page, setPage] = useState(1);
  const pageCount = 8;

  return (
    <IngotPagination
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      prevLabel={t.prev}
      nextLabel={t.next}
      status={`${PAGE_WORD[lang]} ${page} ${t.of} ${pageCount}`}
      label={t.label}
      testId="docs-pagination"
    />
  );
}
