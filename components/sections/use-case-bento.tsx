export function UseCaseBento() {
  return (
    <section id="use-cases" className="py-24 sm:py-32 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border/60 mb-4">
            Context Matters
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Crafted for moments when words have weight.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Different recipients demand different approaches. Conveyra calibrates tone, assertiveness, and diplomacy for every dynamic.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Clients (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-border/70 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary border border-border/60 text-foreground">
                  Clients
                </span>
                <span className="text-xs font-mono text-muted-foreground">Professional Diplomacy</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
                Set boundaries without damaging relationships.
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
                Address scope expansion, negotiate deadlines, clarify invoices, or reject unreasonable requests with firm, respectful language that keeps contracts strong.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground flex items-center gap-3">
              <span>Scope management</span>
              <span>·</span>
              <span>Deadline pushbacks</span>
              <span>·</span>
              <span>Pricing adjustments</span>
            </div>
          </div>

          {/* Card 2: Work (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-border/70 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary border border-border/60 text-foreground">
                  Work
                </span>
                <span className="text-xs font-mono text-muted-foreground">Internal Alignment</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
                Ask clearly without over-explaining.
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Send updates to managers, ask leadership for resources, or decline meeting invites cleanly without defensive apologetic language.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground flex items-center gap-2">
              <span>Status updates</span>
              <span>·</span>
              <span>Unblocking blockers</span>
            </div>
          </div>

          {/* Card 3: Feedback (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-border/70 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary border border-border/60 text-foreground">
                  Feedback
                </span>
                <span className="text-xs font-mono text-muted-foreground">Constructive Critique</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
                Say difficult things constructively.
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Deliver performance critique or address missed expectations by focusing on actionable behavior rather than sounding accusatory.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground flex items-center gap-2">
              <span>Peer reviews</span>
              <span>·</span>
              <span>Course corrections</span>
            </div>
          </div>

          {/* Card 4: Personal (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-border/70 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary border border-border/60 text-foreground">
                  Personal
                </span>
                <span className="text-xs font-mono text-muted-foreground">Human Boundaries</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
                Express yourself without losing your meaning.
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
                Navigate delicate situations with family or friends, decline awkward invitations, or set emotional boundaries without escalating tension.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground flex items-center gap-3">
              <span>Awkward RSVPs</span>
              <span>·</span>
              <span>Difficult favors</span>
              <span>·</span>
              <span>Healthy boundaries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
