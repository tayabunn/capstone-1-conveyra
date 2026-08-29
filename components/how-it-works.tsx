export function HowItWorks() {
  return (
    <section className="py-32 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-20 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            Get the right words in three simple steps.
          </p>
        </div>
        
        <div className="grid gap-x-12 gap-y-16 md:grid-cols-3">
          {/* Step 1 */}
          <div className="flex flex-col items-start relative">
            <div className="w-full h-[1px] bg-border mb-8" />
            <div className="font-mono text-xs font-semibold tracking-widest text-muted-foreground mb-4">
              01
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Describe the situation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tell Conveyra what you need to communicate and the outcome you want. Include your rough draft if you have one.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start relative">
            <div className="w-full h-[1px] bg-border mb-8" />
            <div className="font-mono text-xs font-semibold tracking-widest text-muted-foreground mb-4">
              02
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Set the context</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Choose who you are speaking to, the tone, and the message length to perfectly calibrate the delivery.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start relative">
            <div className="w-full h-[1px] bg-border mb-8" />
            <div className="font-mono text-xs font-semibold tracking-widest text-muted-foreground mb-4">
              03
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Get the right words</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Receive a tailored message and an alternative approach to consider. Copy it straight to your clipboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
