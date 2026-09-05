import { Card, CardHeader, CardTitle } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card elevation="raised" data-testid="docs-card">
        <CardHeader>
          <div className="font-mono text-eyebrow uppercase text-ink-3">
            Cenový vzorec
          </div>
          <CardTitle>Výchozí sazba stroje</CardTitle>
        </CardHeader>
        <p className="text-sm text-ink-2">
          Základ = dráha nástroje × sazba stroje + prostoje. Přirážka 12 %.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-border pt-3 font-mono text-xs text-ink-3">
          <span>v4</span>
          <span>·</span>
          <span>upraveno 12. 8.</span>
          <span>·</span>
          <span>34 tenantů</span>
        </div>
      </Card>

      <Card padded={false} className="p-4">
        <div className="font-mono text-eyebrow uppercase text-ink-3">
          Nabídky tento měsíc
        </div>
        <div className="mt-1 font-mono text-[22px] font-semibold tracking-tight">
          1 284
        </div>
        <p className="mt-1 text-sm text-ink-2">meziměsíčně +4,1 %</p>
      </Card>

      <a href="#/Card" className="block rounded-md">
        <Card hover>
          <CardTitle>Šarže materiálu</CardTitle>
          <p className="mt-1 text-sm text-ink-2">
            Otevře přehled šarží a jejich zbytkových kusů.
          </p>
        </Card>
      </a>

      <Card tone="dark">
        <CardTitle>Nový modul: Kontrola kvality</CardTitle>
        <p className="mt-1 text-sm">
          Zapíná se v Nastavení → Moduly. Takhle obrácená karta patří na obrazovku
          nejvýš jedna.
        </p>
      </Card>
    </div>
  );
}
