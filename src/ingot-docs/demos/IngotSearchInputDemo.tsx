import { useState } from "react";

import { Button, IngotSearchInput, IngotToolbar } from "@/ingot";

export function Demo(): JSX.Element {
  const [query, setQuery] = useState("");
  return (
    <IngotToolbar end={<Button variant="primary">Nová položka</Button>}>
      <IngotSearchInput
        value={query}
        onChange={setQuery}
        label="Hledat v položkách"
        placeholder="Hledat podle názvu nebo kódu…"
        className="w-72"
        testId="docs-search"
      />
    </IngotToolbar>
  );
}
