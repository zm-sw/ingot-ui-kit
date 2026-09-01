import { useState } from "react";

import { IngotPagination } from "@/ingot";

export function Demo(): JSX.Element {
  const [page, setPage] = useState(1);
  const pageCount = 8;

  return (
    <IngotPagination
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      prevLabel="Předchozí"
      nextLabel="Další"
      status={`Strana ${page} z ${pageCount}`}
      label="Stránkování"
      testId="docs-pagination"
    />
  );
}
