# Accessibility Component Notes

## Custom Components

### Modal (`AccessibleModal.tsx`)

* **Focus Management**:
  * **On Open**: Before rendering and mounting the dialog content, the component records the currently active element (`document.activeElement`) via a React ref (`triggerRef`). If an `initialFocusRef` is explicitly provided, focus is directed to that element; otherwise, the component queries all focusable elements inside the dialog and automatically focuses the first interactive element. If no focusable child exists, focus safely lands on the dialog container itself (`tabIndex={-1}`).
  * **On Close**: When the modal closes or unmounts, the `useEffect` cleanup hook verifies whether the recorded trigger element is still valid and connected to `document.body`. If valid, focus is immediately restored to the trigger. If the trigger was unmounted from the DOM during the dialog session, focus safely defaults to `fallbackRestoreRef` or remains safe without crashing.

* **Escape Handling**:
  * The modal attaches an `onKeyDown` listener to the dialog container (as well as global listeners). When `event.key === "Escape"` is pressed, the event is stopped (`stopPropagation` & `preventDefault`) and the `onClose` callback is invoked to dismiss the modal cleanly.

* **Focus Trapping**:
  * The dialog intercepts `Tab` and `Shift+Tab` keyboard navigation within the dialog container.
  * A helper queries all visible, non-disabled interactive elements (`a[href]`, `button:not([disabled])`, `input:not([disabled])`, `select`, `textarea`, `[tabindex]:not([tabindex="-1"])`).
  * When `Tab` is pressed on the last focusable element, focus wraps around to the first focusable element.
  * When `Shift + Tab` is pressed on the first focusable element (or dialog wrapper), focus wraps around to the last focusable element.

* **ARIA Relationships & Semantics**:
  * `role="dialog"`: Informs assistive technologies that the container is an interactive dialog.
  * `aria-modal="true"`: Communicates to screen readers that content outside this modal is inert.
  * `aria-labelledby`: Uniquely links the modal container to the title header element (`<h2>`).
  * `aria-describedby`: Uniquely links the modal container to the optional description element.
  * Accessible close button equipped with `aria-label="Close dialog"`.

---

### Tabs (`AccessibleTabs.tsx`)

* **Tablist / Tab Relationships**:
  * The outer list container has `role="tablist"` with a descriptive `aria-label` and `aria-orientation="horizontal"`.
  * Each tab button has `role="tab"`, unique `id`, and `aria-controls` referencing its corresponding tabpanel's `id`.

* **Keyboard Navigation**:
  * Implements the WAI-ARIA Roving Tabindex pattern:
    * `ArrowRight`: Advances focus and active selection to the next enabled tab (wrapping from last tab to first tab).
    * `ArrowLeft`: Retreats focus and active selection to the previous enabled tab (wrapping from first tab to last tab).
    * `Home`: Jumps focus and selection to the first enabled tab.
    * `End`: Jumps focus and selection to the last enabled tab.
    * Automatically skips any disabled tabs in the sequence.

* **Selected State**:
  * Active tab receives `aria-selected="true"` and `tabIndex={0}`.
  * Inactive tabs receive `aria-selected="false"` and `tabIndex={-1}`.
  * When a keyboard user presses `Tab` from outside the component, focus lands directly on the selected tab.

* **Tabpanel Relationships**:
  * Each content section has `role="tabpanel"`, unique `id`, and `aria-labelledby` pointing back to its controlling tab's `id`.
  * Inactive panels are hidden via the HTML `hidden` attribute and CSS display rules.
  * Panels have `tabIndex={0}` so keyboard users can navigate into panel content if it contains static text.

* **Activation Model**:
  * Default: **Automatic Activation**, where navigating with arrow keys immediately focuses and activates the corresponding tab and displays its panel.
  * Optional: **Manual Activation** (`activationMode="manual"`), where arrow keys move focus among tabs without activating them until the user explicitly presses `Enter` or `Space`.

---

### Disclosure (`AccessibleDisclosure.tsx`)

* **Trigger Semantics**:
  * Uses a native `<button>` element rather than a `<div>` with click listeners. This provides built-in keyboard operability (`Enter` and `Space`), native focusability, and screen reader recognition out of the box.

* **Expanded State**:
  * Directly exposes state via `aria-expanded="true"` when opened and `aria-expanded="false"` when collapsed.
  * Accompanied by a visual chevron indicator that rotates 180° when expanded.

* **Controlled Content Relationship**:
  * The button trigger possesses an `aria-controls="[panelId]"` attribute linking it directly to the collapsible content container.
  * The panel has `role="region"` and `aria-labelledby="[buttonId]"` linking it back to the trigger button for clear screen reader landmarks.

* **Keyboard Behavior**:
  * Pressing `Enter` or `Space` on the trigger toggles the open/closed state.
  * Pressing `Tab` moves focus sequentially: when collapsed, `Tab` moves past the disclosure; when expanded, `Tab` moves directly into any interactive elements inside the revealed panel.

---

# shadcn Comparison

| Area | My Implementation (`playground/accessibility/`) | shadcn / Radix UI Implementation (`components/ui/`) | What I Learned |
| :--- | :--- | :--- | :--- |
| **Focus Management & Scoping** | Implemented custom `focusTimer` with `requestAnimationFrame`, manual DOM traversal of focusable elements (`FOCUSABLE_SELECTOR`), and custom `triggerRef` for restoration. | Uses Radix `@radix-ui/react-focus-scope` (`FocusScope`). Maintains an internal stack of active focus scopes to prevent collisions when nesting modals, popovers, or dropdowns. Supports `onOpenAutoFocus` and `onCloseAutoFocus` lifecycle events. | Dedicated focus-scoping libraries handle complex edge cases like nested layers, portal boundaries, and programmatic lifecycle hooks with custom cancellation (`event.preventDefault()`) much more cleanly than single-container DOM query selectors. |
| **Accessibility Tree Hiding (Sibling Inertness)** | Relies on `aria-modal="true"` on the dialog element and CSS pointer-events / overlay click blockers. | Uses `@radix-ui/react-dialog` with `aria-hidden` tree-walking package (`aria-hidden` library). When the modal mounts, it traverses all sibling DOM trees and dynamically applies `aria-hidden="true"`, restoring them when the dialog unmounts. | Screen reader virtual cursor / rotor navigation can still traverse outside a modal if background siblings are not marked `aria-hidden` or `inert`. True accessibility isolation requires tree-level sibling hiding. |
| **Scroll Locking & Layout Shift** | Manually sets `document.body.style.overflow = "hidden"` on open and restores previous overflow on unmount. | Uses `react-remove-scroll` to lock scrolling. Automatically measures browser scrollbar width and applies compensating `padding-right` to `document.body` to prevent horizontal layout shift/jitter. | Simple `overflow: hidden` causes page layout shift when scrollbars disappear on desktop browsers. Robust libraries compensate for scrollbar width during lock. |
| **Outside Interaction & Dismissal** | Simple backdrop click listener checking `e.target === e.currentTarget`. | Uses `@radix-ui/react-dismissable-layer` (`DismissableLayer`). Handles pointerdown outside, touch interactions, nested overlays, focus outside detection, and custom `onPointerDownOutside` callbacks. | Outside click handling has subtle cross-browser timing quirks (e.g. mouseup vs mousedown, iframe clicks, touch drag dismissals) that require a dedicated dismissable layer. |
| **Tabs Architecture & Roving Focus** | Item-based structure with direct array index calculation and ref array management (`tabRefs.current[index]`). | Uses compound component pattern (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) powered by React Context and `@radix-ui/react-roving-focus` (`RovingFocusGroup`). Supports horizontal & vertical orientations (`orientation`) and RTL layouts (`dir="rtl"`). | Compound components provide greater compositional flexibility, allowing consumers to insert arbitrary DOM nodes, icons, or badges inside tab headers without breaking keyboard navigation loops. |

---

## Concrete Gaps Identified

### Gap 1: Sibling DOM Accessibility Tree Isolation (`aria-hidden` / `inert`)
* **Custom Implementation**: Our `AccessibleModal` applies `role="dialog"` and `aria-modal="true"`. While this is semantically correct according to WAI-ARIA, desktop screen reader users (e.g. NVDA, JAWS, or VoiceOver with rotor/virtual cursor navigation) can still browse DOM nodes outside the modal container unless background elements are made inert or hidden.
* **shadcn / Radix Implementation**: Radix UI automatically uses the `aria-hidden` helper to traverse the DOM tree outside the modal portal, applying `aria-hidden="true"` to all sibling containers and removing it upon unmount. This ensures screen reader focus cannot leak into background content under any browsing mode.

### Gap 2: Scrollbar Layout Shift Compensation on Body Scroll Lock
* **Custom Implementation**: When `AccessibleModal` opens, it locks background scrolling via `document.body.style.overflow = "hidden"`. On desktop browsers where scrollbars occupy layout width (e.g., Windows Chrome/Edge/Firefox), removing the scrollbar causes an abrupt 15–17px layout shift (content jumps to the right).
* **shadcn / Radix Implementation**: Radix UI delegates scroll locking to `react-remove-scroll`, which calculates `window.innerWidth - document.documentElement.clientWidth` and applies a compensating `padding-right` to the body element (and fixed elements with custom attributes), preventing page layout shudder.

### Gap 3: Nested Focus Trap Collision & Scope Stacking
* **Custom Implementation**: Our focus trap logic queries focusable elements inside `modalRef.current`. If a user opens a nested modal, tooltip, or dropdown menu from inside our custom modal, the keydown interceptor will either fight with the child element's focus management or trap focus within the outer parent.
* **shadcn / Radix Implementation**: Radix UI's `FocusScope` maintains a global stack of active scopes. When a nested dialog or popover opens, the inner `FocusScope` pauses the outer scope and takes precedence, seamlessly handing control back up the stack when dismissed.
