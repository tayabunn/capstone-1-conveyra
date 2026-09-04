# Conveyra

> Turn difficult, unfiltered thoughts into calibrated, context-aware messages that land the right way.

[![CI Test Suite](https://github.com/tayabunn/capstone-1-conveyra/actions/workflows/test.yml/badge.svg)](https://github.com/tayabunn/capstone-1-conveyra/actions/workflows/test.yml)
[![Accessibility WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success)](https://capstone-1-conveyra.vercel.app/)
[![Lighthouse Mobile 98+](https://img.shields.io/badge/Lighthouse-98%2F100-brightgreen)](https://capstone-1-conveyra.vercel.app/)
[![Tests Passing](https://img.shields.io/badge/Tests-56%2F56%20Passed-blue)](https://github.com/tayabunn/capstone-1-conveyra)

---

## 1. Overview

**Conveyra** is an AI-powered communication assistant purpose-built to help individuals and professionals navigate sensitive, high-stakes, or awkward conversations.

### The Core Problem Solved
People often know *what* they need to say, but struggle with *how* to say it without causing conflict, sounding abrasive, or compromising professional boundaries. Generic conversational chatbots (like ChatGPT) require complex prompt engineering that users lack the time or expertise to construct. Furthermore, conversational bots often produce generic, overly apologetic, or sycophantic corporate fluff.

### Why Conveyra Is Different
Instead of an open-ended conversational prompt, Conveyra eliminates prompt engineering by bounding inputs and enforcing rigorous communication constraints directly at the architecture level. It analyzes audience dynamics, identifies interpersonal risks, and generates:
1. **The Calibrated Message:** A ready-to-send message optimized for the recipient.
2. **The Strategic Rationale:** An actionable breakdown of *why* the phrasing works.
3. **An Alternative Angle:** A distinct variation taking a different tactical approach.

---

## 2. Live Demo

- **Production Deployment:** [https://capstone-1-conveyra.vercel.app/](https://capstone-1-conveyra.vercel.app/)
- **Accessibility Playground:** [https://capstone-1-conveyra.vercel.app/playground/accessibility](https://capstone-1-conveyra.vercel.app/playground/accessibility)

---

## 3. Product Visuals & Screenshots

| View | Description |
| :--- | :--- |
| **Landing Page & Editorial Hero** | Minimalist, typography-driven hero introducing the value proposition with zero visual bloat. |
| **Workspace Centerpiece** | Bounded multi-step form capturing raw intent, recipient dynamic, tone calibration, and length constraints. |
| **Structured Output View** | 3-part calibrated output featuring the primary message, strategic rationale card, and alternative perspective. |
| **Accessibility Playground** | Dedicated interactive sandbox demonstrating accessible modals, roving tabindex tabs, and disclosures. |

*(Reference visual assets: [`Landing-Page.jpg`](file:///Landing-Page.jpg) in the project repository).*

---

## 4. Key Features

- **Guided Communication Workspace:** Bounded input fields capturing raw thoughts, recipient relationship (`Manager`, `Client`, `Colleague`, `Friend`, `Family`, `Other`), desired tone (`Professional`, `Friendly`, `Direct`, `Empathetic`), and length sizing.
- **Server-Side AI Context Tool (`analyzeCommunicationContext`):** Heuristic analysis engine assessing relationship hierarchy, formality requirements, perceived urgency, and critical interpersonal risks before generating final phrasing.
- **3-Part Calibrated AI Output:** Generates a primary ready-to-send message, a strategic explanation of why it succeeds, and an alternative perspective.
- **Optional Rough Draft Refinement:** Allows pasting initial notes or messy drafts for tone calibration while preserving core facts.
- **Accessible Design (WCAG 2.1 AA Compliant):** Full keyboard navigation, visible focus rings, ARIA live regions for asynchronous status updates, and screen-reader-associated error bindings. Zero critical/serious Axe violations.
- **One-Click Clipboard & Action Flow:** Instant message copying with visual feedback, single-click regeneration, input editing, and clean state resets.
- **Adaptive Light & Dark Themes:** Curated semantic design tokens engineered for high contrast (WCAG AA 4.5:1 / 3:1) and seamless switching.
- **Production Rate Limiting & Abuse Protection:** In-memory sliding window rate limiter (10 req/min per IP), 32KB payload bounding, and server-side secret isolation.

---

## 5. Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router with React Server Components)
- **Language & Runtime:** [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), Node.js 20
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with semantic CSS variables
- **Schema & Validation:** [Zod 4](https://zod.dev/) (shared client and server validation contracts)
- **AI Integration:** Google Gemini API (`gemini-3.6-flash`) via official `@google/genai` SDK
- **Testing & Quality Assurance:** [Vitest 4](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/) (E2E), [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm)
- **Deployment & Hosting:** [Vercel](https://vercel.com/) (Edge / Serverless infrastructure)

---

## 6. Architecture & System Flow

```text
User Interaction
       │
       ▼
Next.js 16 Frontend (Client Components + React Server Components)
       │
       ▼ [POST /api/generate-message]
Server Route Handler (maxDuration = 30s)
       │
       ├─► 1. Rate Limiter (Sliding Window: 10 req/min per IP)
       ├─► 2. Payload Byte Size Guard (< 32 KB)
       ├─► 3. Zod Schema Validation (GenerateMessageSchema)
       │
       ▼
Server-Side AI Tool (`executeCommunicationContext`)
       │
       ▼
Google Gemini API (`gemini-3.6-flash` with JSON Schema constraint)
       │
       ▼
Response Validation (`GenerateMessageResponseSchema`)
       │
       ▼
Structured Response Payload (Message + Rationale + Alternative + Tool Analysis)
       │
       ▼
UI Presentation (Live Region Announcement + Heading Focus Handoff + Copy Action)
```

---

## 7. Local Development Setup

### Prerequisites
- Node.js 18.18+ or 20+
- npm 9+ or pnpm

### Quickstart (Under 3 Minutes)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tayabunn/capstone-1-conveyra.git
   cd capstone-1-conveyra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` and add your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 8. Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | **Yes** | API Key for Google Gemini (`gemini-3.6-flash`) obtained from Google AI Studio. |
| `ANTHROPIC_API_KEY` | Optional | Fallback API key for Anthropic Claude models if multi-provider routing is enabled. |

> **Security Note:** API keys are restricted strictly to Server Components and Route Handlers. No credentials use the `NEXT_PUBLIC_` prefix and secrets are never sent to the browser bundle.

---

## 9. How AI Tools Built This Project

This project was built with a modern AI-assisted engineering workflow, balancing rapid iteration with rigorous human verification:

1. **Architecture & Schema Design:** Used AI coding assistants to scaffold Zod validation contracts and draft initial TypeScript type definitions.
2. **Accessible Component Authoring:** Collaborated with AI tools to build WCAG 2.1 AA compliant primitives (focus trapping, roving tabindex, ARIA live announcements).
3. **Manual Code & Security Reviews:** Every AI-generated file was reviewed for type safety, hydration mismatches, CSS token consistency, and zero client-side secret exposure.
4. **Automated Testing Suite:** Employed AI to draft comprehensive Vitest unit tests and Playwright E2E integration scenarios with deterministic API mocking.
5. **Auditing & Iterative Refinement:** Audited performance with Lighthouse and WAVE, systematically resolving contrast deficiencies and keyboard focus stranding.

---

## 10. Security & Abuse Protection

- **Server-Side API Key Isolation:** `GEMINI_API_KEY` is accessed exclusively on the server (`app/api/generate-message/route.ts`).
- **In-Memory Rate Limiting:** Enforces a sliding window limit of **10 requests per minute per IP**, returning HTTP `429 Too Many Requests` with `Retry-After` headers.
- **Strict Payload Constraints:** Rejects payloads exceeding 32 KB (`413 Payload Too Large`) and validates input bounds (max 2,000 characters per textarea).
- **Execution Duration Timeout:** Configured `export const maxDuration = 30` with an internal 25s `AbortController` timeout to prevent hanging serverless instances.
- **Sanitized Error Responses:** Internal exception messages and stack traces are suppressed; users receive actionable, human-friendly guidance.

---

## 11. Important Technical Decisions

1. **Why Next.js 16 Server Components?** Static marketing sections (`Hero`, `HowItWorks`, `UseCaseBento`, `TransformationSection`, `Footer`) remain React Server Components with zero JavaScript bundle overhead, keeping mobile LCP fast (`1.8s`) and Speed Index low (`1.7s`).
2. **Why Bounded Structured Generation over Open-Ended Chat?** Communication calibration requires tight boundary setting. Structuring inputs via dropdowns and chip selectors eliminates prompt engineering errors and guarantees consistent 3-part outputs.
3. **Why Shared Zod Contracts?** Validating on both client and server ensures instantaneous user feedback in the browser while protecting the server API against bypass attempts.
4. **Why Deterministic Testing Mocks?** Mocking AI network requests in Vitest and Playwright ensures 100% reproducible, fast (< 10s) CI runs with zero API billing costs.

---

## 12. Quality Assurance & Testing

```bash
# Run Vitest unit & integration test suite (56 tests)
npm test

# Run V8 code coverage audit (> 75% coverage)
npm run test:coverage

# Run Playwright E2E browser test suite (13 scenarios)
npm run test:e2e

# Run Next.js production build & typecheck
npm run build
```

---

## 13. Known Limitations

- **In-Memory Rate Limiter Scope:** The in-memory sliding window rate limiter is localized per serverless instance. For high-volume multi-region scaling, an external store like Redis/Upstash can be attached.
- **Upstream Model Quotas:** Real AI output generation is subject to Google Gemini API rate limits; handled gracefully with structured retry feedback and client cancellation.

---

## 14. License

This project is licensed under the MIT License — see the repository for details.
