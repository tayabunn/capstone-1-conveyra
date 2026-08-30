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
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Navigation Header */}
      <Header />

      <main className="flex-1 flex flex-col items-center w-full">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Interactive Generator (Product-first Centerpiece) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl w-full relative z-10 pb-16 sm:pb-24">
          <GeneratorApp />
        </section>

        {/* 3. Thought -> Message Transformation Visual */}
        <div className="w-full">
          <TransformationSection />
        </div>

        {/* 4. How It Works */}
        <div className="w-full">
          <HowItWorks />
        </div>

        {/* 5. Use Case Bento */}
        <div className="w-full">
          <UseCaseBento />
        </div>

        {/* 6. Result Experience Showcase */}
        <div className="w-full">
          <ResultShowcase />
        </div>

        {/* 7. Final CTA */}
        <div className="w-full">
          <FinalCta />
        </div>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
