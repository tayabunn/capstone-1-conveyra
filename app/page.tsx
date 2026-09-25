import { Header } from "@/components/layout/header";
import { Hero } from "@/components/hero";
import { GeneratorApp } from "@/components/generator/generator-app";
import { TransformationSection } from "@/components/sections/transformation-section";
import { HowItWorks } from "@/components/how-it-works";
import { UseCaseBento } from "@/components/sections/use-case-bento";
import { ResultShowcase } from "@/components/sections/result-showcase";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/layout/footer";

import { AppleDeviceMockup } from "@/components/ui/apple-device-mockup";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid-subtle text-foreground selection:bg-brand selection:text-brand-foreground overflow-x-hidden relative">
      {/* Soft atmospheric illumination */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),rgba(139,92,246,0.06)_40%,transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),rgba(139,92,246,0.12)_40%,transparent_75%)] -z-10" 
      />
      
      {/* 1. Navigation Header */}
      <Header />

      <main className="flex-1 flex flex-col items-center w-full">
        {/* 2. Editorial Hero */}
        <Hero />

        {/* 3. Interactive Product Demo Preview in Apple Tablet / Mac Mockup */}
        <section id="demo" className="w-[90%] max-w-[90%] mx-auto relative z-10 pb-16 sm:pb-24">
          <div className="text-center mb-8 space-y-2">
            <div className="badge-shiny mb-2">
              <span className="badge-dot" />
              Interactive Calibration Preview
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Try the live calibration workspace
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-full mx-auto">
              Simulate high-stakes communication calibration in a live simulated studio environment
            </p>
          </div>

          <AppleDeviceMockup>
            <GeneratorApp />
          </AppleDeviceMockup>
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
