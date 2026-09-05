import { IngotMarketingComparison } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingComparison
        testId="docs-marketing-comparison"
        headers={{ task: "Úkol", before: "Dnes", after: "S platformou" }}
        rows={[
          {
            id: "quote",
            task: "Ocenit poptávku",
            before: { icon: "clock", text: "Dva až tři dny čekání" },
            after: { icon: "check", text: "Do minuty" },
          },
          {
            id: "rate",
            task: "Změna sazby stroje",
            before: { icon: "alert", text: "Ruční přepis v tabulce" },
            after: { icon: "check", text: "Jedno pole, propíše se všude" },
          },
          {
            id: "margin",
            task: "Přehled marží",
            before: { icon: "close", text: "Až po fakturaci" },
            after: { icon: "check", text: "U každé nabídky" },
          },
        ]}
      />
    </div>
  );
}
