/**
 * FAQ blok veřejných stránek (KAN-664).
 *
 * Prototyp měl a11y díru (button bez ``aria-expanded``/``aria-controls``);
 * testy drží přesně to, co ticket chce dodělat: ohlášený stav rozbalení,
 * provázání otázky s panelem a ovládání klávesnicí.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngotMarketingFaq, IngotMarketingPricing } from "@/ingot";

const ITEMS = [
  { id: "a", question: "Otázka A?", answer: "Odpověď A." },
  { id: "b", question: "Otázka B?", answer: "Odpověď B." },
] as const;

describe("IngotMarketingFaq", () => {
  it("otázka je button s aria-expanded a aria-controls", async () => {
    render(<IngotMarketingFaq items={ITEMS} />);
    const question = screen.getByRole("button", { name: "Otázka A?" });
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(question).toHaveAttribute("aria-controls");

    await userEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");

    // Panel je provázaný přes id z aria-controls a pojmenovaný otázkou.
    const panelId = question.getAttribute("aria-controls")!;
    const panel = screen.getByRole("region", { name: "Otázka A?" });
    expect(panel).toHaveAttribute("id", panelId);
    expect(panel).toHaveTextContent("Odpověď A.");
  });

  it("rozbalí se druhá položka, první se zavře", async () => {
    render(<IngotMarketingFaq items={ITEMS} />);
    await userEvent.click(screen.getByRole("button", { name: "Otázka A?" }));
    await userEvent.click(screen.getByRole("button", { name: "Otázka B?" }));

    expect(
      screen.getByRole("button", { name: "Otázka A?" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Odpověď A.")).not.toBeInTheDocument();
    expect(screen.getByText("Odpověď B.")).toBeInTheDocument();
  });

  it("ovládá se klávesnicí (Tab + Enter)", async () => {
    render(<IngotMarketingFaq items={ITEMS} />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Otázka A?" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Odpověď A.")).toBeInTheDocument();
  });
});

describe("IngotMarketingPricing", () => {
  it("kreslí výhradně data z props — název, cenu, odznak i vlastnosti", () => {
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
