import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Footer } from "@/components/layout/footer";
import { GeneratorApp } from "@/components/generator/generator-app";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-24 items-center justify-between max-w-6xl">
          <ConveyraLogo />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center pt-12 sm:pt-20 pb-16">
          <h1 className="text-[3.5rem] leading-[1.05] sm:text-7xl md:text-[5.5rem] font-extrabold tracking-tighter text-foreground mb-8 text-balance">
            Say what you mean,<br className="hidden sm:block" />
            <span className="text-muted-foreground"> in the right way.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed font-medium">
            Describe what you need to communicate and the outcome you want. Conveyra gives you the exact words for any situation.
          </p>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl w-full relative z-10 pb-24">
          <GeneratorApp />
        </section>
        
        <div className="w-full">
          <HowItWorks />
        </div>
      </main>

      <Footer />
    </div>
  );
}
