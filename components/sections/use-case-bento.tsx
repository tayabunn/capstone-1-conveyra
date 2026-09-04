import { Briefcase, Building2, MessageSquare, Users } from "lucide-react";

export function UseCaseBento() {
  return (
    <section id="use-cases" className="py-20 sm:py-28 border-t border-border bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border mb-4">
            Context Dynamics
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Crafted for moments when words have weight.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Different recipients demand different approaches. Conveyra calibrates tone, assertiveness, and diplomacy for every dynamic.
          </p>
        </div>

        {/* Asymmetric Bento Grid with distinct accent motifs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Clients (7 cols) */}
          <div className="md:col-span-7 rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card hover:border-electric/40 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-electric-subtle text-electric flex items-center justify-center border border-electric-border">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-tight text-foreground uppercase">
                    Clients
                  </span>
                </div>
                <span className="text-[11px] font-mono text-electric font-semibold px-2 py-0.5 rounded bg-electric-subtle">
                  Professional Diplomacy
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2.5">
                Set boundaries without damaging relationships.
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-lg">
                Address scope expansion, negotiate deadlines, clarify invoices, or decline unreasonable requests with firm, respectful language that keeps contracts strong.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-[11px] font-mono text-muted-foreground flex flex-wrap items-center gap-2 sm:gap-3">
              <span>Scope management</span>
              <span className="text-border">·</span>
              <span>Deadline pushbacks</span>
              <span className="text-border">·</span>
              <span>Pricing adjustments</span>
            </div>
          </div>

          {/* Card 2: Work (5 cols) */}
          <div className="md:col-span-5 rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card hover:border-brand/40 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand flex items-center justify-center border border-brand-border">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-tight text-foreground uppercase">
                    Work
                  </span>
                </div>
                <span className="text-[11px] font-mono text-brand font-semibold px-2 py-0.5 rounded bg-brand-subtle">
                  Internal Alignment
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2.5">
                Ask clearly without over-explaining.
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Send updates to managers, ask leadership for resources, or decline meeting invites cleanly without apologetic language.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-[11px] font-mono text-muted-foreground flex items-center gap-2">
              <span>Status updates</span>
              <span className="text-border">·</span>
              <span>Unblocking blockers</span>
            </div>
          </div>

          {/* Card 3: Feedback (5 cols) */}
          <div className="md:col-span-5 rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card hover:border-emerald-500/40 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-tight text-foreground uppercase">
                    Feedback
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                  Constructive Critique
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2.5">
                Say difficult things constructively.
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Deliver performance critique or address missed expectations by focusing on actionable behavior rather than sounding accusatory.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-[11px] font-mono text-muted-foreground flex items-center gap-2">
              <span>Peer reviews</span>
              <span className="text-border">·</span>
              <span>Course corrections</span>
            </div>
          </div>

          {/* Card 4: Personal (7 cols) */}
          <div className="md:col-span-7 rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card hover:border-violet-500/40 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-lavender text-lavender-foreground flex items-center justify-center border border-brand-border/40">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-tight text-foreground uppercase">
                    Personal
                  </span>
                </div>
                <span className="text-[11px] font-mono text-lavender-foreground font-semibold px-2 py-0.5 rounded bg-lavender">
                  Human Boundaries
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2.5">
                Express yourself without losing your meaning.
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-lg">
                Navigate delicate situations with family or friends, decline awkward invitations, or set emotional boundaries without escalating tension.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-[11px] font-mono text-muted-foreground flex flex-wrap items-center gap-2 sm:gap-3">
              <span>Awkward RSVPs</span>
              <span className="text-border">·</span>
              <span>Difficult favors</span>
              <span className="text-border">·</span>
              <span>Healthy boundaries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
