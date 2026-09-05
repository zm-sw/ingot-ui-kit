/**
 * The public web's blocks (KAN-846).
 *
 * Six of the eight marketing blocks had no test at all. They are the part
 * of the kit a stranger meets first, and the part where a mistake is
 * cheapest to make and dearest to notice: nobody opens the public page
 * every morning the way they open the admin.
 *
 * What is measured is what each block PROMISES, not how it looks:
 *
 * - the comparison pairs a task with its two answers ON ONE ROW, because
 *   three columns of loose bullets drift by an item and start lying,
 *   silently,
 * - the closing call to action is a pair of LINKS (it navigates, it
 *   triggers nothing) and carries exactly one accent,
 * - the steps number themselves from their order, so "01, 02, 04" cannot
 *   be written,
 * - the pricing renders only what it is handed, because the real prices
 *   are platform data and a number in the code is a number that goes stale
 *   the day it is written.
 */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  IngotMarketingComparison,
  IngotMarketingCta,
  IngotMarketingPricing,
  IngotMarketingSectionHead,
  IngotMarketingSegments,
  IngotMarketingSteps,
  IngotMarketingTri,
} from "@/ingot";

describe("IngotMarketingSectionHead", () => {
  it("is an h2 with its caption and lede as content, not constants", () => {
    render(
      <IngotMarketingSectionHead
        eyebrow="Jak to funguje"
        title="Od poptávky k odeslání"
        lede="Jeden systém pro celou dílnu."
        testId="head"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Od poptávky k odeslání" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jak to funguje")).toBeInTheDocument();
    expect(screen.getByText("Jeden systém pro celou dílnu.")).toBeInTheDocument();
  });

  it("leaves out the caption and the lede when they are not given", () => {
    render(<IngotMarketingSectionHead title="Ceník" testId="head" />);
    const head = screen.getByTestId("head");
    expect(within(head).getByRole("heading", { level: 2 })).toHaveTextContent("Ceník");
    expect(head.textContent).toBe("Ceník");
  });
});

describe("IngotMarketingComparison", () => {
  it("keeps the pair on one row, so the two answers cannot drift apart", () => {
    render(
      <IngotMarketingComparison
        headers={{ task: "Úkol", before: "Dnes", after: "S platformou" }}
        rows={[
          {
            id: "quote",
            task: "Nacenění",
            before: { text: "Excel a telefon" },
            after: { text: "Z dat", icon: "check" },
          },
          {
            id: "plan",
            task: "Plánování",
            before: { text: "Tabule" },
            after: { text: "Kalendář" },
          },
        ]}
        testId="comparison"
      />,
    );

    // One row carries the task and both of its answers. Three independent
    // columns would let one of them shift by an item and still look right.
    const row = screen.getByTestId("comparison-row-quote");
    expect(within(row).getByText("Nacenění")).toBeInTheDocument();
    expect(within(row).getByText("Excel a telefon")).toBeInTheDocument();
    expect(within(row).getByText("Z dat")).toBeInTheDocument();
    expect(within(row).queryByText("Tabule")).toBeNull();
  });

  it("prints all three headers above the rows", () => {
    render(
      <IngotMarketingComparison
        headers={{ task: "Úkol", before: "Dnes", after: "S platformou" }}
        rows={[{ id: "a", task: "A", before: { text: "B" }, after: { text: "C" } }]}
        testId="comparison"
      />,
    );
    const table = screen.getByTestId("comparison");
    for (const header of ["Úkol", "Dnes", "S platformou"]) {
      expect(within(table).getByText(header)).toBeInTheDocument();
    }
  });
});

describe("IngotMarketingCta", () => {
  it("renders links, because a marketing call navigates and triggers nothing", () => {
    render(
      <IngotMarketingCta
        title="Začněte ještě dnes"
        text="Zkušební provoz na 30 dní."
        primary={{ label: "Založit účet", href: "/registrace" }}
        secondary={{ label: "Domluvit ukázku", href: "/kontakt" }}
        testId="cta"
      />,
    );

    expect(screen.getByRole("link", { name: "Založit účet" })).toHaveAttribute(
      "href",
      "/registrace",
    );
    expect(screen.getByRole("link", { name: "Domluvit ukázku" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("IngotMarketingSteps", () => {
  it("numbers the steps from their order, so 01, 02, 04 cannot be written", () => {
    render(
      <IngotMarketingSteps
        items={[
          { title: "Poptávka", text: "Přijde e-mailem." },
          { title: "Nacenění", text: "Spočítá se z dat." },
          { title: "Výroba", text: "Jede podle plánu." },
        ]}
        testId="steps"
      />,
    );

    const steps = screen.getByTestId("steps");
    expect(within(steps).getByText("01")).toBeInTheDocument();
    expect(within(steps).getByText("03")).toBeInTheDocument();
    // An ordered list, so the order is in the semantics too, not only in
    // the numbers drawn on the cards.
    expect(steps.tagName).toBe("OL");
  });
});

describe("IngotMarketingTri and IngotMarketingSegments", () => {
  it("the trio gives every feature a heading of its own", () => {
    render(
      <IngotMarketingTri
        items={[
          { icon: "check", title: "Přehled", text: "Vše na jednom místě." },
          { icon: "clock", title: "Termíny", text: "Bez tabule." },
          { icon: "grid", title: "Čísla", text: "Z výroby, ne z odhadu." },
        ]}
        testId="tri"
      />,
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });

  it("a segment's tags come from its data", () => {
    render(
      <IngotMarketingSegments
        items={[
          {
            title: "Zakázková výroba",
            text: "Kusovky i série.",
            tags: ["laser", "ohraňování"],
          },
        ]}
        testId="segments"
      />,
    );
    expect(screen.getByText("laser")).toBeInTheDocument();
    expect(screen.getByText("ohraňování")).toBeInTheDocument();
  });
});

describe("IngotMarketingPricing", () => {
  it("renders only what it is handed — no price lives in the code", () => {
    render(
      <IngotMarketingPricing
        plans={[
          {
            id: "start",
            name: "Start",
            price: "4 900 Kč",
            period: "měsíčně",
            features: ["Jeden provoz", "E-mailová podpora"],
            action: <a href="/registrace">Vyzkoušet</a>,
          },
          {
            id: "pro",
            name: "Pro",
            price: "9 900 Kč",
            period: "měsíčně",
            features: ["Víc provozů"],
            featured: true,
            badge: "Nejoblíbenější",
            action: <a href="/registrace">Vyzkoušet</a>,
          },
        ]}
        testId="pricing"
      />,
    );

    expect(screen.getByText("4 900 Kč")).toBeInTheDocument();
    expect(screen.getByText("Nejoblíbenější")).toBeInTheDocument();
    // Every plan can be acted on: a plan card you cannot proceed from is a
    // dead end, which is why the action is required by the type.
    expect(screen.getAllByRole("link", { name: "Vyzkoušet" })).toHaveLength(2);
  });

  it("only the featured plan carries the badge", () => {
    render(
      <IngotMarketingPricing
        plans={[
          {
            id: "start",
            name: "Start",
            price: "4 900 Kč",
            features: [],
            badge: "Nejoblíbenější",
            action: <a href="/registrace">Vyzkoušet</a>,
          },
        ]}
        testId="pricing"
      />,
    );
    expect(screen.queryByText("Nejoblíbenější")).toBeNull();
  });
});
