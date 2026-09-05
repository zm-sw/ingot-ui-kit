import { render, screen } from "@testing-library/react";

import {
  IngotDisclosure,
  IngotEyebrow,
  IngotMetrics,
  IngotSideNav,
  IngotStepCard,
} from "@/ingot";

const SM = ["font-mono", "uppercase", "text-[10.5px]", "tracking-[0.08em]"];

describe("IngotEyebrow", () => {
  it("is a paragraph by default, a span or div on request", () => {
    const { rerender } = render(<IngotEyebrow testId="e">Warehouse</IngotEyebrow>);
    expect(screen.getByTestId("e").tagName).toBe("P");
    rerender(
      <IngotEyebrow as="span" testId="e">
        Warehouse
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e").tagName).toBe("SPAN");
    rerender(
      <IngotEyebrow as="div" testId="e">
        Warehouse
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e").tagName).toBe("DIV");
  });

  it("is not a heading — the page outline stays on IngotSection", () => {
    render(<IngotEyebrow>Warehouse</IngotEyebrow>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("uppercases with CSS, not by rewriting the string", () => {
    render(<IngotEyebrow testId="e">Warehouse</IngotEyebrow>);
    expect(screen.getByTestId("e")).toHaveTextContent("Warehouse");
    expect(screen.getByTestId("e")).toHaveClass("uppercase");
  });

  it("sm and md are the only two sizes; md is the preset's text-eyebrow token", () => {
    const { rerender } = render(<IngotEyebrow testId="e">X</IngotEyebrow>);
    for (const cls of SM) expect(screen.getByTestId("e")).toHaveClass(cls);
    rerender(
      <IngotEyebrow size="md" testId="e">
        X
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e")).toHaveClass("text-eyebrow");
    expect(screen.getByTestId("e")).not.toHaveClass("text-[10.5px]");
  });

  it("tone maps to one ink token; inherit adds none", () => {
    const { rerender } = render(<IngotEyebrow testId="e">X</IngotEyebrow>);
    expect(screen.getByTestId("e")).toHaveClass("text-ink-3");
    rerender(
      <IngotEyebrow tone="muted" testId="e">
        X
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e")).toHaveClass("text-ink-4");
    rerender(
      <IngotEyebrow tone="ok" testId="e">
        X
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e")).toHaveClass("text-ok");
    rerender(
      <IngotEyebrow tone="inherit" testId="e">
        X
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e").className).not.toMatch(/text-ink|text-ok|text-accent/);
  });

  it("className is appended for layout without replacing the type", () => {
    render(
      <IngotEyebrow className="mb-2" testId="e">
        X
      </IngotEyebrow>,
    );
    expect(screen.getByTestId("e")).toHaveClass("mb-2");
    expect(screen.getByTestId("e")).toHaveClass("font-mono");
  });
});

describe("components draw their captions with IngotEyebrow", () => {
  it("side nav group label", () => {
    render(<IngotSideNav label="System" items={[{ href: "#a", label: "A" }]} />);
    const label = screen.getByText("System", { selector: "p" });
    for (const cls of SM) expect(label).toHaveClass(cls);
  });

  it("disclosure title", () => {
    render(
      <IngotDisclosure title="Documents">
        <p>Body</p>
      </IngotDisclosure>,
    );
    for (const cls of SM) expect(screen.getByText("Documents")).toHaveClass(cls);
  });

  it("metric label", () => {
    render(<IngotMetrics label="Summary" items={[{ label: "In production", value: 18 }]} />);
    for (const cls of SM) expect(screen.getByText("In production")).toHaveClass(cls);
  });

  it("step card kicker, green once the step is done", () => {
    const { rerender } = render(
      <IngotStepCard step="1" kicker="Step 1" title="Material">
        <p>Body</p>
      </IngotStepCard>,
    );
    expect(screen.getByText("Step 1")).toHaveClass("text-ink-3");
    rerender(
      <IngotStepCard step="1" kicker="Step 1" title="Material" done doneLabel="Done">
        <p>Body</p>
      </IngotStepCard>,
    );
    expect(screen.getByText("Step 1")).toHaveClass("text-ok");
  });
});
