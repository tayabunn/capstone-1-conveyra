import { Header } from "@/components/layout/header";
import { Hero } from "@/components/hero";
import { GeneratorApp } from "@/components/generator/generator-app";
import { TransformationSection } from "@/components/sections/transformation-section";
import { HowItWorks } from "@/components/how-it-works";
import { UseCaseBento } from "@/components/sections/use-case-bento";
import { ResultShowcase } from "@/components/sections/result-showcase";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid-subtle text-foreground selection:bg-brand selection:text-brand-foreground overflow-x-hidden relative">
      {/* Soft atmospheric illumination (light blue + lavender in light, deep navy + violet in dark) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),rgba(139,92,246,0.06)_40%,transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),rgba(139,92,246,0.12)_40%,transparent_75%)] -z-10" 
      />
      {/* 1. Navigation Header */}
      <Header />

      <main className="flex-1 flex flex-col items-center w-full">
        {/* 2. Editorial Hero */}
        <Hero />

        {/* 3. The Communication Workspace (Core Product Centerpiece) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl w-full relative z-10 pb-16 sm:pb-24">
          <GeneratorApp />
        </section>

        {/* 4. Thought -> Message Transformation */}
        <div className="w-full">
          <TransformationSection />
        </div>

        {/* 5. How It Works (Methodology) */}
        <div className="w-full">
          <HowItWorks />
        </div>

        {/* 6. Use-Case Bento Grid */}
        <div className="w-full">
          <UseCaseBento />
        </div>

        {/* 7. Result Architecture Showcase */}
        <div className="w-full">
          <ResultShowcase />
        </div>

        {/* 8. Final CTA */}
        <div className="w-full">
          <FinalCta />
        </div>
      </main>

      {/* 9. Minimal Footer */}
      <Footer />
    </div>
  );
}
