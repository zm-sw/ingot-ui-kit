/**
 * FAQ block of the public pages (KAN-664).
 *
 * The prototype had an accessibility hole (a button without
 * ``aria-expanded``/``aria-controls``); the tests hold exactly what the
 * ticket wants finished: the announced expanded state, the binding of the
 * question to the panel, and keyboard operation.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngotMarketingFaq, IngotMarketingPricing } from "@/ingot";

const ITEMS = [
  { id: "a", question: "Otázka A?", answer: "Odpověď A." },
  { id: "b", question: "Otázka B?", answer: "Odpověď B." },
] as const;

describe("IngotMarketingFaq", () => {
  it("the question is a button with aria-expanded and aria-controls", async () => {
    render(<IngotMarketingFaq items={ITEMS} />);
    const question = screen.getByRole("button", { name: "Otázka A?" });
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(question).toHaveAttribute("aria-controls");

    await userEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");

    // The panel is bound via the id from aria-controls and named by the question.
    const panelId = question.getAttribute("aria-controls")!;
    const panel = screen.getByRole("region", { name: "Otázka A?" });
    expect(panel).toHaveAttribute("id", panelId);
    expect(panel).toHaveTextContent("Odpověď A.");
  });

  it("the second item unfolds, the first closes", async () => {
    render(<IngotMarketingFaq items={ITEMS} />);
    await userEvent.click(screen.getByRole("button", { name: "Otázka A?" }));
    await userEvent.click(screen.getByRole("button", { name: "Otázka B?" }));

    expect(screen.getByRole("button", { name: "Otázka A?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText("Odpověď A.")).not.toBeInTheDocument();
    expect(screen.getByText("Odpověď B.")).toBeInTheDocument();
  });

  it("is operated by keyboard (Tab + Enter)", async () => {
    render(<IngotMarketingFaq items={ITEMS} />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Otázka A?" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Odpověď A.")).toBeInTheDocument();
  });
});

describe("IngotMarketingPricing", () => {
  it("draws exclusively data from props — name, price, badge and features", () => {
    render(
      <IngotMarketingPricing
        testId="pricing"
        plans={[
          {
            id: "team",
            name: "Team",
            price: "1 234 Kč",
            period: "měsíčně",
            features: ["Pět uživatelů"],
            featured: true,
            badge: "Nejoblíbenější",
            action: <a href="#team">Vyzkoušet</a>,
          },
        ]}
      />,
    );
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vyzkoušet" })).toBeInTheDocument();
    expect(screen.getByText("1 234 Kč")).toBeInTheDocument();
    expect(screen.getByText("měsíčně")).toBeInTheDocument();
    expect(screen.getByText("Nejoblíbenější")).toBeInTheDocument();
    expect(screen.getByText("Pět uživatelů")).toBeInTheDocument();
  });
});
