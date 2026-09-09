# Conveyra — AI-Powered Communication Calibration SaaS

> Turn difficult, unfiltered thoughts into calibrated, context-aware messages that land the right way.

[![CI Test Suite](https://github.com/tayabunn/capstone-1-conveyra/actions/workflows/test.yml/badge.svg)](https://github.com/tayabunn/capstone-1-conveyra/actions/workflows/test.yml)
[![Accessibility WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success)](https://capstone-1-conveyra.vercel.app/)
[![Lighthouse Mobile 98+](https://img.shields.io/badge/Lighthouse-98%2F100-brightgreen)](https://capstone-1-conveyra.vercel.app/)
[![Tests Passing](https://img.shields.io/badge/Tests-65%2F65%20Passed-blue)](https://github.com/tayabunn/capstone-1-conveyra)

---

## 1. Overview

**Conveyra** is a full-stack SaaS communication copilot purpose-built to help individuals and professionals navigate sensitive, high-stakes, or awkward conversations.

### Core Problem Solved
People often know *what* they need to say, but struggle with *how* to say it without causing conflict, sounding abrasive, or compromising professional boundaries. Generic conversational chatbots (like ChatGPT) require complex prompt engineering that users lack the time or expertise to construct, and often produce overly apologetic corporate fluff.

### Why Conveyra Is Different
Instead of open-ended conversational prompts, Conveyra bounds inputs and enforces rigorous communication constraints:
1. **The Calibrated Message:** Ready-to-send message optimized for the recipient, channel, and objective.
2. **The Strategic Rationale:** An actionable breakdown of *why* the phrasing works.
3. **An Alternative Angle:** A distinct variation taking a different tactical approach.
4. **Context Signals & Risk Detection:** Identifies interpersonal friction and avoided communication risks.
5. **In-Place Micro-Refinements:** One-click instant adjustments (*"Make Warmer"*, *"Make Firmer"*, *"More Confident"*, *"Shorten"*, *"Remove Fluff"*).

---

## 2. Project Architecture

The project is organized into clean, decoupled **`frontend`** and **`backend`** workspaces:

```text
capstone-1-conveyra/
├── backend/                                   # Standalone Express & Prisma API Server
│   ├── prisma/
│   │   └── schema.prisma                      # PostgreSQL schema (User, Message)
│   ├── src/
│   │   ├── services/
│   │   │   ├── auth.service.ts                # Password hashing & JWT session issuance
│   │   │   └── message.service.ts             # Strict user-scoped message operations
│   │   ├── db/
│   │   │   └── supabase.ts                    # Supabase backend client
│   │   └── index.ts                           # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                                  # Next.js 16 App Router Client
│   ├── app/
│   │   ├── page.tsx                           # Public marketing homepage & interactive preview
│   │   ├── login/page.tsx                     # Authentication login view
│   │   ├── signup/page.tsx                    # Authentication signup view
│   │   ├── app/                               # Authenticated SaaS product shell
│   │   │   ├── page.tsx                       # Active calibration workspace
│   │   │   ├── history/page.tsx               # Generated message history & reuse
│   │   │   ├── favorites/page.tsx             # Starred playbook
│   │   │   └── settings/page.tsx              # Preferences & communication defaults
│   │   └── playground/accessibility/          # WCAG 2.1 AA component demonstration
│   │
│   ├── components/
│   │   ├── app-layout/                        # AppSidebar, AppHeader, Mobile Navigation
│   │   ├── generator/                         # MessageForm, GoalSelector, ChannelSelector, etc.
│   │   ├── result/                            # GeneratedMessage, ResultActions, ResultRefinement
│   │   ├── layout/                            # Header, Footer, ConveyraLogo, ThemeToggle
│   │   ├── sections/                          # Hero, HowItWorks, BentoGrid, Transformation
│   │   └── ui/                                # Accessible Dialog, Tabs, Disclosure
│   ├── lib/                                   # Schemas, crypto, DB layer, rate limiting
│   ├── utils/supabase/                        # Server, client & middleware SSR helpers
│   ├── middleware.ts                          # Supabase session refresh & route protection
│   ├── package.json                           # Next.js 16, React 19, Tailwind v4
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 3. Key SaaS Features

- **Authenticated Workspace (`/app`):** Complete communication workspace with persistent sidebar navigation and mobile drawer.
- **Delivery Channel Selection:** `Email` (with subject lines), `Slack`, `Microsoft Teams`, `SMS`, `WhatsApp`, `LinkedIn`.
- **Communication Objective / Goal:** `Request Action`, `Set Boundary`, `Seek Alignment`, `De-escalate Tension`, `Give Feedback`, `Ask Clarification`, `Decline Politely`, `Follow Up`.
- **In-Place Result Micro-Refinements:** Refine output directly on the result card (*Warmer, Firmer, Confident, Shorter, Fluff-free*) with instant undo support.
- **Message History & 1-Click Reuse (`/app/history`):** Search, filter, copy, star, and repopulate the generator from past calibrations.
- **Personal Communication Playbook (`/app/favorites`):** Star effective phrasing and build a private playbook of words that worked.
- **User Preferences & Settings (`/app/settings`):** Set default tone, default length, default channel, and theme preference.
- **Defensive Security:** Strict user data ownership (`WHERE userId = session.user.id`), sliding window rate limiting (10 req/min), payload size guards (<32 KB), and secret isolation.

---

## 4. Local Development Setup

### Prerequisites
* Node.js 20+
* npm 9+ or pnpm

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tayabunn/capstone-1-conveyra.git
   cd capstone-1-conveyra
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   *Create `.env.local` inside `frontend/`:*
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://ghbcjaduaipyhzhclqwz.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Hd2xZ0y2hYVVT599SIhkig_3YfIQboJ
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

4. **Run Automated Test Suite:**
   ```bash
   npm test
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 5. Testing & Quality Assurance

* **Unit & Integration Suite (Vitest):** **65 passing tests across 22 test suites** covering crypto, database isolation, form validation, generative UI, accessibility primitives, and micro-refinements.
* **Deterministic Isolation:** 100% mocked network requests in testing suites (zero live Gemini API costs during CI runs).
* **Accessibility:** 100% WCAG 2.1 AA compliant, 0 Axe-Core violations, visible focus rings, ARIA live announcements, reduced motion support.

---

## 6. License

This project is licensed under the MIT License.
