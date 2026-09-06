import { useState } from "react";

import {
  Button,
  IngotActionBar,
  IngotAvatar,
  IngotBadge,
  IngotBreadcrumbs,
  IngotColumns,
  IngotColumnsFull,
  IngotDescriptionList,
  IngotField,
  IngotPageHeader,
  IngotPageLayout,
  IngotSection,
  IngotSideNav,
} from "@forgmatic/ingot";

import type { Order } from "./orders";

/**
 * The detail screen: metadata, a two-column form, a sticky action bar,
 * and a side index that becomes a collapsed block on a phone.
 *
 * This is the screen the layout tickets were for. Before them it could not
 * be built out of the kit at all: there was no grid for the form, no bar
 * to keep Save in reach past the ninth field, and the side index was a
 * fixed 224 px column that squeezed the content to nothing on a phone.
 * Every application filled those gaps with its own utilities, which is
 * where two products built from one kit stop looking alike.
 */
export function OrderDetail({
  order,
  onBack,
}: {
  order: Order;
  onBack: () => void;
}): JSX.Element {
  const initial = { note: order.note, operator: order.operator, site: order.site };
  const [values, setValues] = useState(initial);
  const dirty = (Object.keys(initial) as (keyof typeof initial)[]).some(
    (key) => values[key] !== initial[key],
  );
  const set = (key: keyof typeof initial) => (next: string) =>
    setValues((current) => ({ ...current, [key]: next }));

  return (
    <IngotPageLayout
      width="reading"
      asideLabel="Obsah"
      aside={
        <IngotSideNav
          label="Obsah zakázky"
          items={[
            { href: "#prehled", label: "Přehled", current: true },
            { href: "#poznamka", label: "Poznámka a obsluha" },
          ]}
        />
      }
    >
      <IngotBreadcrumbs
        label="Kde jsem"
        items={[
          { label: "Výroba", href: "#" },
          { label: "Zakázky", href: "#" },
          { label: order.id },
        ]}
      />
      <IngotPageHeader
        title={`Zakázka ${order.id}`}
        description={`${order.customer} — ${order.product}`}
        actions={
          <Button variant="secondary" onClick={onBack}>
            Zpět na seznam
          </Button>
        }
      />

      <IngotSection id="prehled" title="Přehled">
        <IngotDescriptionList
          columns={2}
          items={[
            { label: "Číslo zakázky", value: order.id, mono: true },
            { label: "Odběratel", value: order.customer },
            {
              label: "Stav",
              value: <IngotBadge tone={order.tone}>{order.state}</IngotBadge>,
            },
            { label: "Termín", value: order.due, mono: true },
            { label: "Kusů", value: String(order.pieces), mono: true },
            {
              label: "Cena bez DPH",
              value: `${order.price.toLocaleString("cs-CZ")} Kč`,
              mono: true,
            },
            {
              label: "Obsluha",
              value: (
                <span className="flex items-center gap-2">
                  <IngotAvatar
                    initials={order.operatorInitials}
                    label={order.operator}
                    decorative
                  />
                  {order.operator}
                </span>
              ),
            },
            { label: "Provoz", value: order.site },
          ]}
        />
      </IngotSection>

      <IngotSection id="poznamka" title="Poznámka a obsluha">
        <IngotColumns>
          <IngotField
            label="Obsluha"
            value={values.operator}
            onChange={set("operator")}
          />
          <IngotField label="Provoz" value={values.site} onChange={set("site")} />
          <IngotColumnsFull>
            <IngotField
              label="Poznámka k zakázce"
              type="textarea"
              hint="Vidí ji mistr i plánovač; zákazníkovi se neposílá."
              counterMax={280}
              value={values.note}
              onChange={set("note")}
            />
          </IngotColumnsFull>
        </IngotColumns>
      </IngotSection>

      <IngotActionBar
        dirty={dirty}
        status={dirty ? "Neuložené změny" : "Uloženo"}
        onSave={() => setValues(initial)}
        secondary={
          <Button variant="ghost" onClick={() => setValues(initial)}>
            Zahodit změny
          </Button>
        }
        primary={
          <Button variant="accent" onClick={() => setValues(initial)}>
            Uložit
          </Button>
        }
      />
    </IngotPageLayout>
  );
}
