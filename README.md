# Conveyra

Turn difficult thoughts into messages that land the right way.

## 1. Project Overview
Conveyra is an AI-powered communication assistant that helps users draft context-appropriate messages for difficult or sensitive situations without the need for complex prompting.

## 2. Problem Solved
People often know what they want to say but struggle with how to phrase it, especially when navigating delicate scenarios like setting boundaries, giving feedback, or pushing back on clients. Generic chatbots often require prompt engineering that users don't want to do or don't know how to do effectively.

## 3. Target Users
Professionals, freelancers, and individuals who frequently need to draft sensitive communications but struggle to find the right balance of tone, professionalism, and directness.

## 4. Features
- **Structured Communication:** Gather precise context, recipient, tone, and desired length through a simple, accessible form.
- **Tailored AI Output:** Receive a primary message, an explanation of the communication approach, and a distinct alternative.
- **Accessible Design:** Built with full keyboard support, ARIA live regions, and semantic HTML (WCAG 2.1 AA compliant).
- **Light & Dark Themes:** Carefully crafted semantic design tokens with robust theme switching.
- **One-Click Actions:** Easily copy messages to clipboard or iterate on details seamlessly.

## 5. Tech Stack
- Next.js 15 (App Router)
- React & TypeScript
- Tailwind CSS v4
- Zod (Shared Validation)
- Gemini API (`@google/genai` via Server-side Route Handler)
- Vitest & React Testing Library (for unit testing)

## 6. Architecture Overview
The application uses a strict separation between client-side UX and server-side AI execution:
1. The user fills out the form in the `GeneratorApp` client component.
2. The form data is validated client-side using shared `Zod` schemas.
3. If valid, a POST request is sent to the `/api/generate-message` Next.js Route Handler.
4. The server securely re-validates the request payload.
5. The server constructs a prompt and sends it to the Gemini API utilizing **Structured Outputs** via JSON schema.
6. The server parses and strictly validates the AI's response against the `generateMessageResponseSchema`.
7. Safe, structured JSON is returned to the client and rendered.

## 7. Folder Structure
```
├── app/
│   ├── api/generate-message/route.ts  # Server-side API integration
│   ├── globals.css                    # Tailwind CSS configuration and theme tokens
│   ├── layout.tsx                     # Global Root Layout (Server Component)
│   └── page.tsx                       # Main entry page
├── components/
│   ├── feedback/                      # Error and state UI components
│   ├── generator/                     # Core interactive application logic and form
│   ├── layout/                        # Headers, footers, theme toggles, and logo
│   └── result/                        # AI result display and user actions
├── lib/
│   ├── schemas.ts                     # Shared Zod validation schemas
│   └── utils.ts                       # Utility functions (Tailwind merge)
└── test-api.js / test-gemini.js       # Standalone testing scripts
```

## 8. Local Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd capstone-1-conveyra
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

## 9. Environment Variables
Copy the example file to set up your local environment variables:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` to `.env.local`. This key is securely used server-side and is absolutely never exposed to the client browser.

## 10. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

## 11. AI Integration
We integrate directly with Google's Gemini API (`gemini-3.6-flash`) using the official `@google/genai` SDK. The integration operates exclusively on the server, ensuring credential security and controlled output generation.

## 12. AI Prompt Strategy
We employ a strictly bounded system prompt. Instead of asking the user to provide their own prompt, we ask the user for distinct inputs (Context, Recipient, Tone, Length, and Optional Draft) and assemble them into a highly specific instruction block on the server. The prompt mandates constraints such as forbidding placeholders (like `[Your Name]`) and forcing adherence to the requested parameters.

## 13. Structured Output
To prevent the UI from breaking when parsing AI responses, we utilize Gemini's `responseMimeType: "application/json"`. The prompt explicitly defines a JSON structure with three precise keys: `message`, `approach`, and `alternative`. This guarantees our frontend always receives predictable objects.

## 14. Zod Validation
We utilize Zod as a single source of truth across the entire stack:
- **Client-Side:** The form leverages Zod to block invalid submissions and highlight errors.
- **Server-Side (Input):** The API route verifies incoming requests haven't bypassed the frontend.
- **Server-Side (Output):** The AI's JSON string is run through Zod to guarantee it safely conforms to the expected payload before transmission back to the client.

## 15. Testing
The application employs Vitest and React Testing Library to test interactive components.
- Run tests: `npm run test`
- Run coverage: `npm run test:coverage` (Target: > 50% critical path coverage)
Tests fully mock the external Gemini API, focusing on DOM rendering, error states, duplicate submission prevention, and user actions.

## 16. Accessibility
Conveyra is rigorously audited for WCAG 2.1 AA compliance:
- Valid color contrast ratios in both Light and Dark themes (specifically addressing error text visibility).
- `aria-live` regions for dynamic state announcements (Loading, Success, Errors).
- Screen-reader-linked `aria-describedby` fieldsets for grouped radio validation errors.
- Clean semantic HTML structure, keyboard-only navigation support, and prominent focus rings.

## 17. Performance
Performance metrics safely hit 90+ out-of-the-box:
- Heavy use of React Server Components to reduce the client-side JavaScript payload.
- Zero external render-blocking scripts.
- Local subsetted Google Fonts (`next/font/google`) to eliminate Cumulative Layout Shift (CLS).
- Production bundle optimization confirms no unused large dependencies exist.

## 18. Error Handling
- **Client Input:** Handled natively before network requests.
- **Network Failures:** Caught by standard `fetch` wrappers and mapped to user-friendly "Generation Failed" states.
- **API Errors/Rate Limits:** Handled by specific HTTP status mapping on the server (e.g., `429`, `502`), propagating actionable messages back to the user.
- **Malformed AI Text:** Intercepted by Zod parsing inside `try/catch` blocks.

## 19. Known Limitations
- The application relies on external AI generation which inherently has a slight latency.
- Users must manually review AI outputs, as AI cannot guarantee 100% human nuance.
- Output options are constrained to specific lists (e.g., tone, recipient) for the MVP scope.

## 20. Future Improvements
- History tracking using a lightweight database for registered users.
- Custom tone creation overrides.
- Granular line-by-line regeneration controls in the UI.

## 21. Deployment Instructions
The application is pre-configured for seamless deployment to Vercel:
1. Connect the GitHub repository to the Vercel dashboard.
2. In the project settings, configure the environment variable: `GEMINI_API_KEY`.
3. Ensure the Build Command remains standard (`npm run build`).
4. Trigger the deployment.

## 22. Rollback Plan
If a critical production error occurs (e.g., AI API changes or layout crashing):
1. Immediately revert the problematic commit via Git locally or via GitHub UI.
2. Open the Vercel dashboard, navigate to the **Deployments** tab, find the last known stable deployment, and click **Redeploy**.
3. Verify that the production application resumes healthy API routing before closing the incident.
