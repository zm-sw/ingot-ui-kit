import { useState } from "react";

import {
  Button,
  IngotFieldInput,
  IngotPageHint,
  IngotProvider,
  IngotSegmented,
  IngotToast,
  toast,
  type IngotFieldSpec,
  type IngotLang,
} from "@/ingot";

const TOKEN: IngotFieldSpec = {
  key: "api-token",
  kind: "secret",
  label: "API token",
  secretConfigured: true,
};

export function Demo(): JSX.Element {
  const [lang, setLang] = useState<IngotLang>("en");
  return (
    <IngotProvider lang={lang}>
      <div className="space-y-4">
        <IngotSegmented
          options={[
            { value: "en", label: "EN" },
            { value: "cs", label: "CS" },
          ]}
          value={lang}
          onChange={(next) => setLang(next as IngotLang)}
          label="Language"
          testId="docs-provider-lang"
        />
        <IngotPageHint
          title="Orders"
          targets={["[data-hint-target='docs-provider-save']"]}
          dismissible
          onDismiss={() => undefined}
          testId="docs-provider-hint"
        >
          Hover the bulb and the close button: their labels come from the
          provider, not from this page.
        </IngotPageHint>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            data-hint-target="docs-provider-save"
            onClick={() =>
              toast({ text: "Order saved.", undo: () => undefined })
            }
          >
            Save order
          </Button>
          <IngotFieldInput
            field={TOKEN}
            value=""
            onChange={() => undefined}
            testId="docs-provider-secret"
          />
        </div>
        <IngotToast />
      </div>
    </IngotProvider>
  );
}
