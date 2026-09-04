# Conveyra Automated Testing & Quality Assurance Documentation

## 1. Testing Stack Overview

The Conveyra test suite is architected to guarantee production robustness, complete WCAG 2.1 AA accessibility, strict Zod contract enforcement, and zero real AI API consumption during testing.

- **Unit & Integration Framework:** [Vitest](https://vitest.dev/) (v4.1.11)
- **DOM Testing Utilities:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (v16.3.3) with [jest-dom](https://github.com/testing-library/jest-dom) matchers and JSDOM environment
- **Code Coverage Provider:** `@vitest/coverage-v8` (V8 engine)
- **End-to-End (E2E) & A11y Engine:** [Playwright](https://playwright.dev/) (v1.62.1) + `@axe-core/playwright` (v4.13.0)
- **Continuous Integration:** GitHub Actions (`.github/workflows/test.yml`)

---

## 2. High-Risk Behaviors & What Is Tested

Conveyra's primary risk lies in the **AI generation state machine**, **asynchronous state transitions**, **validation failures**, and **accessible focus handoffs**.

### Primary Risk Vectors Covered:
1. **Generator Input & Validation:** Form rendering with accessible labels, character counter constraints, mandatory field enforcement via Zod, and keyboard recovery on validation errors.
2. **AI State Machine:** Deterministic transitions across `idle` → `loading` → `success` / `error` without memory leaks or race conditions.
3. **In-Flight Cancellation:** User agency to cleanly cancel in-flight generation requests via `AbortController` without leaving hanging promises.
4. **Structured AI Result Presentation:** Accurate rendering of the 3-part response (`message`, `approach` rationale, `alternative` approach) and tool analysis components.
5. **Action Handlers:** One-click clipboard copy with polite live status announcements (`aria-live="polite"`), regeneration triggers, edit mode preservation, and reset to clean state.
6. **Accessibility Compliance:** Visible focus rings, keyboard trapping and restoration in modals, roving tabindex and Arrow-key navigation in tabs, disclosure accordion controls, and 0 critical/serious Axe-Core violations.

---

## 3. Unit & Integration Test Suite

The unit and integration suite spans **18 test files** containing **54+ tests**:

| Test Suite File | Tested Component / Utility | Scenarios Covered |
| :--- | :--- | :--- |
| `components/generator/message-form.test.tsx` | `MessageForm` | Field rendering, accessible labels, validation rejection on empty input, valid submission forwarding, field disabling during loading, optional draft toggling, in-flight cancel callback. |
| `components/generator/generator-app.test.tsx` | `GeneratorApp` | Idle state rendering, end-to-end mocked generation flow, API rate-limit/network error recovery, start new flow, request abort via `AbortController`, malformed API response handling, edit details with preserved inputs. |
| `components/result/generated-message.test.tsx` | `GeneratedMessage` | 3-part structured AI payload rendering, focusable heading ref binding, strategy card presentation. |
| `components/result/result-actions.test.tsx` | `ResultActions` | Clipboard copy with polite status feedback, button trigger callbacks for regenerate, edit, and start new. |
| `components/feedback/error-state.test.tsx` | `ErrorState` | Accessible `role="alert"` container, human-readable error text, keyboard-focusable retry button. |
| `components/generator/communication-context-tool.test.tsx` | `CommunicationContextTool` | `input-streaming` and `output-available` state rendering for context analysis. |
| `lib/ai/tools/analyze-communication-context.test.ts` | `analyzeCommunicationContext` | Heuristic analysis utility validating relationship hierarchy, tone friction, length sizing, and boundary recommendations. |
| `playground/accessibility/__tests__/AccessibleModal.test.tsx` | `AccessibleModal` | Focus trapping, Escape key dismiss, focus restoration, modal backdrop click dismiss. |
| `playground/accessibility/__tests__/AccessibleTabs.test.tsx` | `AccessibleTabs` | ARIA tablist/tab/tabpanel markup, ArrowLeft/ArrowRight keyboard navigation, Home/End shortcut keys. |
| `playground/accessibility/__tests__/AccessibleDisclosure.test.tsx` | `AccessibleDisclosure` | Accordion expansion state, `aria-expanded` toggle, keyboard Space/Enter activation. |
| `components/layout/header.test.tsx` | `Header` | Brand logo, navigation landmarks, theme toggle, and CTA anchor. |
| `components/layout/footer.test.tsx` | `Footer` | Brand logo, footer links, copyright notice. |
| `components/hero.test.tsx` | `Hero` | Headline, value proposition, primary action anchors. |
| `components/how-it-works.test.tsx` | `HowItWorks` | 3-stage methodology cards (Describe, Calibrate, Communicate). |
| `components/sections/transformation-section.test.tsx` | `TransformationSection` | Editorial before/after comparison demonstration. |
| `components/sections/use-case-bento.test.tsx` | `UseCaseBento` | High-stakes scenario cards. |
| `components/sections/result-showcase.test.tsx` | `ResultShowcase` | Result architecture visual breakdown. |
| `components/sections/final-cta.test.tsx` | `FinalCta` | Final call-to-action section and anchor button. |

---

## 4. End-to-End (E2E) Test Suite (Playwright)

Located in `tests/e2e/`, the E2E suite runs headless in Chromium with automated local dev server lifecycle management:

- **`generator.spec.ts` (Critical User Journey):**
  1. Opens application at `/`.
  2. Intercepts network route `**/api/generate-message`.
  3. Fills `#context` with realistic workplace thought.
  4. Selects Recipient (`manager`), Tone (`Professional`), and Length (`Short`).
  5. Clicks *Generate Message*.
  6. Fulfills mocked 3-part structured AI payload with simulated network latency.
  7. Asserts visibility of *Your Suggested Message*, rationale, and alternative.
  8. Clicks *Copy Message* and verifies clipboard feedback (*"Copied to clipboard"*).
- **`playground.spec.ts`:** Verifies modal focus trapping, tabs keyboard roaming, disclosure expansion, and runs automated Axe-Core audit on `/playground/accessibility`.
- **`responsive.spec.ts`:** Validates layout stability across 7 mobile and desktop viewport sizes (320px, 375px, 390px, 414px, 768px, 1024px, 1280px+).
- **`theme.spec.ts`:** Verifies dark/light theme switching and color token persistence.
- **`audit.spec.ts`:** Runs automated Axe accessibility scans verifying 0 critical or serious violations.

---

## 5. AI/API Mocking Boundary & Security Guarantees

### Strict Mocking Policy
- **Zero Real API Calls:** Automated unit and E2E tests **NEVER** call the live Google Gemini API or external LLM endpoints.
- **Unit Isolation:** `global.fetch` is mocked in Vitest test suites using `vi.fn().mockResolvedValue(...)` or `mockImplementation(...)`.
- **E2E Isolation:** Playwright intercepts requests via `page.route('**/api/generate-message', (route) => route.fulfill({ json: ... }))`.
- **Security:** No API keys, secret tokens, or private credentials are included in test files, configurations, or CI workflows. Tests run fully offline and deterministically.

---

## 6. Code Coverage Summary

V8 code coverage measured via `npm run test:coverage`:

| Metric | Measured Result | Assignment Target | Status |
| :--- | :---: | :---: | :---: |
| **Lines** | **70.5%** | ≥ 50% | **PASS** |
| **Statements** | **68.2%** | ≥ 50% | **PASS** |
| **Branches** | **75.4%** | ≥ 50% | **PASS** |
| **Functions** | **66.1%** | ≥ 50% | **PASS** |

*Interactive generator components (`components/generator`, `components/result`, `components/feedback`) exceed 80%+ line coverage.*

---

## 7. Continuous Integration (GitHub Actions)

Workflow file: [`.github/workflows/test.yml`](file:///.github/workflows/test.yml)

### Triggers:
- `push` to `main` or `master` branches
- `pull_request` to `main` or `master` branches

### Pipeline Steps:
1. **Checkout:** Clones repository using `actions/checkout@v4`.
2. **Setup Node.js:** Installs Node.js v20 with npm caching.
3. **Clean Install:** Executes `npm ci` matching `package-lock.json`.
4. **Build & Typecheck:** Runs `npm run build` with Turbopack compiler.
5. **Unit & Integration Suite:** Runs `npm test` (Vitest).
6. **Coverage Check:** Runs `npm run test:coverage`.
7. **Playwright E2E Suite:** Installs Chromium headless binaries and executes full E2E test matrix.
8. **Block on Failure:** Any step failure immediately halts the workflow and blocks PR merging.

---

## 8. Package Scripts

```bash
# Run unit & integration tests
npm test

# Run code coverage audit
npm run test:coverage

# Run Playwright E2E test suite
npm run test:e2e

# Run Next.js production build & typecheck
npm run build
```

---

## 9. Known Testing Limitations

1. **Clipboard API Permissions in Headless CI:** Modern browsers restrict clipboard write access in headless sandbox environments without explicit permissions (`context.grantPermissions(['clipboard-read', 'clipboard-write'])`). Handled in Playwright E2E configuration.
2. **Upstream LLM Non-Determinism:** Live AI models produce non-deterministic variations. Mocking at the HTTP boundary guarantees repeatable assertions and prevents flaky test failures.
