import { GeneratorApp } from "@/components/generator/generator-app";

export default function WorkspacePage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Workspace Header */}
      <div className="space-y-1.5 pb-2 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-brand uppercase px-2 py-0.5 rounded-md bg-brand-subtle border border-brand-border">
            Interactive Workspace
          </span>
          <span className="text-xs text-muted-foreground">• Context-Calibrated Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Calibrate Communication
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Describe your situation or paste a raw draft. Conveyra will shape it around your recipient, tone, and constraints.
        </p>
      </div>

      {/* Generator App Centerpiece */}
      <GeneratorApp />
    </div>
  );
}
