import { Button } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" data-testid="docs-button">
        Uložit změny
      </Button>
      <Button variant="accent">Vytvořit vzorec</Button>
      <Button>Duplikovat</Button>
      <Button variant="ghost">Zrušit</Button>
      <Button variant="danger">Odebrat</Button>
      <Button variant="primary" loading>
        Ukládám změny
      </Button>
      <Button iconOnly aria-label="Přidat řádek">
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M8 3.5v9M3.5 8h9" />
        </svg>
      </Button>
      <Button disabled>Nedostupné</Button>
      <Button as="a" href="#/Button" variant="accent">
        Přejít na ceník
      </Button>
      <span className="inline-flex rounded-md bg-ink p-2">
        <Button as="a" href="#/Button" variant="inverse">
          Na tmavé ploše
        </Button>
      </span>
    </div>
  );
}
