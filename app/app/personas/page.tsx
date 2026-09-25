"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, Trash2, ArrowRight, ShieldCheck, Sparkles, Check, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaItem {
  id: string;
  title: string;
  category: string;
  preferredTone: string;
  sensitivities: string[];
  description: string;
}

const INITIAL_PERSONAS: PersonaItem[] = [
  {
    id: "persona-1",
    title: "Demanding Enterprise Client",
    category: "Client / External",
    preferredTone: "Firm & Professional",
    sensitivities: ["Avoid over-apologizing", "Highlight agreed scope", "Provide clear timeline"],
    description: "High-stakes executive or client with tight deadlines and scope-creep tendencies.",
  },
  {
    id: "persona-2",
    title: "Executive Leadership (VP / C-Level)",
    category: "Management",
    preferredTone: "Concise & Executive",
    sensitivities: ["Bottom-line first (BLUF)", "No unnecessary backstory", "Clear decision requested"],
    description: "Time-poor leadership who only read the first 2 sentences and bulleted recommendations.",
  },
  {
    id: "persona-3",
    title: "Direct Report / Mentee",
    category: "Internal Team",
    preferredTone: "Encouraging & Constructive",
    sensitivities: ["Actionable coaching", "Positive reinforcement", "Psychological safety"],
    description: "Team member receiving feedback or assignment without triggering defensiveness.",
  },
];

export default function PersonasPage() {
  const [personas, setPersonas] = useState<PersonaItem[]>(INITIAL_PERSONAS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Client / External");
  const [newTone, setNewTone] = useState("Professional");
  const [newSensitivity, setNewSensitivity] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreatePersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: PersonaItem = {
      id: `persona-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      preferredTone: newTone,
      sensitivities: newSensitivity
        ? newSensitivity.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Clear boundaries", "Context-aware phrasing"],
      description: newDescription.trim() || "Custom tailored recipient profile.",
    };

    setPersonas([created, ...personas]);
    setShowAddModal(false);
    setNewTitle("");
    setNewSensitivity("");
    setNewDescription("");
    setSuccessMessage(`Persona "${created.title}" created successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    setPersonas(personas.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-brand uppercase px-2 py-0.5 rounded-md bg-brand-subtle border border-brand-border">
              Audience Directory
            </span>
            <span className="text-xs text-muted-foreground">• Custom Recipient Personas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Recipient Personas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure custom communication guardrails and sensitivities for specific clients, executives, or team members.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-tactile btn-tactile-brand animate-shine px-4 py-2.5 text-xs font-bold self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Persona</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="rounded-lg p-5 sm:p-6 border border-border/80 bg-card/90 backdrop-blur-xl card-glass-glow flex flex-col justify-between space-y-4 hover:border-brand/40 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-2xl bg-brand/10 text-brand border border-brand/20">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                    {persona.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(persona.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Delete persona"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors">
                  {persona.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {persona.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-background/60 border border-border/50 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-medium">Preferred Tone:</span>
                  <span className="font-semibold text-foreground font-mono">{persona.preferredTone}</span>
                </div>
                
                <div className="space-y-1 pt-1 border-t border-border/40">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                    Interpersonal Sensitivities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {persona.sensitivities.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/80 text-foreground font-medium border border-border/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/app?recipient=${encodeURIComponent(persona.title)}`}
              className="btn-tactile btn-tactile-secondary w-full py-2.5 text-xs font-semibold tracking-tight text-foreground flex items-center justify-center gap-2 cursor-pointer shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Calibrate for this Persona</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        ))}
      </div>

      {/* Add Persona Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-lg p-6 sm:p-8 shadow-elevated space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand" />
                <h2 className="text-lg font-bold text-foreground">Create Recipient Persona</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreatePersona} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Persona Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Enterprise Client (Sarah)"
                  className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Relationship Role</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Client / External">Client / External</option>
                    <option value="Management">Management</option>
                    <option value="Internal Team">Internal Team</option>
                    <option value="Vendor / Partner">Vendor / Partner</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Default Tone</label>
                  <select
                    value={newTone}
                    onChange={(e) => setNewTone(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Firm & Direct">Firm & Direct</option>
                    <option value="Diplomatic">Diplomatic</option>
                    <option value="Warm & Friendly">Warm & Friendly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Key Sensitivities (comma-separated)</label>
                <input
                  type="text"
                  value={newSensitivity}
                  onChange={(e) => setNewSensitivity(e.target.value)}
                  placeholder="e.g. Avoid fluff, Must include deadline, Keep under 3 sentences"
                  className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Context Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes on communication style, triggers to avoid, and goals..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-tactile btn-tactile-secondary px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-tactile btn-tactile-brand animate-shine px-5 py-2 text-xs font-bold"
                >
                  Save Persona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
