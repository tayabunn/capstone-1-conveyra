import { Metadata } from "next";
import { AccessibilityPlayground } from "@/playground/accessibility/AccessibilityPlayground";

export const metadata: Metadata = {
  title: "Accessibility Foundations Playground | Conveyra",
  description:
    "Interactive development playground for custom accessible components: Modal Dialog, Tabs, and Disclosures.",
};

export default function AccessibilityPlaygroundPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <AccessibilityPlayground />
    </main>
  );
}
